import React from 'react';
import Link from 'next/link';
import { Shield, Terminal, BookOpen, ExternalLink, Activity, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#060910] text-slate-400 text-xs">
      {/* Telemetry Status Bar */}
      <div className="border-b border-slate-800/60 bg-[#080c14] py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-slate-300 font-semibold">NetSecForge Node:</span>
              <span className="text-emerald-400">OPERATIONAL</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
              <Activity className="w-3 h-3 text-cyan-500" />
              <span>Conntrack State: 65,536 sessions/sec</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-500">
              <Cpu className="w-3 h-3 text-purple-400" />
              <span>BPF JIT & Packet Dissector: Synchronized</span>
            </div>
          </div>
          <div className="text-slate-500">
            <span>RFC Compliance: </span>
            <span className="text-cyan-400">791, 793, 8446, 7296, 7011</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Col 1: Platform Overview */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-base text-white tracking-tight">NetSecForge</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            High-density interactive learning platform and cybersecurity architecture knowledge base.
            Engineered for network security architects, SOC detection engineers, and certification candidates from zero to expert.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">
              Next.js 15 App Router
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400">
              React Flow Engine
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-rose-400">
              Live Hex Dissector
            </span>
          </div>
        </div>

        {/* Col 2: Curriculum Tiers */}
        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            Curriculum
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/knowledge/tier-0/osi-vs-tcpip-encapsulation" className="hover:text-cyan-400 transition-colors">
                Tier 0: Networking Foundations
              </Link>
            </li>
            <li>
              <Link href="/knowledge/tier-1/stateful-packet-inspection-nat-pat-mechanics" className="hover:text-emerald-400 transition-colors">
                Tier 1: Core Sec & Cryptography
              </Link>
            </li>
            <li>
              <Link href="/knowledge/tier-2/next-generation-firewalls-pan-os-fortigate-checkpoint" className="hover:text-purple-400 transition-colors">
                Tier 2: Enterprise NGFW & SASE
              </Link>
            </li>
            <li>
              <Link href="/knowledge/tier-3/network-telemetry-syslog-netflow-ipfix-zeek" className="hover:text-amber-400 transition-colors">
                Tier 3: SOC, SIEM & Cloud
              </Link>
            </li>
            <li>
              <Link href="/knowledge/tier-4/advanced-packet-forensics-wireshark-tcp-window-exhaustion" className="hover:text-rose-400 transition-colors">
                Tier 4: Offensive & DevSecOps
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Interactive Sandboxes */}
        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            Interactive Labs
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/roadmap" className="hover:text-cyan-400 transition-colors">
                Visual Learning Graph
              </Link>
            </li>
            <li>
              <Link href="/labs?tab=dissector" className="hover:text-cyan-400 transition-colors">
                Interactive Packet Dissector
              </Link>
            </li>
            <li>
              <Link href="/labs?tab=terminal" className="hover:text-cyan-400 transition-colors">
                Multi-Vendor Terminal Lab
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-cyan-400 transition-colors">
                Palo Alto & Fortinet Cheat Sheets
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-cyan-400 transition-colors">
                AlgoSec & Tufin NSPM Matrix
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Industry Credentials */}
        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            Certifications
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/certs?cert=comptia-security-plus" className="hover:text-emerald-400 transition-colors">
                CompTIA Security+ (SY0-701)
              </Link>
            </li>
            <li>
              <Link href="/certs?cert=cisco-ccna" className="hover:text-cyan-400 transition-colors">
                Cisco CCNA (200-301)
              </Link>
            </li>
            <li>
              <Link href="/certs?cert=palo-alto-pcnse" className="hover:text-orange-400 transition-colors">
                Palo Alto PCNSE
              </Link>
            </li>
            <li>
              <Link href="/certs?cert=fortinet-fcp-network-security" className="hover:text-red-400 transition-colors">
                Fortinet FCP (NSE 4-7)
              </Link>
            </li>
            <li>
              <Link href="/certs?cert=offsec-oscp" className="hover:text-rose-400 transition-colors">
                OffSec OSCP (PEN-200)
              </Link>
            </li>
            <li>
              <Link href="/certs?cert=isc2-cissp" className="hover:text-purple-400 transition-colors">
                (ISC)² CISSP Master Matrix
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800/80 py-4 px-4 text-center text-slate-500 text-xs">
        <p>© 2026 NetSecForge. Built for cybersecurity engineers and network defense practitioners.</p>
      </div>
    </footer>
  );
}
