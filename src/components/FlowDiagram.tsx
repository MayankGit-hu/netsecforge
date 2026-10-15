'use client';

import React, { useState } from 'react';
import { FlowDiagramData, FlowNode, FlowEdge } from '@/types';

interface FlowDiagramProps {
  diagram: FlowDiagramData;
}

// Layout engine: auto-place nodes in a grid row-by-row
function computeLayout(nodes: FlowNode[], layout: 'horizontal' | 'vertical' = 'vertical') {
  const NODE_W = 160;
  const NODE_H = 60;
  const GAP_X = 60;
  const GAP_Y = 70;
  const COLS = layout === 'horizontal' ? nodes.length : Math.min(3, Math.ceil(Math.sqrt(nodes.length)));

  const positions: Record<string, { x: number; y: number; w: number; h: number }> = {};
  nodes.forEach((node, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    positions[node.id] = {
      x: col * (NODE_W + GAP_X) + NODE_W / 2,
      y: row * (NODE_H + GAP_Y) + NODE_H / 2,
      w: NODE_W,
      h: NODE_H,
    };
  });

  const maxX = Math.max(...Object.values(positions).map((p) => p.x + NODE_W / 2)) + 20;
  const maxY = Math.max(...Object.values(positions).map((p) => p.y + NODE_H / 2)) + 20;

  return { positions, svgW: maxX, svgH: maxY, NODE_W, NODE_H };
}

function getNodeColor(node: FlowNode): { fill: string; stroke: string; text: string } {
  if (node.color) return { fill: node.color + '22', stroke: node.color, text: node.color };
  switch (node.type) {
    case 'start':   return { fill: '#10b98122', stroke: '#10b981', text: '#10b981' };
    case 'end':     return { fill: '#f43f5e22', stroke: '#f43f5e', text: '#f43f5e' };
    case 'decision':return { fill: '#f59e0b22', stroke: '#f59e0b', text: '#f59e0b' };
    case 'actor':   return { fill: '#8b5cf622', stroke: '#8b5cf6', text: '#8b5cf6' };
    case 'data':    return { fill: '#06b6d422', stroke: '#06b6d4', text: '#06b6d4' };
    default:        return { fill: '#1e293b',   stroke: '#334155', text: '#94a3b8' };
  }
}

function NodeShape({
  node,
  pos,
  isHovered,
  onHover,
}: {
  node: FlowNode;
  pos: { x: number; y: number; w: number; h: number };
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const { fill, stroke, text } = getNodeColor(node);
  const { x, y, w, h } = pos;
  const rx = node.type === 'start' || node.type === 'end' ? h / 2 : node.type === 'decision' ? 8 : 10;

  return (
    <g
      transform={`translate(${x - w / 2}, ${y - h / 2})`}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: 'default', transition: 'opacity 0.2s' }}
    >
      <rect
        x={0} y={0} width={w} height={h}
        rx={rx}
        fill={fill}
        stroke={isHovered ? stroke : stroke + '80'}
        strokeWidth={isHovered ? 2 : 1.5}
        style={{ transition: 'all 0.2s', filter: isHovered ? `drop-shadow(0 0 8px ${stroke}60)` : 'none' }}
      />
      {/* Label */}
      <text
        x={w / 2} y={node.sublabel ? h / 2 - 8 : h / 2}
        textAnchor="middle" dominantBaseline="middle"
        fill={text} fontSize={11} fontWeight={600} fontFamily="monospace"
      >
        {node.label.length > 22 ? node.label.slice(0, 21) + '…' : node.label}
      </text>
      {node.sublabel && (
        <text
          x={w / 2} y={h / 2 + 9}
          textAnchor="middle" dominantBaseline="middle"
          fill={text + 'aa'} fontSize={9} fontFamily="sans-serif"
        >
          {node.sublabel.length > 28 ? node.sublabel.slice(0, 27) + '…' : node.sublabel}
        </text>
      )}
    </g>
  );
}

function EdgeLine({
  edge,
  positions,
  NODE_H,
}: {
  edge: FlowEdge;
  positions: Record<string, { x: number; y: number; w: number; h: number }>;
  NODE_H: number;
}) {
  const from = positions[edge.from];
  const to   = positions[edge.to];
  if (!from || !to) return null;

  const x1 = from.x;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x;
  const y2 = to.y - NODE_H / 2;

  // Bezier control points for smooth curves
  const cy1 = y1 + (y2 - y1) * 0.4;
  const cy2 = y2 - (y2 - y1) * 0.4;

  const d = `M ${x1} ${y1} C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${y2}`;

  return (
    <g>
      <defs>
        <marker id={`arrow-${edge.from}-${edge.to}`} markerWidth="8" markerHeight="6"
          refX="6" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#475569" />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="#475569"
        strokeWidth={1.5}
        strokeDasharray={edge.style === 'dashed' ? '5,4' : undefined}
        markerEnd={`url(#arrow-${edge.from}-${edge.to})`}
      />
      {edge.label && (
        <text
          x={(x1 + x2) / 2 + 6}
          y={(y1 + y2) / 2}
          fill="#64748b"
          fontSize={9}
          fontFamily="monospace"
          textAnchor="middle"
        >
          {edge.label}
        </text>
      )}
    </g>
  );
}

export function FlowDiagram({ diagram }: FlowDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const { positions, svgW, svgH, NODE_W, NODE_H } = computeLayout(diagram.nodes, diagram.layout);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">{diagram.title}</h3>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Flow Diagram</span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{diagram.description}</p>

      <div className="rounded-2xl border border-slate-800 bg-[#070b14] overflow-x-auto p-4">
        <svg
          width="100%"
          viewBox={`-10 -10 ${svgW + 20} ${svgH + 20}`}
          style={{ minWidth: Math.min(svgW + 20, 600), maxWidth: '100%', display: 'block' }}
        >
          {/* Edges first (behind nodes) */}
          {diagram.edges.map((edge, i) => (
            <EdgeLine key={i} edge={edge} positions={positions} NODE_H={NODE_H} />
          ))}

          {/* Nodes */}
          {diagram.nodes.map((node) => (
            <NodeShape
              key={node.id}
              node={node}
              pos={positions[node.id]}
              isHovered={hoveredNode === node.id}
              onHover={setHoveredNode}
            />
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500">
        {[
          { type: 'start',    color: '#10b981', label: 'Start/End' },
          { type: 'process',  color: '#94a3b8', label: 'Process' },
          { type: 'decision', color: '#f59e0b', label: 'Decision' },
          { type: 'actor',    color: '#8b5cf6', label: 'Actor' },
          { type: 'data',     color: '#06b6d4', label: 'Data/Message' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm border" style={{ background: color + '22', borderColor: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
