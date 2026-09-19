import React, { useState } from 'react';
import { Search, Play, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, FileText, Filter, RefreshCw, XCircle, ChevronRight, Sparkles, Activity } from 'lucide-react';
import { GraphData, InvestigationState, NodeModel } from '../types';
import { api } from '../services/api';
import { GraphCanvas } from '../components/GraphCanvas';
import { AgentExecutionTimeline } from '../components/AgentExecutionTimeline';
import { NodeDetailDrawer } from '../components/NodeDetailDrawer';

interface InvestigationWorkspaceProps {
  graphData: GraphData;
  investigationState: InvestigationState | null;
  setInvestigationState: React.Dispatch<React.SetStateAction<InvestigationState | null>>;
  onRefreshGraph: () => void;
}

export const InvestigationWorkspace: React.FC<InvestigationWorkspaceProps> = ({
  graphData,
  investigationState,
  setInvestigationState,
  onRefreshGraph
}) => {
  const [question, setQuestion] = useState<string>('What systems could be affected by CVE-2026-9812?');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<NodeModel | null>(null);
  const [activeTab, setActiveTab] = useState<'facts' | 'inferences' | 'uncertainties'>('facts');
  const [filterType, setFilterType] = useState<string>('ALL');

  const handleRunInvestigation = async () => {
    setLoading(true);
    try {
      const created = await api.createInvestigation(question);
      const result = await api.runInvestigation(created.investigation_id);
      setInvestigationState(result);
      onRefreshGraph();
    } catch (e) {
      console.error("Investigation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    'What systems could be affected by CVE-2026-9812?',
    'Trace dependencies for payment-api service',
    'Find contradictions in database deployment claims'
  ];

  return (
    <div className="space-y-4 h-[calc(100vh-105px)] flex flex-col font-sans">
      {/* Top Controls & Filter Bar */}
      <div className="bg-[#0b0d13] border border-[#1e2433] p-3 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 flex items-center space-x-2 bg-[#121620] border border-[#1e2433] px-3 py-2 rounded-lg focus-within:border-cyan-500/50">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Search investigation targets, Cypher queries, CVEs, or entities..."
            className="bg-transparent text-slate-100 text-xs focus:outline-none w-full font-mono placeholder:text-slate-500"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunInvestigation}
            disabled={loading}
            className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
            <span>{loading ? 'Running Trace...' : 'Run Investigation'}</span>
          </button>

          <button 
            onClick={() => setQuestion('')}
            className="p-2 bg-[#121620] border border-[#1e2433] hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs"
            title="Clear Query"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Query Suggestions & Filter Badges Bar */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 text-[11px] font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Presets:
          </span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setQuestion(q)}
              className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 bg-[#121620] border border-[#1e2433] px-2 py-0.5 rounded transition-all truncate max-w-[220px]"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
          <span>STATUS:</span>
          <span className={`px-2 py-0.5 rounded font-bold uppercase ${
            investigationState?.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
            loading ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 animate-pulse' :
            'bg-slate-900 text-slate-500 border border-slate-800'
          }`}>
            {loading ? 'RUNNING' : investigationState?.status || 'READY'}
          </span>
        </div>
      </div>

      {/* Main Investigation Workspace Split Screen */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* Left/Center Graph Canvas & Bottom Trace (8 Columns) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col space-y-4 min-h-0">
          {/* Canvas Container */}
          <div className="flex-1 relative min-h-[300px]">
            <GraphCanvas
              nodes={graphData.nodes}
              relationships={graphData.relationships}
              highlightPaths={investigationState?.paths || []}
              onSelectNode={(node) => setSelectedNode(node)}
            />
          </div>

          {/* Bottom Execution Trace Waterfall */}
          <div className="shrink-0">
            <AgentExecutionTimeline
              logs={investigationState?.agent_logs || []}
              status={loading ? 'running' : investigationState?.status || 'idle'}
            />
          </div>
        </div>

        {/* Right Findings & Grounded Claims Panel (4 Columns) */}
        <div className="col-span-12 lg:col-span-4 bg-[#0b0d13] border border-[#1e2433] rounded-xl p-4 flex flex-col justify-between overflow-hidden space-y-4">
          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1e2433] pb-3 shrink-0">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold text-slate-200">Investigation Findings</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-[#121620] px-2 py-0.5 rounded border border-[#1e2433]">
                INV-2026-9812
              </span>
            </div>

            {investigationState ? (
              <div className="flex-1 flex flex-col space-y-3 min-h-0">
                {/* Tabs */}
                <div className="flex border-b border-[#1e2433] space-x-2 text-xs shrink-0 font-mono">
                  <button
                    onClick={() => setActiveTab('facts')}
                    className={`pb-2 px-1 border-b-2 font-semibold transition-all ${
                      activeTab === 'facts'
                        ? 'border-emerald-500 text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Verified Facts ({investigationState.fact_claims.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('inferences')}
                    className={`pb-2 px-1 border-b-2 font-semibold transition-all ${
                      activeTab === 'inferences'
                        ? 'border-cyan-500 text-cyan-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Inferences ({investigationState.inference_claims.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('uncertainties')}
                    className={`pb-2 px-1 border-b-2 font-semibold transition-all ${
                      activeTab === 'uncertainties'
                        ? 'border-amber-500 text-amber-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Uncertainties ({investigationState.uncertainty_claims.length})
                  </button>
                </div>

                {/* Tab Content List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {activeTab === 'facts' && (
                    <div className="space-y-2 text-xs">
                      {investigationState.fact_claims.map((claim, idx) => (
                        <div key={idx} className="bg-[#121620] border border-emerald-500/30 p-3 rounded-lg text-emerald-300 text-[11px] leading-relaxed flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{claim}</span>
                        </div>
                      ))}
                      {investigationState.fact_claims.length === 0 && (
                        <p className="text-slate-500 text-xs font-mono py-4 text-center">No verified facts recorded.</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'inferences' && (
                    <div className="space-y-2 text-xs">
                      {investigationState.inference_claims.map((claim, idx) => (
                        <div key={idx} className="bg-[#121620] border border-cyan-500/30 p-3 rounded-lg text-cyan-300 text-[11px] leading-relaxed flex items-start space-x-2">
                          <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{claim}</span>
                        </div>
                      ))}
                      {investigationState.inference_claims.length === 0 && (
                        <p className="text-slate-500 text-xs font-mono py-4 text-center">No inferences generated.</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'uncertainties' && (
                    <div className="space-y-2 text-xs">
                      {investigationState.uncertainty_claims.map((claim, idx) => (
                        <div key={idx} className="bg-[#121620] border border-amber-500/30 p-3 rounded-lg text-amber-300 text-[11px] leading-relaxed flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{claim}</span>
                        </div>
                      ))}
                      {investigationState.uncertainty_claims.length === 0 && (
                        <p className="text-slate-500 text-xs font-mono py-4 text-center">No documented uncertainties.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs font-mono space-y-3">
                <FileText className="w-8 h-8 text-slate-600" />
                <div>
                  <p className="text-slate-300 font-semibold mb-1">No Active Investigation</p>
                  <p className="text-[#8a99ad] text-[11px]">Enter a query or select a preset to execute FalkorDB GraphRAG multi-hop reasoning.</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#1e2433] text-[10px] text-slate-500 font-mono flex justify-between shrink-0">
            <span>FalkorDB Graph Engine</span>
            <span>Zero Hallucination Grounding</span>
          </div>
        </div>
      </div>

      <NodeDetailDrawer node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
};

