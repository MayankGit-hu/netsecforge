import React from 'react';
import { Metadata } from 'next';
import { CertTracker } from '@/components/CertTracker';
import { Award, Compass, Sparkles, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Certification Alignment Engine | NetSecForge',
  description:
    'Comprehensive network security certification tracking for CompTIA (Sec+, Net+), Cisco (CCNA, CCNP Security), Palo Alto (PCNSE), Fortinet, AWS, OSCP, and CISSP.',
};

export default function CertsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-950 border border-amber-800 text-amber-400">
              <Award className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
              Certification Alignment Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Enterprise Certification Tracker &amp; Practice Drills
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Track your exam readiness percentage across 12+ industry credentials. Every domain is mapped directly to NetSecForge technical lessons with high-yield scenario questions.
          </p>
        </div>
      </div>

      {/* Main Cert Tracker Component */}
      <CertTracker />
    </div>
  );
}
