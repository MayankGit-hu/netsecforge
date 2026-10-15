'use client';

import React, { useState } from 'react';
import { PACKET_SAMPLES } from '@/data/labs';
import { PacketSample, PacketFieldDissected } from '@/types';
import { Network, ShieldAlert, Cpu, Eye, ChevronRight, ChevronDown, Check, Info } from 'lucide-react';

export function PacketDissector({ initialSampleId }: { initialSampleId?: string }) {
  const [selectedSample, setSelectedSample] = useState<PacketSample>(() => {
    return PACKET_SAMPLES.find((s) => s.id === initialSampleId) || PACKET_SAMPLES[0];
  });

  const [activeField, setActiveField] = useState<PacketFieldDissected | null>(null);
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({
    'Layer 2 - Data Link': true,
    'Layer 3 - Network': true,
    'Layer 4 - Transport': true,
    'Layer 7 - Application': true,
  });

  const toggleLayer = (layerName: string) => {
    setExpandedLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  // Parse raw hex string into array of byte pairs
  const bytePairs = React.useMemo(() => {
    const hex = selectedSample.rawHex;
    const pairs: string[] = [];
    for (let i = 0; i < hex.length; i += 2) {
      pairs.push(hex.substring(i, i + 2));
    }
    return pairs;
  }, [selectedSample]);

  // Group bytes into 16-byte rows
  const hexRows = React.useMemo(() => {
    const rows = [];
    for (let i = 0; i < bytePairs.length; i += 16) {
      const slice = bytePairs.slice(i, i + 16);
      const ascii = slice
        .map((b) => {
          const code = parseInt(b, 16);
          return code >= 32 && code <= 126 ? String.fromCharCode(code) : '.';
        })
        .join('');
      rows.push({
        offset: i,
        offsetHex: i.toString(16).padStart(4, '0'),
        bytes: slice,
        ascii,
      });
    }
    return rows;
  }, [bytePairs]);

  const isByteActive = (byteIndex: number) => {
    if (!activeField) return false;
    const [start, end] = activeField.byteRange;
    return byteIndex >= start && byteIndex <= end;
  };

  return (
    <div className="w-full bg-[#0a0f1a] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Sample Selector Tabs */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#070b14] border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white tracking-wide uppercase font-mono">
            Packet Frame Selector:
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {PACKET_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => {
                setSelectedSample(sample);
                setActiveField(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSample.id === sample.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_-2px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {sample.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario & Security Insight Banner */}
      <div className="p-4 bg-[#0d1424] border-b border-slate-800 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white mb-0.5">{selectedSample.title}</h3>
            <p className="text-xs text-slate-400">{selectedSample.scenario}</p>
          </div>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-mono text-cyan-400 shrink-0 border border-slate-700">
            {selectedSample.captureType}
          </span>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong className="text-rose-200">Security Architecture Insight:</strong>{' '}
            {selectedSample.securityInsight}
          </span>
        </div>
      </div>

      {/* Main Grid: Dissected Tree (Left) & Synchronized Hex View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left Column: Dissected Protocol Tree (7 cols) */}
        <div className="lg:col-span-7 p-4 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto max-h-[550px] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800/60">
            <span className="font-semibold uppercase font-mono">Dissected Protocol Layers</span>
            <span className="text-[11px] text-slate-500">Click field to synchronize hex bytes</span>
          </div>

          <div className="space-y-2">
            {selectedSample.layers.map((layer) => {
              const isExpanded = expandedLayers[layer.layer] !== false;
              return (
                <div
                  key={layer.layer}
                  className="rounded-lg bg-[#080d17] border border-slate-800/80 overflow-hidden"
                >
                  {/* Layer Header */}
                  <button
                    onClick={() => toggleLayer(layer.layer)}
                    className="w-full flex items-center justify-between p-2.5 text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span
                        className="text-xs font-bold font-mono"
                        style={{ color: layer.color }}
                      >
                        {layer.layer}
                      </span>
                      <span className="text-[11px] text-slate-300 font-semibold">
                        ({layer.protocol})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                      {layer.fields.length} fields
                    </span>
                  </button>

                  {/* Layer Summary Line */}
                  <div className="px-3 pb-2 text-[11px] text-slate-400 font-mono">
                    {layer.summary}
                  </div>

                  {/* Dissected Fields Table */}
                  {isExpanded && (
                    <div className="divide-y divide-slate-800/60 border-t border-slate-800/60 bg-[#060a12]">
                      {layer.fields.map((field, idx) => {
                        const isSelected = activeField?.name === field.name;
                        return (
                          <div
                            key={idx}
                            onClick={() => setActiveField(isSelected ? null : field)}
                            className={`p-2.5 cursor-pointer text-xs transition-colors flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-cyan-950/50 border-l-2 border-cyan-400 text-cyan-200'
                                : 'hover:bg-slate-800/50 text-slate-300'
                            }`}
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-200">
                                  {field.name}:
                                </span>
                                <span className="font-mono text-cyan-300 text-[11px] truncate">
                                  {field.value}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                {field.description}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 shrink-0">
                              Byte [{field.byteRange[0]}-{field.byteRange[1]}]
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Hex & ASCII Dump (5 cols) */}
        <div className="lg:col-span-5 p-4 bg-[#050810] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 mb-2 border-b border-slate-800/80">
              <span className="font-semibold uppercase font-mono flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Packet Byte Dissector (Hex / ASCII)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {bytePairs.length} Total Octets
              </span>
            </div>

            {/* Selected Field Inspector Pill */}
            {activeField ? (
              <div className="mb-3 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/50 text-xs text-cyan-200 animate-in fade-in">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">{activeField.name}</span>
                  <span className="font-mono text-[10px] text-cyan-400">
                    Hex: 0x{activeField.hexBytes}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{activeField.description}</p>
              </div>
            ) : (
              <div className="mb-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Hover or select any layer field on the left to highlight its bytes.</span>
              </div>
            )}

            {/* Hex Dump Table */}
            <div className="font-mono text-[11px] leading-relaxed bg-[#03060c] p-3 rounded-lg border border-slate-800/80 overflow-x-auto space-y-1">
              <div className="text-slate-500 border-b border-slate-800/60 pb-1 mb-1 text-[10px] flex justify-between">
                <span>Offset</span>
                <span>00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F</span>
                <span className="hidden sm:inline">Decoded ASCII</span>
              </div>

              {hexRows.map((row) => (
                <div key={row.offset} className="flex items-center justify-between gap-2">
                  {/* Address Offset */}
                  <span className="text-slate-500 select-none">{row.offsetHex}:</span>

                  {/* Hex Octets */}
                  <div className="flex items-center gap-1">
                    {row.bytes.map((byte, bIdx) => {
                      const byteIndex = row.offset + bIdx;
                      const active = isByteActive(byteIndex);
                      return (
                        <span
                          key={bIdx}
                          className={`px-0.5 rounded transition-all ${
                            active
                              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                              : 'text-slate-300 hover:text-cyan-300'
                          }`}
                        >
                          {byte}
                        </span>
                      );
                    })}
                  </div>

                  {/* ASCII column */}
                  <span className="text-slate-500 select-none hidden sm:inline">
                    {row.ascii}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Dissector Tools */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px]">BPF Dissector: Verified</span>
            <button
              onClick={() => setActiveField(null)}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
