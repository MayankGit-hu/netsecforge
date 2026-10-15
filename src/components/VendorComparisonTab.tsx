'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, Shield, Layers } from 'lucide-react';

interface VendorSyntaxItem {
  vendor: 'Cisco' | 'Palo Alto' | 'Fortinet' | 'Check Point' | 'Linux' | 'Snort';
  context: string;
  configSnippet: string;
  notes: string;
}

export function VendorComparisonTab({
  items,
}: {
  items: VendorSyntaxItem[];
}) {
  const [activeVendor, setActiveVendor] = useState<string>(items[0]?.vendor || 'Cisco');
  const [copied, setCopied] = useState<string | null>(null);

  if (!items || items.length === 0) return null;

  const currentItem = items.find((i) => i.vendor === activeVendor) || items[0];

  const handleCopy = (text: string, vendor: string) => {
    navigator.clipboard.writeText(text);
    setCopied(vendor);
    setTimeout(() => setCopied(null), 2000);
  };

  const getVendorColor = (vendor: string) => {
    switch (vendor) {
      case 'Cisco':
        return '#0284c7';
      case 'Palo Alto':
        return '#ea580c';
      case 'Fortinet':
        return '#dc2626';
      case 'Check Point':
        return '#0ea5e9';
      case 'Linux':
        return '#10b981';
      case 'Snort':
        return '#f59e0b';
      default:
        return '#06b6d4';
    }
  };

  return (
    <div className="w-full bg-[#0a0f1a] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#060a12] border-b border-slate-800 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold text-white font-mono uppercase tracking-wider hidden sm:inline">
            Vendor Comparison:
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {items.map((item) => {
            const isActive = activeVendor === item.vendor;
            const color = getVendorColor(item.vendor);
            return (
              <button
                key={item.vendor}
                onClick={() => setActiveVendor(item.vendor)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
                style={{
                  borderColor: isActive ? `${color}70` : undefined,
                  color: isActive ? color : undefined,
                }}
              >
                {item.vendor}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            {currentItem.context}
          </span>
          <button
            onClick={() => handleCopy(currentItem.configSnippet, currentItem.vendor)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-[11px] transition-colors cursor-pointer"
          >
            {copied === currentItem.vendor ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Snippet Box */}
        <pre className="p-3.5 rounded-lg bg-[#04070e] border border-slate-800/80 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed scanline">
          <code>{currentItem.configSnippet}</code>
        </pre>

        {/* Vendor Notes */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
          <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-200">Implementation Note:</strong> {currentItem.notes}
          </span>
        </div>
      </div>
    </div>
  );
}
