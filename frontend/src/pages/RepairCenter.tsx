import React, { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, ShieldCheck, Database, Layers } from 'lucide-react';
import { RepairProposal } from '../types';
import { api } from '../services/api';

interface RepairCenterProps {
  proposals: RepairProposal[];
  onRefreshGraph: () => void;
}

export const RepairCenter: React.FC<RepairCenterProps> = ({ proposals, onRefreshGraph }) => {
  const [repairsList, setRepairsList] = useState<RepairProposal[]>(proposals);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    try {
      await api.approveRepair(id);
      setRepairsList(prev => prev.map(p => p.repair_id === id ? { ...p, status: 'APPLIED' as any } : p));
      setActionStatus(`Repair '${id}' approved and applied to FalkorDB!`);
      onRefreshGraph();
    } catch (e) {
      setActionStatus('Approve operation failed.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.rejectRepair(id);
      setRepairsList(prev => prev.map(p => p.repair_id === id ? { ...p, status: 'REJECTED' as any } : p));
      setActionStatus(`Repair '${id}' rejected.`);
    } catch (e) {
      setActionStatus('Reject operation failed.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-[#0f141f] border border-slate-800 p-5 rounded-xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-800">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Controlled Self-Healing Repair Control Plane</h2>
              <p className="text-xs text-slate-400 font-mono">Human-in-the-loop approval protocol (DETECT &rarr; VERIFY &rarr; PROPOSE &rarr; APPROVE &rarr; APPLY &rarr; AUDIT)</p>
            </div>
          </div>
        </div>

        {actionStatus && (
          <div className="bg-emerald-950/60 border border-emerald-800 p-3 rounded-xl text-xs text-emerald-300 font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionStatus}</span>
          </div>
        )}

        <div className="space-y-3">
          {repairsList.length > 0 ? (
            repairsList.map((prop) => (
              <div key={prop.repair_id} className="bg-[#131926] border border-slate-800 p-4 rounded-xl space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="text-xs font-bold text-purple-400">OPERATION: {prop.operation}</span>
                    <span className="text-slate-500 text-xs">|</span>
                    <span className="text-[10px] text-slate-400">ID: {prop.repair_id}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded uppercase font-bold ${
                    prop.status === 'APPLIED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    prop.status === 'REJECTED' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                  }`}>
                    {prop.status}
                  </span>
                </div>

                <div className="text-xs font-mono bg-[#0b0e17] p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] block font-bold">Justification Reason:</span>
                  <p className="text-slate-200">{prop.reason}</p>
                </div>

                {prop.status === 'PROPOSED' && (
                  <div className="flex items-center space-x-3 pt-1">
                    <button
                      onClick={() => handleApprove(prop.repair_id)}
                      className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve & Apply Repair to FalkorDB</span>
                    </button>
                    <button
                      onClick={() => handleReject(prop.repair_id)}
                      className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-4 py-2 rounded-lg border border-slate-700 transition-all cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Proposal</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-[#131926] border border-slate-800 p-8 rounded-xl text-center space-y-2 text-slate-400 text-xs font-mono">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <p>No active repair proposals. Run Demo scenario to generate a self-healing proposal.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
