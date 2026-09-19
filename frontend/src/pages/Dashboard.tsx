import React from 'react';
import {
  Shield,
  Play,
  AlertTriangle,
  RefreshCw,
  Activity,
  ArrowRight,
  Database,
  Search,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  Zap,
  GitBranch,
  ShieldCheck,
  FileCheck,
  Filter
} from 'lucide-react';
import { GraphData } from '../types';

interface DashboardProps {
  graphData: GraphData;
  onLaunchDemo: () => void;
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ graphData, onLaunchDemo, onNavigate }) => {
  const recentInvestigations = [
    {
      id: 'INV-2026-001',
      query: 'What systems could be affected by CVE-2026-9812?',
      status: 'COMPLETED',
      entities: 13,
      evidence: 4,
      duration: '182ms',
      created: '2026-09-19 13:11:35'
    },
    {
      id: 'INV-2026-002',
      query: 'Which databases store sensitive data connected to Auth-Service?',
      status: 'COMPLETED',
      entities: 8,
      evidence: 3,
      duration: '145ms',
      created: '2026-09-19 12:40:10'
    }
  ];

  const recentFindings = [
    {
      severity: 'HIGH',
      title: 'CVE-2026-9812 affects Auth-Service via libauth-core v1.4',
      path: 'CVE-2026-9812 → libauth-core → Auth-Service → Prod-K8s-01 → Customer-DB',
      confidence: 0.98,
      evidenceCount: 4,
      timestamp: '2026-09-19 13:11:35'
    },
    {
      severity: 'MEDIUM',
      title: 'Version conflict detected: Auth-Service (libauth-core v1.4 vs v0.9)',
      path: 'svc-auth-service USES pkg-libauth-core (disputed by doc-patch-report)',
      confidence: 0.82,
      evidenceCount: 2,
      timestamp: '2026-09-19 13:11:35'
    }
  ];

  const recentEvidence = [
    { source: 'cve_report_2026_9812.md', claim: 'CVE-2026-9812 affects libauth-core CVSS 9.8', type: 'AFFECTS', confidence: 0.99, timestamp: '13:11:35' },
    { source: 'doc-arch-spec.md', claim: 'Auth-Service uses libauth-core version 1.4', type: 'USES', confidence: 0.95, timestamp: '13:11:35' },
    { source: 'doc-patch-report.md', claim: 'Auth-Service depends on libauth-legacy v0.9', type: 'USES', confidence: 0.60, timestamp: '13:11:35' },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Overview Header */}
      <div className="bg-[#121620] border border-[#1e2433] p-4 rounded-xl flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
            <span>GraphSentinel</span>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400">Security Intelligence Overview</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Investigate relationships, verify evidence, detect contradictions, and safely repair graph knowledge.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onLaunchDemo}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Launch Scenario</span>
          </button>
          <button
            onClick={() => onNavigate('workspace')}
            className="flex items-center space-x-1 bg-[#182030] hover:bg-[#1e2a40] text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#1e2433] transition-all"
          >
            <span>Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5 Operational Metrics Cards */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-[#121620] border border-[#1e2433] p-3 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
            <span>GRAPH</span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400">{graphData.nodes.length} <span className="text-xs text-slate-400 font-normal">nodes</span></div>
          <div className="text-[10px] text-slate-500 font-mono">{graphData.relationships.length} active relationships</div>
        </div>

        <div className="bg-[#121620] border border-[#1e2433] p-3 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
            <span>INVESTIGATIONS</span>
            <Zap className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-blue-400">1 <span className="text-xs text-slate-400 font-normal">active</span></div>
          <div className="text-[10px] text-slate-500 font-mono">2 completed in session</div>
        </div>

        <div className="bg-[#121620] border border-[#1e2433] p-3 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
            <span>EVIDENCE</span>
            <FileText className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-400">4 <span className="text-xs text-slate-400 font-normal">verified</span></div>
          <div className="text-[10px] text-slate-500 font-mono">0 pending verification</div>
        </div>

        <div className="bg-[#121620] border border-[#1e2433] p-3 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
            <span>CONTRADICTIONS</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">1 <span className="text-xs text-slate-400 font-normal">detected</span></div>
          <div className="text-[10px] text-slate-500 font-mono">Requires verification</div>
        </div>

        <div className="bg-[#121620] border border-[#1e2433] p-3 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
            <span>REPAIRS</span>
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">1 <span className="text-xs text-slate-400 font-normal">pending</span></div>
          <div className="text-[10px] text-slate-500 font-mono">MARK_SUPERSEDED proposal</div>
        </div>
      </div>

      {/* Main Grid: Section 1 & Section 2 */}
      <div className="grid grid-cols-12 gap-4">
        {/* Section 1: Recent Investigation Activity Table */}
        <div className="col-span-8 bg-[#121620] border border-[#1e2433] p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#1e2433] pb-2.5">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase font-mono">Recent Investigation Traces</h2>
            </div>
            <button onClick={() => onNavigate('workspace')} className="text-[10px] font-mono text-cyan-400 hover:underline">
              View All Traces &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-[#1e2433] text-slate-500 text-[10px] uppercase">
                  <th className="py-2 px-3">Trace ID</th>
                  <th className="py-2 px-3">Query</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Entities</th>
                  <th className="py-2 px-3">Evidence</th>
                  <th className="py-2 px-3">Duration</th>
                  <th className="py-2 px-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2433]/60">
                {recentInvestigations.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => onNavigate('workspace')}
                    className="hover:bg-[#182030] transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 text-cyan-400 font-bold group-hover:underline">{inv.id}</td>
                    <td className="py-2.5 px-3 text-slate-200 max-w-xs truncate">{inv.query}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-purple-400 font-bold">{inv.entities}</td>
                    <td className="py-2.5 px-3 text-cyan-300">{inv.evidence}</td>
                    <td className="py-2.5 px-3 text-slate-400">{inv.duration}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[10px]">{inv.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Investigation Pipeline Status */}
        <div className="col-span-4 bg-[#121620] border border-[#1e2433] p-4 rounded-xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1e2433] pb-2.5">
              <div className="flex items-center space-x-2 text-cyan-400">
                <GitBranch className="w-4 h-4" />
                <h2 className="text-xs font-bold text-slate-200 uppercase font-mono">Agent Execution Trace</h2>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                COMPLETED
              </span>
            </div>

            <div className="space-y-2 pt-2 text-xs font-mono">
              <div className="flex items-center space-x-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>1. Query parsed & target CVE resolved</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>2. FalkorDB multi-hop Cypher path traversed</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>3. 4 document evidence spans verified</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>4. 1 version contradiction detected</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>5. Self-healing repair proposed</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('workspace')}
            className="w-full bg-[#182030] hover:bg-[#1e2a40] text-cyan-400 font-bold text-xs py-2 rounded-lg border border-cyan-800/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Inspect Full Workspace Trace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Section 4 & Section 5 */}
      <div className="grid grid-cols-12 gap-4">
        {/* Section 4: Recent Investigation Findings */}
        <div className="col-span-6 bg-[#121620] border border-[#1e2433] p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#1e2433] pb-2.5">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase font-mono">Recent Investigation Findings</h2>
            </div>
            <span className="text-[9px] font-mono text-slate-500">Anti-Hallucination Contract</span>
          </div>

          <div className="space-y-2.5">
            {recentFindings.map((finding, idx) => (
              <div key={idx} className="bg-[#0b0d13] border border-[#1e2433] p-3 rounded-lg space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    finding.severity === 'HIGH' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {finding.severity} SEVERITY
                  </span>
                  <span className="text-slate-500 text-[10px]">{finding.timestamp}</span>
                </div>
                <div className="text-slate-200 font-bold text-xs">{finding.title}</div>
                <div className="text-[10px] text-cyan-400 bg-[#121620] p-1.5 rounded border border-[#1e2433] truncate">
                  {finding.path}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Confidence: <strong className="text-emerald-400">{(finding.confidence * 100).toFixed(0)}%</strong></span>
                  <span>Evidence: <strong className="text-purple-400">{finding.evidenceCount} sources</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Recent Document Evidence Spans */}
        <div className="col-span-6 bg-[#121620] border border-[#1e2433] p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#1e2433] pb-2.5">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase font-mono">Recent Document Evidence Spans</h2>
            </div>
            <button onClick={() => onNavigate('evidence')} className="text-[10px] font-mono text-cyan-400 hover:underline">
              View All Evidence &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {recentEvidence.map((ev, idx) => (
              <div key={idx} className="bg-[#0b0d13] border border-[#1e2433] p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                <div className="space-y-0.5 min-w-0 pr-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-400 font-bold">{ev.type}</span>
                    <span className="text-slate-500 text-[10px]">|</span>
                    <span className="text-slate-300 text-[11px] truncate">{ev.source}</span>
                  </div>
                  <div className="text-slate-400 text-[10px] truncate max-w-sm">{ev.claim}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-emerald-400 font-bold block text-[11px]">{(ev.confidence * 100).toFixed(0)}%</span>
                  <span className="text-slate-500 text-[9px]">{ev.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
