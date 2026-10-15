'use client';

import React from 'react';
import Link from 'next/link';
import { CURRICULUM_TIERS, CURRICULUM_TOPICS } from '@/data/curriculum';
import { CERTIFICATIONS } from '@/data/certifications';
import { ENTERPRISE_PRODUCTS } from '@/data/products';
import { useProgress } from '@/context/ProgressContext';
import { PacketDissector } from '@/components/PacketDissector';
import {
  Shield,
  Terminal,
  Map,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  CheckCircle2,
  Activity,
  Cpu,
  Lock,
  ChevronRight,
  ExternalLink,
  Flame,
  Search,
} from 'lucide-react';

export default function HomePage() {
  const { getTierProgress, getOverallProgress, isTopicCompleted } = useProgress();
  const overall = getOverallProgress();

  return (
    <div className="w-full space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-[#0c1424] via-[#080d18] to-[#080c14]">
        {/* Cyber Radar / Glow Ambient Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-600/10 via-emerald-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8 text-center sm:text-left">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>NetSecForge v2.6 // Enterprise Architecture & Defense Lab</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Master Network Security &amp; Cyber Defense{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  Zero to Expert.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                High-density interactive learning platform combining bit-level packet decodes, multi-vendor firewall architectures (Palo Alto, Fortinet, Check Point, Cisco), live React Flow topology graphs, simulated terminal sandboxes, and full certification alignment.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <Link
                  href="/roadmap"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_-3px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_-3px_rgba(6,182,212,0.6)] cursor-pointer"
                >
                  <Map className="w-4 h-4" />
                  Explore Visual Roadmap
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/labs"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <Terminal className="w-4 h-4" />
                  Interactive Lab Sandbox
                </Link>

                <Link
                  href="/certs"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs sm:text-sm transition-colors"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  Cert Readiness ({overall.percent}%)
                </Link>
              </div>
            </div>

            {/* Right Metric Card */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0b101c]/90 border border-slate-700/80 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Platform Telemetry
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">
                  LIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-2xl font-bold font-mono text-cyan-400">5 Tiers</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Foundations to Expert</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-2xl font-bold font-mono text-emerald-400">20+ Lessons</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Deep RFC & Vendor Specs</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-2xl font-bold font-mono text-purple-400">12 Certs</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">CCNA, PCNSE, Sec+, CISSP</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-2xl font-bold font-mono text-rose-400">10 Tools</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Palo, Forti, AlgoSec, Tufin</p>
                </div>
              </div>

              {/* User Progress Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Your Curriculum Progress</span>
                  <span className="text-emerald-400 font-bold">{overall.percent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${overall.percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tiered Curriculum Roadmap Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Taxonomy & Learning Paths
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Zero-to-Expert Curriculum Tiers
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Progressive mastery from bit-level encapsulation to offensive auditing and Policy-as-Code.
            </p>
          </div>

          <Link
            href="/roadmap"
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
          >
            Launch Interactive Topology Graph →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURRICULUM_TIERS.map((tier) => {
            const progress = getTierProgress(tier.id);
            return (
              <div
                key={tier.id}
                className="group relative rounded-2xl bg-[#0a0f1a] border border-slate-800 hover:border-slate-700 p-5 transition-all flex flex-col justify-between hover:shadow-xl space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase"
                      style={{
                        backgroundColor: `${tier.color}15`,
                        color: tier.color,
                        border: `1px solid ${tier.color}40`,
                      }}
                    >
                      {tier.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {progress.completedCount}/{progress.totalCount} Done
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {tier.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  {/* Tier progress bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${progress.percent}%`,
                        backgroundColor: tier.color,
                      }}
                    />
                  </div>
                </div>

                {/* Subtopics preview */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Core Modules:
                  </span>
                  <div className="space-y-1">
                    {CURRICULUM_TOPICS.filter((t) => t.tierId === tier.id)
                      .slice(0, 3)
                      .map((topic) => {
                        const done = isTopicCompleted(topic.id);
                        return (
                          <Link
                            key={topic.id}
                            href={`/knowledge/${topic.tierId}/${topic.slug}`}
                            className="flex items-center justify-between text-xs text-slate-300 hover:text-cyan-400 p-1 rounded hover:bg-slate-900 transition-colors"
                          >
                            <span className="truncate pr-2">{topic.title}</span>
                            {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          </Link>
                        );
                      })}
                  </div>

                  <Link
                    href={`/knowledge`}
                    className="pt-2 flex items-center justify-between text-xs font-semibold text-cyan-400 hover:text-cyan-300 group/link"
                  >
                    <span>View All {tier.title.split(':')[0]} Lessons</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Interactive Packet Dissector Sandbox Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                Hands-On Dissection Sandbox
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Interactive Packet Dissector &amp; Byte Inspector
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select real packet captures (TCP SYN, DNSSEC, TLS 1.3, Port Scans), inspect protocol headers, and synchronize byte offsets into raw hexadecimal memory.
            </p>
          </div>

          <Link
            href="/labs"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-300 text-xs font-semibold font-mono transition-colors"
          >
            Open Full Labs Sandbox →
          </Link>
        </div>

        {/* Embedded Packet Dissector Component */}
        <PacketDissector />
      </section>

      {/* Enterprise Products & Security Tooling Matrix Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#090f1d] to-[#080d18] border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
                Multi-Vendor Architecture
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Enterprise Product &amp; Tooling Repository
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Deep architectural breakdowns, CLI cheat sheets, and common misconfigurations for industry-standard NGFWs (Palo Alto, Fortinet, Check Point), NSPM orchestration (AlgoSec, Tufin), and SIEM/EDR platforms.
              </p>
            </div>

            <Link
              href="/products"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shrink-0"
            >
              <Layers className="w-4 h-4" />
              Explore Tool Matrix
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ENTERPRISE_PRODUCTS.slice(0, 6).map((prod) => (
              <Link
                key={prod.id}
                href={`/products?product=${prod.id}`}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all text-left group"
              >
                <span className="text-[10px] font-mono text-purple-400 block mb-1">
                  {prod.vendor}
                </span>
                <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {prod.name}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{prod.badge}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Alignment Matrix Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
            Industry Credentials
          </span>
          <h2 className="text-2xl font-extrabold text-white">
            12+ Industry Certifications Mapped Directly
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Every lesson, packet decode, and lab scenario is cross-referenced with official vendor exam domains.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CERTIFICATIONS.map((cert) => (
            <Link
              key={cert.id}
              href={`/certs?cert=${cert.id}`}
              className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 hover:border-slate-700 transition-colors text-center group space-y-1"
            >
              <span
                className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase inline-block"
                style={{
                  backgroundColor: `${cert.badgeColor}20`,
                  color: cert.badgeColor,
                }}
              >
                {cert.vendor}
              </span>
              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                {cert.code}
              </h4>
              <p className="text-[10px] text-slate-400 line-clamp-1">{cert.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
