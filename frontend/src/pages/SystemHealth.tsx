import React, { useState, useEffect } from 'react';
import { Database, Play, CheckCircle, RefreshCw, BarChart2 } from 'lucide-react';
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
      <div className="bg-[#0d111a] border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <Database className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="text-base font-bold text-slate-200">System Diagnostics & FalkorDB Monitor</h2>
            <p className="text-xs text-slate-400">Live operational status and baseline evaluation benchmark</p>
          </div>
        </div>

        {health && (
          <div className="grid grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-[#131926] p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px]">FalkorDB Engine Status</span>
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${health.falkordb_connected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className="font-bold text-slate-200">{health.falkordb_connected ? 'Connected (TCP 6379)' : 'In-Memory Fallback'}</span>
              </div>
            </div>

            <div className="bg-[#131926] p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px]">Loaded Nodes</span>
              <div className="text-xl font-bold text-cyan-400">{health.nodes_count}</div>
            </div>

            <div className="bg-[#131926] p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px]">Active Relationships</span>
              <div className="text-xl font-bold text-purple-400">{health.relationships_count}</div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-purple-400" />
              <h3 className="text-xs font-bold text-slate-200">Baseline Evaluation Benchmark Engine</h3>
            </div>
            <button
              onClick={handleRunBenchmark}
              disabled={loadingBenchmark}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              {loadingBenchmark ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{loadingBenchmark ? 'Evaluating...' : 'Run Benchmark Experiment'}</span>
            </button>
          </div>

          {benchmark && (
            <div className="grid grid-cols-3 gap-4 text-xs font-mono pt-2">
              {Object.entries(benchmark).map(([model, metrics]: [string, any]) => (
                <div key={model} className="bg-[#131926] border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-cyan-400 border-b border-slate-800 pb-1 uppercase">{model}</div>
                  <div className="space-y-1 text-[11px]">
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
