'use client';

import React from 'react';
import Link from 'next/link';
import { CurriculumTopic } from '@/types';
import { useProgress } from '@/context/ProgressContext';
import { VendorComparisonTab } from '@/components/VendorComparisonTab';
import { FlowDiagram } from '@/components/FlowDiagram';
import { QuizWidget } from '@/components/QuizWidget';
import { PacketFlowAnimation } from '@/components/PacketFlowAnimation';
import { BitfieldDissector } from '@/components/BitfieldDissector';
import { TcpSlidingWindowSimulator } from '@/components/TcpSlidingWindowSimulator';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  Terminal,
  ExternalLink,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  Lightbulb,
  Map,
  Activity,
  Zap,
  Binary,
  Gauge,
} from 'lucide-react';

interface LessonContentProps {
  topic: CurriculumTopic;
  prevTopic: CurriculumTopic | null;
  nextTopic: CurriculumTopic | null;
}

export function LessonContent({ topic, prevTopic, nextTopic }: LessonContentProps) {
  const { isTopicCompleted, toggleTopicCompleted } = useProgress();
  const isCompleted = isTopicCompleted(topic.id);
  const [activeSimTab, setActiveSimTab] = React.useState<'flow' | 'bitfield' | 'sliding-window'>('flow');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Link href="/knowledge" className="hover:text-cyan-400 transition-colors">
            Knowledge Base
          </Link>
          <span>/</span>
          <span className="text-slate-300">{topic.tierName.split(':')[0]}</span>
          <span>/</span>
          <span className="text-cyan-400 truncate max-w-xs">{topic.title}</span>
        </div>

        <Link
          href="/knowledge"
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Directory
        </Link>
      </div>

      {/* Lesson Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0f1a] border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold uppercase">
                {topic.tierName}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                {topic.category}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                {topic.difficulty}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              {topic.title}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">{topic.summary}</p>
          </div>

          {/* Mark Complete Toggle Button */}
          <button
            onClick={() => toggleTopicCompleted(topic.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Lesson Completed
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-slate-500" />
                Mark as Completed
              </>
            )}
          </button>
        </div>

        {/* Metadata Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              Est. Study Time: {topic.estimatedMinutes} Mins
            </span>
            {topic.prerequisites.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-400" />
                Prerequisites: {topic.prerequisites.join(', ')}
              </span>
            )}
          </div>

          {topic.labId && (
            <Link
              href={`/labs?lab=${topic.labId}`}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:text-white transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              Practice in Interactive Lab →
            </Link>
          )}
        </div>
      </div>

      {/* Aligned Certifications & Standards Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aligned Certifications */}
        <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Aligned Certification Exam Domains:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topic.certAlignments.map((cert, idx) => (
              <Link
                key={idx}
                href="/certs"
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 hover:border-amber-500/50 transition-colors"
              >
                {cert} ↗
              </Link>
            ))}
          </div>
        </div>

        {/* Standards & RFC Citations */}
        <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Official IETF RFCs &amp; Standards:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topic.rfcs.length > 0 ? (
              topic.rfcs.map((rfc, idx) => (
                <a
                  key={idx}
                  href={rfc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {rfc.number}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))
            ) : (
              <span className="text-xs text-slate-500">Industry Practice / Multi-Vendor</span>
            )}
          </div>
        </div>
      </div>

      {/* Beginner Explanation (ELI5) */}
      {topic.beginner && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            The &quot;Explain Like I&apos;m 5&quot; (Beginner Overview)
          </h2>
          <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-900/50 text-sm text-slate-200 leading-relaxed space-y-4 shadow-inner">
            <p className="font-semibold text-amber-200 text-base">{topic.beginner.whatIsIt}</p>
            <div className="p-4 rounded-xl bg-black/40 border border-amber-900/30">
              <span className="text-amber-500 font-mono text-xs block mb-2">ANALOGY:</span>
              <p className="text-slate-300 italic">{topic.beginner.realWorldAnalogy}</p>
            </div>
            <p className="text-slate-300">{topic.beginner.whyItMatters}</p>
            {topic.beginner.commonMisconception && (
              <div className="mt-4 pt-4 border-t border-amber-900/30">
                <span className="text-amber-600 font-bold text-xs block mb-1">COMMON MISCONCEPTION:</span>
                <p className="text-slate-400 italic text-xs">{topic.beginner.commonMisconception}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Architectural Deep Dive */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          Architectural Deep Dive
        </h2>
        <div className="p-6 rounded-2xl bg-[#080d18] border border-slate-800/90 text-sm text-slate-300 leading-relaxed space-y-4">
          <p>{topic.overview}</p>
        </div>
      </section>

      {/* Key Concepts Breakdown */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          Technical Key Concepts &amp; Mechanics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topic.keyConcepts.map((concept, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-xs font-mono font-bold">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-bold text-white">{concept.title}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{concept.explanation}</p>
              {concept.command && (
                <div className="mt-2 p-2 rounded bg-black border border-slate-800 font-mono text-xs text-emerald-400">
                  {concept.command}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Simulation Laboratory Suite (Specific to OSI & TCP/IP) */}
      {topic.id === 'osi-tcpip-model' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Interactive Protocol Simulation Laboratory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Explore real-time bidirectional flow, bit-by-bit packet dissections, and TCP sliding window flow control.
              </p>
            </div>

            {/* Tab switchers */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono shrink-0">
              <button
                onClick={() => setActiveSimTab('flow')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSimTab === 'flow'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                1. 2-Way Packet Flow
              </button>
              <button
                onClick={() => setActiveSimTab('bitfield')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSimTab === 'bitfield'
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Binary className="w-3.5 h-3.5" />
                2. Bit-by-Bit Dissector
              </button>
              <button
                onClick={() => setActiveSimTab('sliding-window')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSimTab === 'sliding-window'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Gauge className="w-3.5 h-3.5" />
                3. TCP Sliding Window
              </button>
            </div>
          </div>

          {activeSimTab === 'flow' && <PacketFlowAnimation />}
          {activeSimTab === 'bitfield' && <BitfieldDissector />}
          {activeSimTab === 'sliding-window' && <TcpSlidingWindowSimulator />}
        </section>
      )}

      {/* Step by Step Flow */}
      {topic.stepByStep && topic.stepByStep.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-400" />
            Step-by-Step Flow
          </h2>
          <div className="space-y-3">
            {topic.stepByStep.map((step, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl bg-[#090e1a] border border-slate-800">
                <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold font-mono">
                  {step.step}
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.description}</p>
                  {step.detail && <p className="text-xs text-slate-500 mt-1 italic">{step.detail}</p>}
                  {step.tip && <p className="text-xs text-emerald-500 mt-1 font-mono">TIP: {step.tip}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Flow Diagram */}
      {topic.flowDiagram && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Interactive Flow Diagram
          </h2>
          <FlowDiagram diagram={topic.flowDiagram} />
        </section>
      )}

      {/* Real World Examples */}
      {topic.realWorldExamples && topic.realWorldExamples.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Real World Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topic.realWorldExamples.map((example, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-purple-950/10 border border-purple-900/30 space-y-2">
                <div className="flex items-center gap-2">
                  {example.emoji && <span className="text-xl">{example.emoji}</span>}
                  <h3 className="font-semibold text-purple-200">{example.title}</h3>
                </div>
                <p className="text-sm font-medium text-slate-300 mb-1">{example.scenario}</p>
                <p className="text-sm text-slate-400">{example.howItApplies}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Packet Structure Dissector Diagram (if applicable) */}
      {topic.packetStructure && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              {topic.packetStructure.protocol}
            </h2>
            <span className="text-xs font-mono text-slate-400">Bitfield Specification</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 space-y-4">
            <p className="text-xs text-slate-400">{topic.packetStructure.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {topic.packetStructure.fields.map((field, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-bold font-mono"
                      style={{ color: field.color }}
                    >
                      {field.name}
                    </span>
                    <span className="text-[10px] font-mono px-1 rounded bg-slate-800 text-slate-400">
                      {field.sizeBits}b
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {field.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vendor Comparison & CLI Syntax */}
      {topic.vendorSyntax && topic.vendorSyntax.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Vendor Configuration &amp; CLI Syntax Matrix
          </h2>
          <VendorComparisonTab items={topic.vendorSyntax} />
        </section>
      )}

      {/* Common Engineering Pitfalls & Vulnerabilities */}
      {topic.commonPitfalls.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Common Engineering Pitfalls &amp; Security Risks
          </h2>
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-2.5">
            {topic.commonPitfalls.map((pitfall, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-rose-200 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                <span>{pitfall}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Knowledge Check (Quiz) */}
      {topic.quiz && topic.quiz.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Knowledge Check
          </h2>
          <QuizWidget questions={topic.quiz} />
        </section>
      )}

      {/* Bottom Navigation: Prev & Next Lesson */}
      <div className="pt-8 border-t border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        {prevTopic ? (
          <Link
            href={`/knowledge/${prevTopic.tierId}/${prevTopic.slug}`}
            className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Previous Lesson</span>
              <span className="font-semibold line-clamp-1">{prevTopic.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextTopic ? (
          <Link
            href={`/knowledge/${nextTopic.tierId}/${nextTopic.slug}`}
            className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors group ml-auto"
          >
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Next Lesson</span>
              <span className="font-semibold line-clamp-1">{nextTopic.title}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
