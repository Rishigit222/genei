import React from 'react';
import { CheckCircle2, AlertTriangle, Cpu, Wrench, ShieldAlert } from 'lucide-react';
import { AgentStepLog } from '../types';

interface AgentExecutionTimelineProps {
  logs: AgentStepLog[];
  status: string;
}

export const AgentExecutionTimeline: React.FC<AgentExecutionTimelineProps> = ({ logs, status }) => {
  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Autonomous Multi-Agent Trace & Timeline
        </h3>
        <span className={`px-2 py-0.5 text-[10px] uppercase font-mono rounded font-medium ${
          status === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
          status === 'running' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 animate-pulse' :
          'bg-slate-800 text-slate-400'
        }`}>
          {status}
        </span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {logs.map((log, idx) => {
          const isWarning = log.action.includes('Alert') || log.action.includes('Contradiction');
          const isRepair = log.action.includes('Repair');
          
          return (
            <div key={idx} className="flex items-start space-x-3 text-xs bg-[#111622] p-2.5 rounded-lg border border-slate-800/60">
              <div className="mt-0.5">
                {isWarning ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                ) : isRepair ? (
                  <Wrench className="w-4 h-4 text-purple-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-cyan-400 text-[11px] font-medium">{log.agent_name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{log.timestamp.split('T')[1]?.split('.')[0]}</span>
                </div>
                <div className="text-slate-300 font-semibold text-[11px] mt-0.5">{log.action}</div>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{log.details}</p>
              </div>
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-xs font-mono">
            No active investigation logs. Launch an investigation scenario to observe multi-agent trace.
          </div>
        )}
      </div>
    </div>
  );
};
