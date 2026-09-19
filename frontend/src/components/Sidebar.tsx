import React from 'react';
import {
  Shield,
  Activity,
  Search,
  Network,
  FileText,
  AlertTriangle,
  RefreshCw,
  History,
  Database,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed
}) => {
  const groups = [
    {
      title: 'INVESTIGATE',
      items: [
        { id: 'dashboard', label: 'Overview', icon: Activity },
        { id: 'workspace', label: 'Workspace', icon: Search, badge: 'Main' },
      ]
    },
    {
      title: 'KNOWLEDGE',
      items: [
        { id: 'graph', label: 'Knowledge Graph', icon: Network },
        { id: 'evidence', label: 'Evidence Explorer', icon: FileText },
        { id: 'contradictions', label: 'Contradiction Center', icon: AlertTriangle, badge: '1' },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'repairs', label: 'Repair Center', icon: RefreshCw, badge: '1' },
        { id: 'audit', label: 'Audit Timeline', icon: History },
        { id: 'health', label: 'System Diagnostics', icon: Database },
      ]
    }
  ];

  return (
    <aside
      className={`bg-[#0b0e17] border-r border-slate-800/80 flex flex-col transition-all duration-300 relative z-30 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header Brand */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center space-x-3 cursor-pointer overflow-hidden"
        >
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-xl shadow-lg shadow-cyan-500/20 shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-extrabold tracking-wider text-white whitespace-nowrap flex items-center gap-1.5">
                GRAPH SENTINEL
              </h1>
              <p className="text-[10px] text-cyan-400 font-mono font-semibold whitespace-nowrap">Graph Intelligence</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors border border-slate-800"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {groups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            {!isCollapsed && (
              <h2 className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                {group.title}
              </h2>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold shadow-sm shadow-cyan-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                          item.badge === 'Main'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Quick Status */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-[#07090f]">
          <div className="bg-[#111622] border border-slate-800 p-2.5 rounded-xl flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="text-[10px] font-mono text-slate-400 leading-tight">
              <span className="text-slate-200 font-semibold block">FalkorDB Engine</span>
              <span>Cypher GraphRAG v1.0</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
