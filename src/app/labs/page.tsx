'use client';

import React, { useState } from 'react';
import { TerminalSimulator } from '@/components/TerminalSimulator';
import { PacketDissector } from '@/components/PacketDissector';
import { Terminal, Network, Shield, Cpu, Sparkles } from 'lucide-react';

export default function InteractiveLabsPage() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'dissector'>('terminal');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400">
              <Terminal className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Hands-On Simulation Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Interactive Labs &amp; Packet Sandboxes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Test and validate your technical skills without risk. Practice syntax in multi-vendor simulated terminals and dissect real packet capture byte frames in real time.
          </p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'terminal'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            Multi-Vendor Terminal Lab
          </button>
          <button
            onClick={() => setActiveTab('dissector')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'dissector'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-4 h-4 text-cyan-400" />
            Packet Dissector &amp; Hex Dump
          </button>
        </div>
      </div>

      {/* Lab Sandbox Component */}
      <div className="pt-2">
        {activeTab === 'terminal' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Live Syntax Validation &amp; Configuration Scenarios
              </span>
              <span className="font-mono text-slate-500">Supports Cisco, Palo Alto, Linux, Snort</span>
            </div>
            <TerminalSimulator />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Synchronized Byte Layer Dissection
              </span>
              <span className="font-mono text-slate-500">RFC 791, 793, 8446 standard decodes</span>
            </div>
            <PacketDissector />
          </div>
        )}
      </div>
    </div>
  );
}
