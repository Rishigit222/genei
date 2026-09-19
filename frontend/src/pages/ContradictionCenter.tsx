import React from 'react';
import { AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { ContradictionRecord } from '../types';

interface ContradictionCenterProps {
  contradictions: ContradictionRecord[];
  onNavigateToRepairs: () => void;
}

export const ContradictionCenter: React.FC<ContradictionCenterProps> = ({ contradictions, onNavigateToRepairs }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-[#0d111a] border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-slate-200">Graph Contradiction Detection Hub</h2>
              <p className="text-xs text-slate-400">Detects conflicting assertions across ingested document sources</p>
            </div>
          </div>
          <button
            onClick={onNavigateToRepairs}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all"
          >
            Review Repair Proposals
          </button>
        </div>

        <div className="space-y-3">
          {contradictions.length > 0 ? (
            contradictions.map((c, idx) => (
              <div key={idx} className="bg-[#131926] border border-amber-900/50 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">CONFLICT DETECTED: {c.relationship_type}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    Status: {c.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">SOURCE A: {c.source_a_id} (Confidence: {c.source_a_confidence})</span>
                    <span className="text-cyan-300 font-bold">{c.existing_value}</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">SOURCE B: {c.source_b_id} (Confidence: {c.source_b_confidence})</span>
                    <span className="text-rose-300 font-bold">{c.conflicting_value}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#131926] border border-slate-800 p-8 rounded-xl text-center space-y-2 text-slate-400 text-xs font-mono">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p>All graph facts verified. Planted sample contradiction available in Demo scenario.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
