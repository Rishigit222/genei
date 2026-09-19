import React, { useState } from 'react';
import { Search, Play, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
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

  return (
    <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col">
      {/* Top Query & Controls Bar */}
      <div className="bg-[#0d111a] border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center space-x-3 bg-[#131926] border border-slate-800 px-3 py-2 rounded-xl">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a cybersecurity graph investigation question..."
            className="bg-transparent text-slate-100 text-xs focus:outline-none w-full font-mono placeholder:text-slate-500"
          />
        </div>

        <button
          onClick={handleRunInvestigation}
          disabled={loading}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Play className="w-4 h-4 fill-white" />
          )}
          <span>{loading ? 'Investigating FalkorDB...' : 'Execute Multi-Hop Investigation'}</span>
        </button>
      </div>

      {/* Main Workspace 3-Column Split */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* Left / Center Graph Canvas Panel */}
        <div className="col-span-8 flex flex-col space-y-4">
          <div className="flex-1 relative">
            <GraphCanvas
              nodes={graphData.nodes}
              relationships={graphData.relationships}
              highlightPaths={investigationState?.paths || []}
              onSelectNode={(node) => setSelectedNode(node)}
            />
          </div>

          {/* Bottom Execution Timeline */}
          <AgentExecutionTimeline
            logs={investigationState?.agent_logs || []}
            status={investigationState?.status || 'idle'}
          />
        </div>

        {/* Right Findings & Grounded Claims Panel */}
        <div className="col-span-4 bg-[#0d111a] border border-slate-800 rounded-xl p-4 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                Evidence-Grounded Findings
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Anti-Hallucination Contract</span>
            </div>

            {investigationState ? (
              <div className="space-y-4 text-xs">
                {/* Fact Claims */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-emerald-400 font-mono block">VERIFIED FACTS (GRAPH & EVIDENCE)</span>
                  <div className="space-y-1.5">
                    {investigationState.fact_claims.map((claim, idx) => (
                      <div key={idx} className="bg-emerald-950/40 border border-emerald-800/60 p-2 rounded-lg text-emerald-200 text-[11px] leading-relaxed">
                        {claim}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inferences */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-cyan-400 font-mono block">MULTI-HOP INFERENCES</span>
                  <div className="space-y-1.5">
                    {investigationState.inference_claims.map((claim, idx) => (
                      <div key={idx} className="bg-cyan-950/40 border border-cyan-800/60 p-2 rounded-lg text-cyan-200 text-[11px] leading-relaxed">
                        {claim}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uncertainties */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 font-mono block">DOCUMENTED UNCERTAINTIES</span>
                  <div className="space-y-1.5">
                    {investigationState.uncertainty_claims.map((claim, idx) => (
                      <div key={idx} className="bg-amber-950/40 border border-amber-800/60 p-2 rounded-lg text-amber-200 text-[11px] leading-relaxed">
                        {claim}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs font-mono space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-600" />
                <p>Run an investigation query to populate evidence-first findings.</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex justify-between">
            <span>FalkorDB GraphRAG Reasoning</span>
            <span>Zero Hallucination</span>
          </div>
        </div>
      </div>

      <NodeDetailDrawer node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
};
