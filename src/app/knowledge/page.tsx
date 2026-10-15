'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CURRICULUM_TIERS, CURRICULUM_TOPICS } from '@/data/curriculum';
import { useProgress } from '@/context/ProgressContext';
import { BookOpen, Search, CheckCircle2, Circle, Clock, Award, ArrowRight, Terminal } from 'lucide-react';

export default function KnowledgeBaseIndex() {
  const { isTopicCompleted, toggleTopicCompleted } = useProgress();
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = CURRICULUM_TOPICS.filter((topic) => {
    if (selectedTier !== 'all' && topic.tierId !== selectedTier) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = topic.title.toLowerCase().includes(q);
      const matchSummary = topic.summary.toLowerCase().includes(q);
      const matchCategory = topic.category.toLowerCase().includes(q);
      const matchCerts = topic.certAlignments.some((c) => c.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchCategory && !matchCerts) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Technical Documentation Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Network Security Knowledge Base
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            In-depth engineering documentation, bit-level packet decodes, multi-vendor CLI configurations, and RFC citations spanning 5 comprehensive learning tiers.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons, RFCs, certs..."
            className="w-full bg-[#0a0f1a] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <button
          onClick={() => setSelectedTier('all')}
          className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
            selectedTier === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All Tiers ({CURRICULUM_TOPICS.length})
        </button>
        {CURRICULUM_TIERS.map((tier) => {
          const count = CURRICULUM_TOPICS.filter((t) => t.tierId === tier.id).length;
          return (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                selectedTier === tier.id
                  ? 'bg-slate-800 text-white border'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
              style={{
                borderColor: selectedTier === tier.id ? tier.color : undefined,
                color: selectedTier === tier.id ? tier.color : undefined,
              }}
            >
              Tier {tier.number}: {tier.badge} ({count})
            </button>
          );
        })}
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic) => {
          const completed = isTopicCompleted(topic.id);
          return (
            <div
              key={topic.id}
              className={`group rounded-2xl p-5 border transition-all flex flex-col justify-between hover:shadow-xl ${
                completed
                  ? 'bg-[#0a151b] border-emerald-500/40'
                  : 'bg-[#0a0f1a] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Tier + Checkbox */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase font-semibold">
                    {topic.tierName.split(':')[0]}
                  </span>

                  <button
                    onClick={() => toggleTopicCompleted(topic.id)}
                    className="flex items-center gap-1.5 text-xs transition-colors p-1"
                    title={completed ? 'Completed' : 'Mark as Complete'}
                  >
                    {completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Title & Summary */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>

                {/* Metadata Pills */}
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {topic.estimatedMinutes} mins
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                    {topic.difficulty}
                  </span>
                  {topic.labId && (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Terminal className="w-3 h-3" />
                      Lab
                    </span>
                  )}
                </div>

                {/* Aligned Certifications */}
                {topic.certAlignments.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <Award className="w-3 h-3 text-amber-400 shrink-0" />
                    {topic.certAlignments.slice(0, 2).map((cert, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300/90"
                      >
                        {cert.split('(')[0].trim()}
                      </span>
                    ))}
                    {topic.certAlignments.length > 2 && (
                      <span className="text-[10px] text-slate-500">
                        +{topic.certAlignments.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800/80 mt-4">
                <Link
                  href={`/knowledge/${topic.tierId}/${topic.slug}`}
                  className="flex items-center justify-between text-xs font-semibold text-cyan-400 hover:text-cyan-300 group/link"
                >
                  <span>Study Technical Lesson</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
