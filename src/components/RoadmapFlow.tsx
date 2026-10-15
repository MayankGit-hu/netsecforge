'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Node,
  Edge,
  Position,
  Handle,
} from '@xyflow/react';
import { CURRICULUM_TOPICS, CURRICULUM_TIERS } from '@/data/curriculum';
import { CurriculumTopic } from '@/types';
import { useProgress } from '@/context/ProgressContext';
import { CheckCircle2, Circle, ArrowRight, BookOpen, Terminal, X, Shield, Clock, Award, Filter } from 'lucide-react';

// Custom Node Component
function CurriculumNode({ data }: { data: any }) {
  const topic: CurriculumTopic = data.topic;
  const isCompleted: boolean = data.isCompleted;
  const onToggle: (id: string) => void = data.onToggle;
  const onSelect: (topic: CurriculumTopic) => void = data.onSelect;

  const tierColor = data.tierColor || '#06b6d4';

  return (
    <div
      onClick={() => onSelect(topic)}
      className={`group relative w-72 rounded-xl p-4 transition-all cursor-pointer backdrop-blur-md border ${
        isCompleted
          ? 'bg-[#0f1d1e]/90 border-emerald-500/60 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]'
          : 'bg-[#0e1524]/90 border-slate-700/80 hover:border-cyan-500/50 hover:shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-600 !w-2.5 !h-2.5 !border-slate-800" />

      {/* Header: Tier & Checkbox */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-semibold"
          style={{
            borderColor: `${tierColor}50`,
            backgroundColor: `${tierColor}15`,
            color: tierColor,
          }}
        >
          {topic.tierName.split(':')[0]}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(topic.id);
          }}
          className="p-0.5 rounded-full text-slate-400 hover:text-emerald-400 transition-colors"
          title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Circle className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
          )}
        </button>
      </div>

      {/* Title */}
      <h3 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug mb-1.5">
        {topic.title}
      </h3>

      {/* Summary */}
      <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
        {topic.summary}
      </p>

      {/* Meta tags */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
        <span className="flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3 text-slate-500" />
          {topic.estimatedMinutes}m
        </span>
        <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
          {topic.difficulty}
        </span>
        {topic.labId && (
          <span className="flex items-center gap-1 text-emerald-400">
            <Terminal className="w-3 h-3" />
            Lab
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-slate-600 !w-2.5 !h-2.5 !border-slate-800" />
    </div>
  );
}

const nodeTypes = {
  curriculum: CurriculumNode,
};

export function RoadmapFlow() {
  const { isTopicCompleted, toggleTopicCompleted } = useProgress();
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic | null>(null);
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [certFilter, setCertFilter] = useState<string>('all');

  // Compute graph nodes with column/row layout
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Group topics by tier
    const tiers = ['tier-0', 'tier-1', 'tier-2', 'tier-3', 'tier-4'];
    const tierColors: Record<string, string> = {
      'tier-0': '#06b6d4',
      'tier-1': '#10b981',
      'tier-2': '#8b5cf6',
      'tier-3': '#f59e0b',
      'tier-4': '#f43f5e',
    };

    tiers.forEach((tierId, tierIndex) => {
      const topicsInTier = CURRICULUM_TOPICS.filter((t) => t.tierId === tierId);
      const tierColor = tierColors[tierId];

      topicsInTier.forEach((topic, topicIndex) => {
        // Compute x, y coordinates
        // 5 columns (tiers) with staggered y offsets
        const xPos = tierIndex * 340 + 40;
        const yPos = topicIndex * 210 + 60;

        nodes.push({
          id: topic.id,
          type: 'curriculum',
          position: { x: xPos, y: yPos },
          data: {
            topic,
            tierColor,
            isCompleted: false, // will update dynamically in render
            onToggle: toggleTopicCompleted,
            onSelect: setSelectedTopic,
          },
        });

        // Generate edges based on prerequisites
        topic.prerequisites.forEach((prereqId) => {
          edges.push({
            id: `edge-${prereqId}-${topic.id}`,
            source: prereqId,
            target: topic.id,
            animated: true,
            style: { stroke: `${tierColor}80`, strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: tierColor,
              width: 14,
              height: 14,
            },
          });
        });
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [toggleTopicCompleted]);

  // Synchronize completion state and filtering into active nodes
  const filteredNodes = useMemo(() => {
    return initialNodes
      .filter((node) => {
        const topic = (node.data as any).topic as CurriculumTopic;
        if (tierFilter !== 'all' && topic.tierId !== tierFilter) return false;
        if (certFilter !== 'all') {
          const hasCert = topic.certAlignments.some((c) =>
            c.toLowerCase().includes(certFilter.toLowerCase())
          );
          if (!hasCert) return false;
        }
        return true;
      })
      .map((node) => ({
        ...node,
        data: {
          ...(node.data as any),
          isCompleted: isTopicCompleted(node.id),
          onToggle: toggleTopicCompleted,
          onSelect: setSelectedTopic,
        },
      }));
  }, [initialNodes, isTopicCompleted, toggleTopicCompleted, tierFilter, certFilter]);

  const [nodes, , onNodesChange] = useNodesState(filteredNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="relative w-full h-[750px] bg-[#070a12] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-[#0c121e]/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs">
        {/* Tier Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            Tiers:
          </span>
          <button
            onClick={() => setTierFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              tierFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            All Tiers
          </button>
          {CURRICULUM_TIERS.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setTierFilter(tier.id)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                tierFilter === tier.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Tier {tier.number}
            </button>
          ))}
        </div>

        {/* Cert Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Cert Path:
          </span>
          <select
            value={certFilter}
            onChange={(e) => setCertFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 px-2 py-1 rounded-md text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Certifications</option>
            <option value="Network+">CompTIA Network+</option>
            <option value="Security+">CompTIA Security+</option>
            <option value="CCNA">Cisco CCNA</option>
            <option value="CCNP">Cisco CCNP Security</option>
            <option value="PCNSE">Palo Alto PCNSE</option>
            <option value="NSE">Fortinet FCP / NSE</option>
            <option value="OSCP">OffSec OSCP</option>
            <option value="CISSP">CISSP</option>
          </select>
        </div>
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={filteredNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.65 }}
      >
        <Background color="#1e293b" gap={24} size={1} />
        <Controls className="!bg-[#0c121e] !border-slate-800 !rounded-lg" />
      </ReactFlow>

      {/* Side Topic Details Drawer */}
      {selectedTopic && (
        <div className="absolute top-0 right-0 bottom-0 w-full sm:w-96 bg-[#0a0f1a]/95 backdrop-blur-xl border-l border-slate-700/80 z-30 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                {selectedTopic.tierName}
              </span>
              <h2 className="text-base font-bold text-white mt-1.5 leading-snug">
                {selectedTopic.title}
              </h2>
            </div>
            <button
              onClick={() => setSelectedTopic(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Completion Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 mb-4">
            <span className="text-xs text-slate-300 font-medium">Status:</span>
            <button
              onClick={() => toggleTopicCompleted(selectedTopic.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                isTopicCompleted(selectedTopic.id)
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isTopicCompleted(selectedTopic.id) ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Completed
                </>
              ) : (
                <>
                  <Circle className="w-3.5 h-3.5 text-slate-400" />
                  Mark Complete
                </>
              )}
            </button>
          </div>

          {/* Overview */}
          <div className="space-y-4 text-xs text-slate-300 flex-1">
            <div>
              <h4 className="font-semibold text-white mb-1">Lesson Summary</h4>
              <p className="text-slate-400 leading-relaxed">{selectedTopic.overview}</p>
            </div>

            {/* Certifications Mapped */}
            {selectedTopic.certAlignments.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-1.5 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Aligned Certifications
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTopic.certAlignments.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[11px] text-amber-300"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key RFCs */}
            {selectedTopic.rfcs.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-1">Standards & RFCs</h4>
                <div className="space-y-1">
                  {selectedTopic.rfcs.map((rfc, idx) => (
                    <a
                      key={idx}
                      href={rfc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-400 hover:text-cyan-300"
                    >
                      {rfc.number}: {rfc.title} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Key Concepts Preview */}
            <div>
              <h4 className="font-semibold text-white mb-1.5">Key Core Concepts</h4>
              <ul className="space-y-1.5">
                {selectedTopic.keyConcepts.slice(0, 3).map((concept, idx) => (
                  <li key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800/80 text-[11px]">
                    <span className="font-semibold text-slate-200 block mb-0.5">{concept.title}</span>
                    <span className="text-slate-400 line-clamp-2">{concept.explanation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2 mt-4">
            <Link
              href={`/knowledge/${selectedTopic.tierId}/${selectedTopic.slug}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-cyan-900/30"
            >
              <BookOpen className="w-4 h-4" />
              Open Full Technical Lesson
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {selectedTopic.labId && (
              <Link
                href={`/labs?lab=${selectedTopic.labId}`}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-emerald-400 text-xs font-semibold transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                Launch Hands-On Lab
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
