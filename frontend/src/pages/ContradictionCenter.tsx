import React from 'react';
import { AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, FileText } from 'lucide-react';
import { ContradictionRecord } from '../types';

interface ContradictionCenterProps {
  contradictions: ContradictionRecord[];
  onNavigateToRepairs: () => void;
}

export const ContradictionCenter: React.FC<ContradictionCenterProps> = ({ contradictions, onNavigateToRepairs }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-[#0f141f] border border-slate-800 p-5 rounded-xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-950 text-amber-400 rounded-lg border border-amber-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Graph Contradiction Detection Hub</h2>
              <p className="text-xs text-slate-400 font-mono">Surfaces conflicting assertions across ingested document sources</p>
            </div>
          </div>
          <button
            onClick={onNavigateToRepairs}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-purple-500/10 cursor-pointer"
          >
            <span>Review Repair Proposals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {contradictions.length > 0 ? (
            contradictions.map((c, idx) => (
              <div key={idx} className="bg-[#131926] border border-amber-900/60 p-5 rounded-xl space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center space-x-2 font-mono">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400">CONTRADICTION DETECTED: {c.relationship_type}</span>
                    <span className="text-slate-500 text-xs">|</span>
                    <span className="text-xs text-slate-300 font-bold">Target Entity: {c.entity_id}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded uppercase font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    Status: {c.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  {/* OLD FACT */}
                  <div className="bg-[#0b0e17] p-4 rounded-xl border border-cyan-900/50 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold border-b border-slate-800 pb-1.5">
                      <span>EXISTING FACT (SOURCE A)</span>
                      <span>Confidence: {(c.source_a_confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="text-cyan-200 font-bold text-sm pt-1">{c.existing_value}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span>Document: {c.source_a_id}</span>
                    </div>
                  </div>

                  {/* NEW FACT */}
                  <div className="bg-[#0b0e17] p-4 rounded-xl border border-rose-900/50 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-rose-400 font-bold border-b border-slate-800 pb-1.5">
                      <span>CONFLICTING ASSERTION (SOURCE B)</span>
                      <span>Confidence: {(c.source_b_confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="text-rose-200 font-bold text-sm pt-1">{c.conflicting_value}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span>Document: {c.source_b_id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-400">
                    Resolution Reason: Higher confidence spec <span className="text-cyan-300 font-bold">{c.source_a_id}</span> overrides disputed report <span className="text-rose-300 font-bold">{c.source_b_id}</span>.
                  </div>
                  <button
                    onClick={onNavigateToRepairs}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    Open Repair Proposal
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#131926] border border-slate-800 p-10 rounded-xl text-center space-y-2 text-slate-400 text-xs font-mono">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p>All graph relationships verified. Run Demo scenario to populate active conflict queue.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
