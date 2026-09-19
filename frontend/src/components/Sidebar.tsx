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
  GitBranch,
  Layers,
  Cpu,
  Zap,
  Radio,
  FileCheck,
  LifeBuoy
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onLaunchDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onLaunchDemo
}) => {
  const groups = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Activity },
      ]
    },
    {
      title: 'INVESTIGATE',
      items: [
        { id: 'workspace', label: 'New Investigation', icon: Search, badge: 'Main', action: onLaunchDemo },
        { id: 'workspace', label: 'Active Investigations', icon: Zap },
        { id: 'audit', label: 'Investigation History', icon: History },
      ]
    },
    {
      title: 'OBSERVE',
      items: [
        { id: 'graph', label: 'Knowledge Graph', icon: Network },
        { id: 'workspace', label: 'Investigation Traces', icon: GitBranch },
        { id: 'evidence', label: 'Evidence Explorer', icon: FileText },
      ]
    },
    {
      title: 'ANALYZE',
      items: [
        { id: 'contradictions', label: 'Contradictions', icon: AlertTriangle, badge: '1' },
        { id: 'workspace', label: 'Findings', icon: Shield },
        { id: 'graph', label: 'Impact Analysis', icon: Layers },
      ]
    },
    {
      title: 'HEAL',
      items: [
        { id: 'repairs', label: 'Repair Center', icon: RefreshCw, badge: '1' },
        { id: 'audit', label: 'Repair History', icon: FileCheck },
      ]
    },
    {
      title: 'AUDIT',
      items: [
        { id: 'audit', label: 'Audit Timeline', icon: History },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'health', label: 'System Health', icon: Database },
        { id: 'evidence', label: 'Data Sources', icon: Radio },
        { id: 'evidence', label: 'Ingestion', icon: Cpu },
      ]
    }
  ];

  return (
    <aside
      className={`bg-[#0b0d13] border-r border-[#1e2433] flex flex-col transition-all duration-300 relative z-30 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#1e2433]">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center space-x-2.5 cursor-pointer overflow-hidden"
        >
          <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-md shadow-cyan-500/20 shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-xs font-bold tracking-tight text-white whitespace-nowrap flex items-center gap-1.5">
                GraphSentinel
              </h1>
              <p className="text-[9px] text-slate-400 font-mono whitespace-nowrap">Autonomous Graph Intelligence</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-[#161c29] text-slate-400 hover:text-slate-200 rounded transition-colors border border-[#1e2433]"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {groups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <h2 className="px-2.5 text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                {group.title}
              </h2>
            )}
            <div className="space-y-0.5">
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={`${group.title}-${itemIdx}`}
                    onClick={() => {
                      if (item.action) item.action();
                      setActiveTab(item.id);
                    }}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#182235] text-cyan-400 border border-cyan-500/30 shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#141a27]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
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

      {/* Footer / Engine Telemetry */}
      {!isCollapsed && (
        <div className="p-2.5 border-t border-[#1e2433] bg-[#07090e]">
          <div className="bg-[#121620] border border-[#1e2433] p-2 rounded-lg flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>FalkorDB Engine</span>
            </span>
            <span className="text-slate-500">v1.0</span>
          </div>
        </div>
      )}
    </aside>
  );
};
