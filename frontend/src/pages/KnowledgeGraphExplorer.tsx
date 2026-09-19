import React, { useState } from 'react';
import { Network, Search, Filter, Play, RefreshCw, Terminal, Layers, Info } from 'lucide-react';
import { GraphData, NodeModel, RelationshipModel } from '../types';
import { GraphCanvas } from '../components/GraphCanvas';
import { NodeDetailDrawer } from '../components/NodeDetailDrawer';

interface KnowledgeGraphExplorerProps {
  graphData: GraphData;
}

export const KnowledgeGraphExplorer: React.FC<KnowledgeGraphExplorerProps> = ({ graphData }) => {
  const [selectedNode, setSelectedNode] = useState<NodeModel | null>(null);
  const [filterLabel, setFilterLabel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cypherQuery, setCypherQuery] = useState<string>('MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 50');

  const filteredNodes = graphData.nodes.filter(n => {
    const matchesLabel = filterLabel === 'ALL' || n.label.toUpperCase() === filterLabel;
    const matchesSearch = !searchQuery || 
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLabel && matchesSearch;
  });

  return (
    <div className="space-y-4 h-[calc(100vh-105px)] flex flex-col font-sans">
      {/* Top Filter & Toolbar Header */}
      <div className="bg-[#0b0d13] border border-[#1e2433] p-3 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left Filter Labels */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-300 shrink-0 font-mono">Entity Type:</span>
          <div className="flex items-center space-x-1 shrink-0">
            {['ALL', 'VULNERABILITY', 'PACKAGE', 'SERVICE', 'SERVER', 'DATABASE', 'DOCUMENT'].map(label => (
              <button
                key={label}
                onClick={() => setFilterLabel(label)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                  filterLabel === label
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121620]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Search Bar */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-[#121620] border border-[#1e2433] px-3 py-1.5 rounded-lg">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter node by name or ID..."
              className="bg-transparent text-slate-100 text-xs focus:outline-none w-44 font-mono placeholder:text-slate-500"
            />
          </div>
          <button
            onClick={() => { setFilterLabel('ALL'); setSearchQuery(''); }}
            className="p-1.5 text-xs text-slate-400 hover:text-slate-200 bg-[#121620] border border-[#1e2433] rounded-lg font-mono"
            title="Reset Filters"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Cypher Query Console Bar */}
      <div className="bg-[#0b0d13] border border-[#1e2433] px-3.5 py-2 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex-1 flex items-center space-x-2 bg-[#121620] border border-[#1e2433] px-3 py-1.5 rounded-lg">
          <Terminal className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          <span className="text-slate-500 font-mono text-[10px]">CYPHER:</span>
          <input
            type="text"
            value={cypherQuery}
            onChange={(e) => setCypherQuery(e.target.value)}
            className="bg-transparent text-slate-200 font-mono text-[11px] focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400 shrink-0">
          <span>GRAPH ENGINE: <strong className="text-cyan-400">FalkorDB</strong></span>
          <span>NODES: <strong className="text-slate-200">{filteredNodes.length}</strong></span>
          <span>EDGES: <strong className="text-slate-200">{graphData.relationships.length}</strong></span>
        </div>
      </div>

      {/* Full Screen Interactive Graph Canvas */}
      <div className="flex-1 relative min-h-0">
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

