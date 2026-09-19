import React, { useEffect, useState } from 'react';
import { History, Shield, Clock } from 'lucide-react';
import { AuditEvent } from '../types';
import { api } from '../services/api';

export const AuditTimeline: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);

  useEffect(() => {
    api.getAuditLog().then(setEvents).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#0d111a] border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <History className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="text-base font-bold text-slate-200">Immutable Audit Trail Timeline</h2>
            <p className="text-xs text-slate-400">Records every graph modification, user approval, and self-healing action</p>
          </div>
        </div>

        <div className="space-y-3">
          {events.map((evt) => (
            <div key={evt.event_id} className="bg-[#131926] border border-slate-800 p-3.5 rounded-xl flex items-start space-x-3 text-xs font-mono">
              <Clock className="w-4 h-4 text-cyan-400 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-bold">{evt.action}</span>
                  <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Actor: <span className="text-slate-200 font-semibold">{evt.actor}</span>
                </div>
                {evt.new_value && (
                  <div className="text-slate-300 text-[11px] bg-slate-900 p-2 rounded border border-slate-800 mt-1">
                    {evt.new_value}
                  </div>
                )}
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs font-mono">
              No audit events logged yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
