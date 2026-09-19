import React from 'react';
import { X, Layers, Tag, Database, Calendar } from 'lucide-react';
import { NodeModel } from '../types';

interface NodeDetailDrawerProps {
  node: NodeModel | null;
  onClose: () => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-[#0d111a] border-l border-slate-800 p-5 z-50 shadow-2xl flex flex-col justify-between space-y-4">
      <div className="space-y-4 overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              {node.label}
            </span>
            <h2 className="text-base font-bold text-white mt-1 font-mono">{node.name}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block text-[11px] mb-1">Entity ID</span>
            <span className="font-mono text-cyan-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 block text-[11px]">
              {node.id}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[11px] mb-1">Description</span>
            <p className="text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 leading-relaxed text-[11px]">
              {node.description || 'No description provided.'}
            </p>
          </div>

          {node.aliases && node.aliases.length > 0 && (
            <div>
              <span className="text-slate-400 font-semibold block text-[11px] mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-cyan-400" /> Recognized Aliases
              </span>
              <div className="flex flex-wrap gap-1">
                {node.aliases.map((alias, idx) => (
                  <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[10px]">
                    {alias}
                  </span>
                ))}
              </div>
            </div>
          )}

          {node.properties && Object.keys(node.properties).length > 0 && (
            <div>
              <span className="text-slate-400 font-semibold block text-[11px] mb-1 flex items-center gap-1">
                <Database className="w-3 h-3 text-cyan-400" /> Custom Metadata Properties
              </span>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 space-y-1 font-mono text-[10px]">
                {Object.entries(node.properties).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-slate-800/50 pb-0.5 last:border-0">
                    <span className="text-slate-400">{k}:</span>
                    <span className="text-cyan-300 font-semibold">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
        FalkorDB Node Registry
      </div>
    </div>
  );
};
