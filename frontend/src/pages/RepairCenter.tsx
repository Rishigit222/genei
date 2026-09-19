import React, { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
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
      setRepairsList(prev => prev.map(p => p.repair_id === id ? { ...p, status: 'APPLIED' } : p));
      setActionStatus(`Repair '${id}' approved and applied to FalkorDB!`);
      onRefreshGraph();
    } catch (e) {
      setActionStatus('Approve operation failed.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.rejectRepair(id);
      setRepairsList(prev => prev.map(p => p.repair_id === id ? { ...p, status: 'REJECTED' } : p));
      setActionStatus(`Repair '${id}' rejected.`);
    } catch (e) {
      setActionStatus('Reject operation failed.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-[#0d111a] border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-slate-200">Controlled Self-Healing Repair Control Plane</h2>
              <p className="text-xs text-slate-400">Human-in-the-loop approval protocol (DETECT → VERIFY → PROPOSE → APPROVE → APPLY → AUDIT)</p>
            </div>
          </div>
        </div>

        {actionStatus && (
          <div className="bg-emerald-950/60 border border-emerald-800 p-3 rounded-xl text-xs text-emerald-300 font-mono">
            {actionStatus}
          </div>
        )}

        <div className="space-y-3">
          {repairsList.length > 0 ? (
            repairsList.map((prop) => (
              <div key={prop.repair_id} className="bg-[#131926] border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-purple-400">OPERATION: {prop.operation}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      ID: {prop.repair_id}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded uppercase font-bold ${
                    prop.status === 'APPLIED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    prop.status === 'REJECTED' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                  }`}>
                    {prop.status}
                  </span>
                </div>

                <div className="text-xs font-mono bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] block">Justification Reason:</span>
                  <p className="text-slate-200">{prop.reason}</p>
                </div>

                {prop.status === 'PROPOSED' && (
                  <div className="flex items-center space-x-3 pt-1">
                    <button
                      onClick={() => handleApprove(prop.repair_id)}
                      className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve & Apply Repair to FalkorDB</span>
                    </button>
                    <button
                      onClick={() => handleReject(prop.repair_id)}
                      className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-4 py-2 rounded-xl border border-slate-700 transition-all"
                    >
                      <XCircle className="w-4 h-4" />
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
