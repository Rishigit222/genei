import React, { useState, useEffect } from 'react';
import { Search, Shield, Network, FileText, AlertTriangle, RefreshCw, History, Database, Play, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onLaunchDemo: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onLaunchDemo
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'demo', title: 'Launch Demo Investigation (CVE-2026-9812)', icon: Play, section: 'Quick Actions', action: () => { onLaunchDemo(); onClose(); } },
    { id: 'dashboard', title: 'Go to Overview Dashboard', icon: Shield, section: 'Navigation', action: () => { onNavigate('dashboard'); onClose(); } },
    { id: 'workspace', title: 'Open Investigation Workspace', icon: Search, section: 'Navigation', action: () => { onNavigate('workspace'); onClose(); } },
    { id: 'graph', title: 'Explore Knowledge Graph', icon: Network, section: 'Navigation', action: () => { onNavigate('graph'); onClose(); } },
    { id: 'evidence', title: 'View Evidence Explorer', icon: FileText, section: 'Navigation', action: () => { onNavigate('evidence'); onClose(); } },
    { id: 'contradictions', title: 'Open Contradiction Center', icon: AlertTriangle, section: 'Navigation', action: () => { onNavigate('contradictions'); onClose(); } },
    { id: 'repairs', title: 'Open Repair Center', icon: RefreshCw, section: 'Navigation', action: () => { onNavigate('repairs'); onClose(); } },
    { id: 'audit', title: 'View Audit Timeline', icon: History, section: 'Navigation', action: () => { onNavigate('audit'); onClose(); } },
    { id: 'health', title: 'Check System Diagnostics & Health', icon: Database, section: 'Navigation', action: () => { onNavigate('health'); onClose(); } },
  ];

  const filtered = actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
      <div className="bg-[#0f141f] border border-slate-800 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Bar */}
        <div className="flex items-center px-4 border-b border-slate-800 bg-[#131a29]">
          <Search className="w-4 h-4 text-cyan-400 mr-2.5 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, entities, routes, or launch query (Ctrl+K)..."
            className="w-full bg-transparent py-3.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono"
          />
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs hover:bg-[#1b2436] transition-colors text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-200 font-medium">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {item.section}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
              No matching commands or routes found.
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-slate-800/80 bg-[#0b0f19] text-[10px] font-mono text-slate-500 flex justify-between">
          <span>Use ARROW keys to navigate</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
