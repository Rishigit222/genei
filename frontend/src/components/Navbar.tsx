import React from 'react';
import { Shield, Network, Search, FileText, AlertTriangle, RefreshCw, History, Activity, Database } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  falkorConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, falkorConnected }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'workspace', label: 'Investigation Workspace', icon: Search },
    { id: 'graph', label: 'Knowledge Graph', icon: Network },
    { id: 'evidence', label: 'Evidence Explorer', icon: FileText },
    { id: 'contradictions', label: 'Contradiction Center', icon: AlertTriangle },
    { id: 'repairs', label: 'Repair Center', icon: RefreshCw },
    { id: 'audit', label: 'Audit Timeline', icon: History },
    { id: 'health', label: 'System Health', icon: Database },
  ];

  return (
    <header className="bg-[#0b0f19] border-b border-slate-800/80 sticky top-0 z-50 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Brand Title & Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-xl shadow-lg shadow-cyan-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider text-white flex items-center gap-2">
              GRAPH SENTINEL
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                FalkorDB GraphRAG
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">Autonomous Graph Investigation Platform</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-[#131926] p-1 rounded-xl border border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* FalkorDB Connection Status */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
            <span className={`w-2 h-2 rounded-full ${falkorConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="font-mono text-slate-300 text-[11px]">
              {falkorConnected ? 'FalkorDB Engine: Live' : 'FalkorDB: In-Memory Fallback'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
