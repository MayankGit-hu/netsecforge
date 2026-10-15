'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CERTIFICATIONS } from '@/data/certifications';
import { CURRICULUM_TOPICS } from '@/data/curriculum';
import { Certification, PracticeQuestion } from '@/types';
import { useProgress } from '@/context/ProgressContext';
import { Award, CheckCircle2, Circle, ArrowRight, HelpCircle, Sparkles, BookOpen, Clock, DollarSign, Target } from 'lucide-react';

export function CertTracker({ initialCertId }: { initialCertId?: string }) {
  const { getCertReadiness, isTopicCompleted, toggleTopicCompleted } = useProgress();

  const [activeCert, setActiveCert] = useState<Certification>(() => {
    return CERTIFICATIONS.find((c) => c.id === initialCertId) || CERTIFICATIONS[0];
  });

  // Practice exam state
  const [activeQuestion, setActiveQuestion] = useState<PracticeQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const readinessScore = getCertReadiness(activeCert.id);

  const handleSelectQuestion = (q: PracticeQuestion) => {
    setActiveQuestion(q);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Certification Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {CERTIFICATIONS.map((cert) => {
          const score = getCertReadiness(cert.id);
          const isSelected = activeCert.id === cert.id;
          return (
            <button
              key={cert.id}
              onClick={() => {
                setActiveCert(cert);
                setActiveQuestion(null);
              }}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-[#0f172a] border-cyan-500 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]'
                  : 'bg-[#0a0f1a] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase"
                  style={{
                    backgroundColor: `${cert.badgeColor}20`,
                    color: cert.badgeColor,
                    borderColor: `${cert.badgeColor}40`,
                  }}
                >
                  {cert.level}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {score}%
                </span>
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                {cert.code}
              </h4>
              <p className="text-[10px] text-slate-400 line-clamp-1">{cert.name}</p>

              {/* Mini progress bar */}
              <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Cert Profile & Readiness Dashboard */}
      <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header with Circular / Pill Readiness Gauge */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold"
                style={{
                  backgroundColor: `${activeCert.badgeColor}20`,
                  color: activeCert.badgeColor,
                  border: `1px solid ${activeCert.badgeColor}50`,
                }}
              >
                {activeCert.vendor}
              </span>
              <h2 className="text-xl font-bold text-white">
                {activeCert.code}: {activeCert.name}
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{activeCert.summary}</p>

            {/* Exam metadata pills */}
            <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400 font-mono flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {activeCert.examDetails.duration}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Pass: {activeCert.examDetails.passingScore}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                {activeCert.examDetails.cost}
              </span>
            </div>
          </div>

          {/* Readiness Score Card */}
          <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-700"
                  strokeDasharray={`${readinessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-bold text-white font-mono leading-none">
                  {readinessScore}%
                </span>
                <span className="block text-[8px] text-slate-400 uppercase font-mono mt-0.5">
                  Readiness
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-white mb-0.5">Curriculum Readiness</div>
              <p className="text-[11px] text-slate-400 mb-2">
                Based on completed NetSecForge curriculum topics mapped to exam domains.
              </p>
              <div className="text-[10px] font-mono text-emerald-400">
                {readinessScore >= 80 ? '✓ Exam Ready' : 'In Progress - Review Domains Below'}
              </div>
            </div>
          </div>
        </div>

        {/* Domain-by-Domain Syllabus Breakdown */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider font-mono flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            Official Exam Domains & NetSecForge Topic Mapping
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCert.domains.map((domain, dIdx) => {
              // Calculate domain completion %
              const domainTopics = CURRICULUM_TOPICS.filter((t) =>
                domain.mappedTopicIds.includes(t.id)
              );
              const completedInDomain = domainTopics.filter((t) => isTopicCompleted(t.id)).length;
              const domainPercent =
                domainTopics.length === 0
                  ? 0
                  : Math.round((completedInDomain / domainTopics.length) * 100);

              return (
                <div
                  key={dIdx}
                  className="p-4 rounded-xl bg-[#080d18] border border-slate-800/90 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{domain.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Exam Weight: {domain.weightPercent}%
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {domainPercent}%
                    </span>
                  </div>

                  {/* Domain progress bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-300"
                      style={{ width: `${domainPercent}%` }}
                    />
                  </div>

                  {/* Key Exam Topics */}
                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-500 font-semibold block mb-1">Key Focus Topics:</span>
                    <div className="flex flex-wrap gap-1">
                      {domain.keyTopics.map((kt, kIdx) => (
                        <span
                          key={kIdx}
                          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                        >
                          {kt}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mapped NetSecForge Lessons Checklist */}
                  {domainTopics.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">
                        Mapped Study Modules:
                      </span>
                      {domainTopics.map((topic) => {
                        const done = isTopicCompleted(topic.id);
                        return (
                          <div
                            key={topic.id}
                            className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-slate-800/40 transition-colors"
                          >
                            <button
                              onClick={() => toggleTopicCompleted(topic.id)}
                              className="flex items-center gap-2 text-left"
                            >
                              {done ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                              )}
                              <span
                                className={`text-[11px] line-clamp-1 ${
                                  done ? 'text-slate-400 line-through' : 'text-slate-200'
                                }`}
                              >
                                {topic.title}
                              </span>
                            </button>

                            <Link
                              href={`/knowledge/${topic.tierId}/${topic.slug}`}
                              className="text-cyan-400 hover:text-cyan-300 p-1 text-[11px] shrink-0 font-mono"
                              title="Study lesson"
                            >
                              Study →
                            </Link>
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

        {/* Practice Question Drill Section */}
        {activeCert.practiceQuestions.length > 0 && (
          <div className="pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Exam Practice Questions Drill
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {activeCert.practiceQuestions.length} High-Yield Scenario Questions
              </span>
            </div>

            <div className="space-y-4">
              {activeCert.practiceQuestions.map((q, qIdx) => {
                const isCurrent = activeQuestion?.id === q.id;
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-[#080d18] border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300">
                        {q.domain}
                      </span>
                      <span>Scenario #{qIdx + 1}</span>
                    </div>

                    <p className="text-xs font-semibold text-slate-100 leading-relaxed">
                      {q.question}
                    </p>

                    {/* Multiple choice options */}
                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80';
                        if (isCurrent && selectedOption === optIdx) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                          } else {
                            btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                          }
                        } else if (isCurrent && showExplanation && optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              setActiveQuestion(q);
                              setSelectedOption(optIdx);
                              setShowExplanation(true);
                            }}
                            className={`w-full p-2.5 rounded-lg border text-left text-xs font-mono transition-all flex items-start gap-2 ${btnStyle}`}
                          >
                            <span className="font-bold text-slate-400 shrink-0">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span className="whitespace-pre-wrap">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Reveal */}
                    {isCurrent && showExplanation && (
                      <div className="p-3 rounded-lg bg-[#0c1424] border border-slate-700/80 text-xs space-y-1 animate-in fade-in">
                        <div className="flex items-center gap-1.5 font-bold">
                          {selectedOption === q.correctIndex ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">
                              <HelpCircle className="w-4 h-4" /> Incorrect.
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
