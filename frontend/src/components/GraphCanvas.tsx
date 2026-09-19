import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodeModel, RelationshipModel } from '../types';

interface GraphCanvasProps {
  nodes: NodeModel[];
  relationships: RelationshipModel[];
  highlightPaths?: string[][];
  onSelectNode?: (node: NodeModel) => void;
  onSelectEdge?: (edge: RelationshipModel) => void;
}

const getNodeColor = (label: string) => {
  switch (label?.toUpperCase()) {
    case 'VULNERABILITY': return { bg: '#3b0764', border: '#ef4444', text: '#fca5a5' };
    case 'PACKAGE': return { bg: '#062c43', border: '#06b6d4', text: '#67e8f9' };
    case 'SERVICE': return { bg: '#2e1065', border: '#a855f7', text: '#d8b4fe' };
    case 'SERVER': return { bg: '#064e3b', border: '#10b981', text: '#6ee7b7' };
    case 'DATABASE': return { bg: '#451a03', border: '#f59e0b', text: '#fde68a' };
    case 'DOCUMENT': return { bg: '#1e293b', border: '#3b82f6', text: '#93c5fd' };
    default: return { bg: '#1e293b', border: '#64748b', text: '#cbd5e1' };
  }
};

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  relationships,
  highlightPaths = [],
  onSelectNode,
  onSelectEdge
}) => {
  // Map FalkorDB NodeModels to React Flow Nodes with dynamic circular layout
  const reactFlowNodes: Node[] = useMemo(() => {
    const total = nodes.length;
    const radius = Math.max(180, total * 35);
    const center = { x: 400, y: 300 };

    return nodes.map((node, index) => {
      const angle = (index / (total || 1)) * 2 * Math.PI;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);

      const colors = getNodeColor(node.label);
      const isHighlighted = highlightPaths.some(path => path.includes(node.id));

      return {
        id: node.id,
        position: { x, y },
        data: { label: node.name, raw: node },
        style: {
          background: colors.bg,
          borderColor: isHighlighted ? '#ff4e00' : colors.border,
          borderWidth: isHighlighted ? '3px' : '1.5px',
          color: colors.text,
          borderRadius: '10px',
          padding: '8px 14px',
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: 'monospace',
          boxShadow: isHighlighted ? '0 0 15px rgba(255, 78, 0, 0.7)' : '0 4px 12px rgba(0,0,0,0.4)',
          cursor: 'pointer'
        }
      };
    });
  }, [nodes, highlightPaths]);

  // Map FalkorDB RelationshipModels to React Flow Edges
  const reactFlowEdges: Edge[] = useMemo(() => {
    return relationships.map((rel) => {
      const isHighlighted = highlightPaths.some(path => {
        const srcIdx = path.indexOf(rel.source_id);
        const tgtIdx = path.indexOf(rel.target_id);
        return srcIdx !== -1 && tgtIdx !== -1 && Math.abs(srcIdx - tgtIdx) === 1;
      });

      return {
        id: rel.id,
        source: rel.source_id,
        target: rel.target_id,
        label: rel.type,
        labelStyle: { fill: isHighlighted ? '#ff4e00' : '#94a3b8', fontSize: '9px', fontWeight: 600 },
        labelBgStyle: { fill: '#0f172a', fillOpacity: 0.8 },
        style: {
          stroke: isHighlighted ? '#ff4e00' : rel.status === 'SUPERSEDED' ? '#475569' : '#38bdf8',
          strokeWidth: isHighlighted ? 3 : 1.5,
          strokeDasharray: rel.status === 'SUPERSEDED' ? '4 4' : undefined,
          opacity: rel.status === 'SUPERSEDED' ? 0.4 : 1
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isHighlighted ? '#ff4e00' : '#38bdf8'
        }
      };
    });
  }, [relationships, highlightPaths]);

  return (
    <div className="w-full h-full relative bg-[#07090e] rounded-xl overflow-hidden border border-slate-800">
      {/* Legend Header */}
      <div className="absolute top-3 left-3 z-10 bg-[#0d111a]/90 backdrop-blur border border-slate-800 p-2.5 rounded-lg text-xs space-y-1">
        <div className="font-semibold text-slate-300 text-[11px] mb-1">Graph Entity Legend</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500 border border-red-400"></span>Vulnerability</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-500 border border-cyan-400"></span>Package</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-purple-500 border border-purple-400"></span>Service</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-400"></span>Server</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500 border border-amber-400"></span>Database</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500 border border-blue-400"></span>Document</span>
        </div>
      </div>

      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodeClick={(_, node) => onSelectNode && onSelectNode(node.data.raw as NodeModel)}
        fitView
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="bg-slate-900 border-slate-800 fill-slate-300" />
        <MiniMap nodeColor={(node) => (node.style?.background as string) || '#1e293b'} maskColor="rgba(15, 23, 42, 0.7)" />
      </ReactFlow>
    </div>
  );
};
