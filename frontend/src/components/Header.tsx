import React from 'react';
import { Search, Command, Play, Database, Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  falkorConnected: boolean;
  onOpenCommandPalette: () => void;
  onLaunchDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  falkorConnected,
  onOpenCommandPalette,
  onLaunchDemo
}) => {
  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Overview Dashboard', subtitle: 'Security Intelligence & Graph Sentinel Metrics' },
    workspace: { title: 'Investigation Workspace', subtitle: 'Multi-Hop Cypher Traversal & Evidence Grounding' },
    graph: { title: 'Knowledge Graph Explorer', subtitle: 'FalkorDB Graph Visualization & Label Filtering' },
    evidence: { title: 'Evidence Explorer', subtitle: 'Source Document Ingestion & Text Span Attribution' },
    contradictions: { title: 'Contradiction Center', subtitle: 'Conflicting Ingestion Assertion Queue' },
    repairs: { title: 'Repair Control Plane', subtitle: 'Controlled Self-Healing MARK_SUPERSEDED Proposals' },
    audit: { title: 'Audit Timeline', subtitle: 'Immutable Ledger of Graph Mutations & Approvals' },
    health: { title: 'System Diagnostics', subtitle: 'FalkorDB Connection Monitor & Evaluation Engine' }
  };

  const current = pageTitles[activeTab] || { title: 'Graph Sentinel', subtitle: 'Autonomous Graph Workstation' };

  return (
    <header className="h-16 bg-[#0b0e17] border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
      {/* Breadcrumb / Title */}
      <div className="flex items-center space-x-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>{current.title}</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-mono hidden sm:block">{current.subtitle}</p>
        </div>
      </div>

      {/* Center Search / Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full bg-[#121826] hover:bg-[#161d2e] border border-slate-800 rounded-xl px-3.5 py-1.5 flex items-center justify-between text-xs text-slate-400 transition-all cursor-pointer group shadow-inner"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="font-mono text-[11px]">Search GraphSentinel...</span>
          </div>
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Controls & Health Status */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onLaunchDemo}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow-md shadow-cyan-500/15 transition-all cursor-pointer whitespace-nowrap"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span className="hidden md:inline">Run Scenario</span>
        </button>

        <div className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-[#121826] border border-slate-800 text-xs">
          <span className={`w-2 h-2 rounded-full ${falkorConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="font-mono text-slate-300 text-[11px] whitespace-nowrap">
            {falkorConnected ? 'FalkorDB Connected' : 'FalkorDB Fallback'}
          </span>
        </div>
      </div>
    </header>
  );
};
