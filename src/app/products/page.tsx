'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ENTERPRISE_PRODUCTS } from '@/data/products';
import { EnterpriseProduct } from '@/types';
import {
  Layers,
  Search,
  Terminal,
  Shield,
  AlertTriangle,
  Server,
  Award,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';

export default function EnterpriseProductsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProduct, setActiveProduct] = useState<EnterpriseProduct>(ENTERPRISE_PRODUCTS[0]);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'NGFW & Edge', label: 'NGFW & Edge' },
    { id: 'NSPM & Microsegmentation', label: 'NSPM & Microseg' },
    { id: 'SIEM & SOC', label: 'SIEM & SOC' },
    { id: 'Monitoring & Telemetry', label: 'Monitoring & Telemetry' },
  ];

  const filteredProducts = ENTERPRISE_PRODUCTS.filter((prod) => {
    if (activeCategory !== 'all' && prod.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchVendor = prod.vendor.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      if (!matchName && !matchVendor && !matchDesc) return false;
    }
    return true;
  });

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-950 border border-purple-800 text-purple-400">
              <Layers className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
              Tooling &amp; Architecture Repository
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Enterprise Security Product Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            In-depth architectural breakdowns, CLI operation cheat sheets, and common misconfigurations for Next-Gen Firewalls (Palo Alto, Fortinet, Check Point), NSPM automation suites (AlgoSec, Tufin), and SIEM/EDR platforms.
          </p>
        </div>

        {/* Live Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendor tools, CLI..."
            className="w-full bg-[#0a0f1a] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
              activeCategory === cat.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Product Cards Selector (Left) & Active Product Deep Profile (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs font-mono uppercase text-slate-500 block pb-1">
            Select Tool ({filteredProducts.length} Available)
          </span>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {filteredProducts.map((prod) => {
              const isSelected = activeProduct.id === prod.id;
              return (
                <div
                  key={prod.id}
                  onClick={() => setActiveProduct(prod)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#101726] border-purple-500 shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]'
                      : 'bg-[#0a0f1a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                      {prod.vendor}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {prod.category}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white group-hover:text-purple-300">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                    {prod.badge}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Product Profile (8 cols) */}
        <div className="lg:col-span-8 bg-[#0b101c] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          {/* Product Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold uppercase">
                  {activeProduct.category}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {activeProduct.badge}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{activeProduct.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{activeProduct.description}</p>
            </div>

            {/* Related Certifications */}
            {activeProduct.relatedCertifications.length > 0 && (
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                  Target Credentials
                </span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {activeProduct.relatedCertifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Architecture Pillars */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" />
              Core Architecture &amp; Processing Engines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeProduct.keyArchitecture.map((arch, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#080d18] border border-slate-800/80 text-xs text-slate-300 space-y-1"
                >
                  <span className="text-white font-semibold block">
                    {arch.split(':')[0]}:
                  </span>
                  <span className="text-slate-400 text-[11px] leading-relaxed">
                    {arch.split(':')[1] || arch}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CLI Operation Cheat Sheet */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Operational CLI Cheat Sheet &amp; Commands
            </h3>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#060a12] divide-y divide-slate-800/80 font-mono text-xs">
              {activeProduct.cliCheatSheet.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 flex items-start justify-between gap-4 hover:bg-slate-900/50 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="text-cyan-300 font-semibold text-xs whitespace-pre-wrap">
                      {item.command}
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans">
                      {item.purpose}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(item.command)}
                    className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                    title="Copy command"
                  >
                    {copiedCmd === item.command ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Common Misconfigurations & Security Risks */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Common Architectural Misconfigurations &amp; Risks
            </h3>
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2 text-xs text-rose-200">
              {activeProduct.commonMisconfigurations.map((misc, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                  <span>{misc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Topologies */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Standard Production Deployment Topologies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {activeProduct.deploymentPatterns.map((pat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300"
                >
                  <span className="font-semibold text-white block mb-0.5">
                    {pat.split(':')[0]}:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {pat.split(':')[1] || pat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
