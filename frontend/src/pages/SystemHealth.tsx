import React, { useState, useEffect } from 'react';
import { Database, Play, CheckCircle, RefreshCw, BarChart2, Server, Activity, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const SystemHealth: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [benchmark, setBenchmark] = useState<any>(null);
  const [loadingBenchmark, setLoadingBenchmark] = useState<boolean>(false);

  useEffect(() => {
    api.getHealth().then(setHealth).catch(console.error);
  }, []);

  const handleRunBenchmark = async () => {
    setLoadingBenchmark(true);
    try {
      const res = await api.runBenchmark();
      setBenchmark(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBenchmark(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-[#0f141f] border border-slate-800 p-5 rounded-xl space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-800">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Engineering System Diagnostics & FalkorDB Monitor</h2>
              <p className="text-xs text-slate-400 font-mono">Live operational telemetry and benchmark evaluation metrics</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
            HEALTHY
          </span>
        </div>

        {health && (
          <div className="grid grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-[#131926] p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-slate-400 text-[10px] flex items-center justify-between">
                <span>FALKORDB ENGINE</span>
                <Server className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${health.falkordb_connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                <span className="font-bold text-slate-200">{health.falkordb_connected ? 'Connected (TCP 6379)' : 'In-Memory Fallback'}</span>
              </div>
            </div>

            <div className="bg-[#131926] p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] flex items-center justify-between">
                <span>CANONICAL NODES</span>
                <Database className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl font-bold text-cyan-400">{health.nodes_count}</div>
            </div>

            <div className="bg-[#131926] p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] flex items-center justify-between">
                <span>VALIDATED EDGES</span>
                <Activity className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-xl font-bold text-purple-400">{health.relationships_count}</div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-slate-200">Baseline Evaluation Benchmark Engine</h3>
            </div>
            <button
              onClick={handleRunBenchmark}
              disabled={loadingBenchmark}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-purple-500/10 cursor-pointer disabled:opacity-50"
            >
              {loadingBenchmark ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>{loadingBenchmark ? 'Evaluating...' : 'Run Benchmark Evaluation'}</span>
            </button>
          </div>

          {benchmark && (
            <div className="grid grid-cols-3 gap-4 text-xs font-mono pt-1">
              {Object.entries(benchmark).map(([model, metrics]: [string, any]) => (
                <div key={model} className="bg-[#131926] border border-slate-800 p-4 rounded-xl space-y-2 shadow-sm">
                  <div className="font-bold text-cyan-400 border-b border-slate-800 pb-1.5 uppercase text-[11px] flex justify-between">
                    <span>{model.replace('_', ' ')}</span>
                    {model === 'graph_sentinel' && <span className="text-[9px] text-emerald-400 bg-emerald-950 px-1.5 rounded">WINNER</span>}
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Retrieval Accuracy:</span>
                      <span className="text-emerald-400 font-bold">{metrics.retrieval_accuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Multi-Hop Accuracy:</span>
                      <span className="text-emerald-400 font-bold">{metrics.multi_hop_accuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contradiction Detect:</span>
                      <span className="text-emerald-400 font-bold">{metrics.contradiction_detection}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Latency:</span>
                      <span className="text-cyan-300 font-bold">{metrics.avg_latency_ms} ms</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
