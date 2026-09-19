import React from 'react';
import { Search, Command, Play, Database, ShieldCheck, Activity, Cpu } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  falkorConnected: boolean;
  onOpenCommandPalette: () => void;
  onLaunchDemo: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  falkorConnected,
  onOpenCommandPalette,
  onLaunchDemo
}) => {
  const tabNames: Record<string, string> = {
    dashboard: 'Dashboard',
    workspace: 'Investigations / INV-2026-9812',
    graph: 'Knowledge Graph',
    evidence: 'Evidence Explorer',
    contradictions: 'Contradiction Center',
    repairs: 'Repair Control Plane',
    audit: 'Audit Timeline',
    health: 'System Diagnostics'
  };

  const currentPath = tabNames[activeTab] || 'Overview';

  return (
    <header className="h-14 bg-[#0b0d13] border-b border-[#1e2433] px-5 flex items-center justify-between sticky top-0 z-40 shrink-0">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs font-mono">
        <span className="text-slate-400 font-semibold">GraphSentinel</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-200 font-bold">{currentPath}</span>
      </div>

      {/* Global Command / Search Input Trigger */}
      <div className="flex-1 max-w-lg mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full bg-[#121620] hover:bg-[#161c29] border border-[#1e2433] rounded-lg px-3 py-1.5 flex items-center justify-between text-xs text-slate-400 transition-all cursor-pointer group shadow-inner"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="font-mono text-[11px] text-slate-400">Search investigations, entities, CVEs, evidence...</span>
          </div>
          <div className="flex items-center space-x-1 bg-[#0b0d13] border border-[#1e2433] px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Observability Status Badges */}
      <div className="flex items-center space-x-3 text-xs font-mono">
        <button
          onClick={onLaunchDemo}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-md shadow-cyan-500/15 transition-all cursor-pointer whitespace-nowrap"
        >
          <Play className="w-3 h-3 fill-white" />
          <span className="hidden md:inline">Run Scenario</span>
        </button>

        {/* Operational Status Indicator */}
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-[#121620] border border-[#1e2433]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-semibold text-[11px]">Operational</span>
        </div>

        {/* FalkorDB Status Indicator */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#121620] border border-[#1e2433]">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 text-[11px]">FalkorDB:</span>
          <span className={`font-bold text-[11px] ${falkorConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
            {falkorConnected ? 'Connected' : 'Fallback Engine'}
          </span>
        </div>
      </div>
    </header>
  );
};
