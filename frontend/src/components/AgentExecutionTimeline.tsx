import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Cpu, Wrench, Clock, ChevronRight, ChevronDown, Layers, Search, ShieldCheck } from 'lucide-react';
import { AgentStepLog } from '../types';

interface AgentExecutionTimelineProps {
  logs: AgentStepLog[];
  status: string;
}

export const AgentExecutionTimeline: React.FC<AgentExecutionTimelineProps> = ({ logs, status }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // Simulated span durations for observability waterfall display
  const getSpanDuration = (index: number, action: string) => {
    if (action.includes('Planner')) return 120;
    if (action.includes('Graph') || action.includes('Traversal')) return 245;
    if (action.includes('Evidence') || action.includes('Verify')) return 180;
    if (action.includes('Contradiction')) return 95;
    if (action.includes('Repair')) return 110;
    return 150 + (index * 25);
  };

  const totalDuration = logs.reduce((acc, log, i) => acc + getSpanDuration(i, log.action), 0);

  return (
    <div className="bg-[#0b0d13] border border-[#1e2433] rounded-xl p-3.5 space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-[#1e2433] pb-2.5">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-violet-400" />
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
            Autonomous Multi-Agent Trace & Span Waterfall
          </h3>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          {logs.length > 0 && (
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Total: {totalDuration} ms
            </span>
          )}
          <span className={`px-2 py-0.5 text-[10px] uppercase font-mono rounded font-medium ${
            status === 'completed' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' :
            status === 'running' ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 animate-pulse' :
            'bg-slate-900 text-slate-400 border border-slate-800'
          }`}>
            {status === 'completed' ? '● Trace Completed' : status === 'running' ? '⚡ Executing Trace' : '○ Idle'}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        {logs.map((log, idx) => {
          const isWarning = log.action.includes('Alert') || log.action.includes('Contradiction');
          const isRepair = log.action.includes('Repair');
          const spanDuration = getSpanDuration(idx, log.action);
          const isExpanded = expandedStep === idx;
          
          return (
            <div 
              key={idx} 
              className={`rounded-lg border text-xs transition-all ${
                isExpanded 
                  ? 'bg-[#121620] border-cyan-500/40' 
                  : 'bg-[#0f121a] border-[#1e2433] hover:border-slate-700'
              }`}
            >
              <div 
                onClick={() => setExpandedStep(isExpanded ? null : idx)}
                className="p-2.5 flex items-center justify-between cursor-pointer select-none gap-3"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <button className="text-slate-500 hover:text-slate-300">
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>

                  <div className="mt-0.5 shrink-0">
                    {isWarning ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    ) : isRepair ? (
                      <Wrench className="w-3.5 h-3.5 text-violet-400" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>

                  <span className="font-mono text-cyan-400 text-[11px] font-semibold shrink-0">
                    {log.agent_name}
                  </span>

                  <span className="text-slate-300 text-[11px] font-medium truncate">
                    {log.action}
                  </span>
                </div>

                {/* Right Waterfall bar & duration */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="w-24 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 hidden sm:block">
                    <div 
                      className={`h-full ${isWarning ? 'bg-amber-500' : isRepair ? 'bg-violet-500' : 'bg-cyan-500'}`}
                      style={{ width: `${Math.min(100, Math.max(20, (spanDuration / 300) * 100))}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 w-12 text-right">
                    {spanDuration}ms
                  </span>
                </div>
              </div>

              {/* Expandable Span Attribute Details */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-[#1e2433] bg-[#0b0d13] text-[11px] space-y-2">
                  <p className="text-slate-300 leading-relaxed font-sans">{log.details}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#121620] p-2 rounded border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block">SPAN ID:</span>
                      <span className="text-cyan-300">span-2026-00{idx + 1}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">TIMESTAMP:</span>
                      <span className="text-slate-300">{log.timestamp}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">AGENT OPERATION:</span>
                      <span className="text-violet-300">{log.action}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">STATUS CODE:</span>
                      <span className={isWarning ? "text-amber-400" : "text-emerald-400"}>
                        {isWarning ? "CONTRADICTION_FOUND" : "SPAN_OK"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-xs font-mono">
            No active trace spans. Run a multi-hop investigation query to observe autonomous agent execution waterfall.
          </div>
        )}
      </div>
    </div>
  );
};

