import React from 'react';
import { Metadata } from 'next';
import { RoadmapFlow } from '@/components/RoadmapFlow';
import { Map, Info, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Visual Learning Roadmap | NetSecForge',
  description:
    'Interactive React Flow network security learning path with prerequisite tracking, node-locking, and certification domain alignment.',
};

export default function RoadmapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Map className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Interactive Topology Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Visual Cyber Security Learning Path
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Navigate the complete Zero-to-Expert taxonomy. Click on any module to review prerequisites, aligned certification domains, standards (RFCs), and launch hands-on technical labs.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#090f1d] border border-slate-800 text-xs font-mono shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-400">Tier 0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Tier 1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span className="text-slate-400">Tier 2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-400">Tier 3</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-slate-400">Tier 4</span>
          </div>
        </div>
      </div>

      {/* Main React Flow Graph Canvas */}
      <RoadmapFlow />

      {/* Quick Guide & Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-xl bg-[#0a0f1a] border border-slate-800 flex items-start gap-3">
          <Compass className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white">Interactive Zoom &amp; Pan</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Use mouse wheel to zoom or drag to pan across tiers. Use the bottom-left controls to center and fit view.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0f1a] border border-slate-800 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white">Node-Locking &amp; Completion</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Check off completed modules directly on the node circles. Progress syncs automatically with your Certification Readiness score.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0f1a] border border-slate-800 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white">Prerequisite Directed Edges</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Animated arrows highlight strict dependencies (e.g. Master OSI before Stateful Filtering; Master Crypto before IPsec VPNs).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
