import React, { useEffect, useState } from 'react';
import { History, Clock, ShieldCheck, UserCheck, Zap } from 'lucide-react';
import { AuditEvent } from '../types';
import { api } from '../services/api';

export const AuditTimeline: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);

  useEffect(() => {
    api.getAuditLog().then(setEvents).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#0f141f] border border-slate-800 p-5 rounded-xl space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-800">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Immutable Audit Trail Timeline</h2>
              <p className="text-xs text-slate-400 font-mono">Immutable ledger recording graph mutations, human approvals, and agent traversals</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
            FalkorDB Audit Stream
          </span>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {events.map((evt) => (
            <div key={evt.event_id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#0f141f] border-2 border-cyan-500 flex items-center justify-center text-cyan-400 z-10 shadow-md">
                <Clock className="w-2.5 h-2.5" />
              </div>

              <div className="bg-[#131926] border border-slate-800/80 p-4 rounded-xl space-y-2 shadow-sm hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{evt.action}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
                </div>

                <div className="text-xs font-mono text-slate-400 flex items-center gap-4 text-[11px]">
                  <span>Actor: <strong className="text-slate-200">{evt.actor}</strong></span>
                  {evt.entity_id && <span>Entity: <strong className="text-purple-400">{evt.entity_id}</strong></span>}
                </div>

                {evt.new_value && (
                  <div className="text-xs font-mono text-slate-300 bg-[#0b0e17] p-2.5 rounded-lg border border-slate-800/80 leading-relaxed text-[11px]">
                    {evt.new_value}
                  </div>
                )}
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-xs font-mono">
              No audit events logged yet in current session.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
