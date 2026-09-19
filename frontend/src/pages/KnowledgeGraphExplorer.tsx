import React, { useState } from 'react';
import { Network, Search, Filter, Play } from 'lucide-react';
import { GraphData, NodeModel, RelationshipModel } from '../types';
import { GraphCanvas } from '../components/GraphCanvas';
import { NodeDetailDrawer } from '../components/NodeDetailDrawer';

interface KnowledgeGraphExplorerProps {
  graphData: GraphData;
}

export const KnowledgeGraphExplorer: React.FC<KnowledgeGraphExplorerProps> = ({ graphData }) => {
  const [selectedNode, setSelectedNode] = useState<NodeModel | null>(null);
  const [filterLabel, setFilterLabel] = useState<string>('ALL');
  const [cypherQuery, setCypherQuery] = useState<string>('MATCH (n)-[r]->(m) RETURN n, r, m');

  const filteredNodes = filterLabel === 'ALL'
    ? graphData.nodes
    : graphData.nodes.filter(n => n.label.toUpperCase() === filterLabel);

  return (
    <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col">
      {/* Top Filter Bar */}
      <div className="bg-[#0d111a] border border-slate-800 p-3 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">Filter Node Type:</span>
          <div className="flex items-center space-x-1">
            {['ALL', 'VULNERABILITY', 'PACKAGE', 'SERVICE', 'SERVER', 'DATABASE', 'DOCUMENT'].map(label => (
              <button
                key={label}
                onClick={() => setFilterLabel(label)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                  filterLabel === label
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Displaying {filteredNodes.length} nodes / {graphData.relationships.length} edges
        </div>
      </div>

      {/* Graph Canvas */}
      <div className="flex-1 relative">
        <GraphCanvas
          nodes={filteredNodes}
          relationships={graphData.relationships}
          onSelectNode={(node) => setSelectedNode(node)}
        />
      </div>

      <NodeDetailDrawer node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
};
