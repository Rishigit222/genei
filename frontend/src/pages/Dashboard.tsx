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
  Zap
} from 'lucide-react';
import { GraphData } from '../types';

interface DashboardProps {
  graphData: GraphData;
  onLaunchDemo: () => void;
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ graphData, onLaunchDemo, onNavigate }) => {
  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="bg-[#0f141f] border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-800">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white flex items-center gap-2">
              GRAPH SENTINEL OVERVIEW
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              FalkorDB Autonomous Security Intelligence & GraphRAG Workstation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onLaunchDemo}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Launch Scenario</span>
          </button>
          <button
            onClick={() => onNavigate('workspace')}
            className="flex items-center space-x-1.5 bg-[#161d2c] hover:bg-[#1c263b] text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700 transition-all"
          >
            <span>Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#0f141f] border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>FalkorDB Nodes</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{graphData.nodes.length}</div>
          <div className="text-[10px] text-slate-500 font-mono">Active canonical entity nodes</div>
        </div>

        <div className="bg-[#0f141f] border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Active Relationships</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">{graphData.relationships.length}</div>
          <div className="text-[10px] text-slate-500 font-mono">Validated graph dependency edges</div>
        </div>

        <div className="bg-[#0f141f] border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Planted Contradictions</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">1</div>
          <div className="text-[10px] text-slate-500 font-mono">Conflicting document assertions</div>
        </div>

        <div className="bg-[#0f141f] border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Self-Healing Proposals</span>
            <RefreshCw className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">1</div>
          <div className="text-[10px] text-slate-500 font-mono">Pending MARK_SUPERSEDED repairs</div>
        </div>
      </div>

      {/* Main 2-Column Split: Active Investigation Flow & Product Hierarchy */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Column: Recent Multi-Hop Impact Chain */}
        <div className="col-span-7 bg-[#0f141f] border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase font-mono">Primary Investigation Scenario</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Active Target: CVE-2026-9812
            </span>
          </div>

          <div className="bg-[#141b29] border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="text-xs font-mono text-slate-300 font-bold">
              Multi-Hop FalkorDB Impact Traversal:
            </div>

            {/* Path Visual Bar */}
            <div className="flex items-center justify-between text-xs font-mono gap-1 pt-1 overflow-x-auto">
              <div className="bg-red-950/80 border border-red-800 text-red-300 px-2.5 py-1.5 rounded-lg text-center shrink-0">
                <span className="text-[9px] text-red-400 block font-bold">VULNERABILITY</span>
                <span>CVE-2026-9812</span>
              </div>
              <span className="text-slate-600 font-bold">&rarr;</span>
              <div className="bg-cyan-950/80 border border-cyan-800 text-cyan-300 px-2.5 py-1.5 rounded-lg text-center shrink-0">
                <span className="text-[9px] text-cyan-400 block font-bold">PACKAGE</span>
                <span>libauth-core</span>
              </div>
              <span className="text-slate-600 font-bold">&rarr;</span>
              <div className="bg-purple-950/80 border border-purple-800 text-purple-300 px-2.5 py-1.5 rounded-lg text-center shrink-0">
                <span className="text-[9px] text-purple-400 block font-bold">SERVICE</span>
                <span>Auth-Service</span>
              </div>
              <span className="text-slate-600 font-bold">&rarr;</span>
              <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-2.5 py-1.5 rounded-lg text-center shrink-0">
                <span className="text-[9px] text-emerald-400 block font-bold">SERVER</span>
                <span>Prod-K8s-01</span>
              </div>
              <span className="text-slate-600 font-bold">&rarr;</span>
              <div className="bg-amber-950/80 border border-amber-800 text-amber-300 px-2.5 py-1.5 rounded-lg text-center shrink-0">
                <span className="text-[9px] text-amber-400 block font-bold">DATABASE</span>
                <span>Customer-DB</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              Traverses structural dependency graph from critical vulnerability down to sensitive PostgreSQL Customer-DB storing PII data.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div
              onClick={() => onNavigate('contradictions')}
              className="bg-[#141b29] hover:bg-[#1a2334] border border-amber-900/50 hover:border-amber-700 p-3 rounded-xl cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Contradiction Detector</span>
              </div>
              <p className="text-[10px] text-slate-400">Version conflict: Auth-Service (libauth-core v1.4 vs v0.9)</p>
            </div>

            <div
              onClick={() => onNavigate('repairs')}
              className="bg-[#141b29] hover:bg-[#1a2334] border border-emerald-900/50 hover:border-emerald-700 p-3 rounded-xl cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Self-Healing Control</span>
              </div>
              <p className="text-[10px] text-slate-400">Approve MARK_SUPERSEDED repair proposal</p>
            </div>
          </div>
        </div>

        {/* Right Column: Signature Product Hierarchy Card */}
        <div className="col-span-5 bg-[#0f141f] border border-cyan-900/40 p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Zap className="w-4 h-4" />
                <h3 className="text-xs font-bold text-slate-200 uppercase font-mono">Product Architecture Tree</h3>
              </div>
              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                Signature Feature
              </span>
            </div>

            {/* Compact Product Hierarchy */}
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-[#141b29] p-2.5 rounded-lg border border-cyan-800/60 flex items-center justify-between text-cyan-300 font-bold">
                <span>1. Autonomous Investigation</span>
                <Search className="w-3.5 h-3.5" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-[#141b29] p-2 rounded-lg border border-slate-800 text-slate-300">
                  <span className="font-bold text-cyan-400 block">GraphRAG</span>
                  <span>Multi-hop Cypher</span>
                </div>
                <div className="bg-[#141b29] p-2 rounded-lg border border-slate-800 text-slate-300">
                  <span className="font-bold text-purple-400 block">Evidence</span>
                  <span>Text span attribution</span>
                </div>
              </div>
              <div className="bg-[#141b29] p-2.5 rounded-lg border border-emerald-800/60 flex items-center justify-between text-emerald-300 font-bold">
                <span>2. Knowledge QA (FACT / INFERENCE)</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-[#141b29] p-2 rounded-lg border border-slate-800 text-slate-300">
                  <span className="font-bold text-amber-400 block">Contradictions</span>
                  <span>Conflict scanner</span>
                </div>
                <div className="bg-[#141b29] p-2 rounded-lg border border-slate-800 text-slate-300">
                  <span className="font-bold text-emerald-400 block">Self-Healing</span>
                  <span>MARK_SUPERSEDED</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('workspace')}
            className="w-full bg-[#141b29] hover:bg-[#1a2334] text-cyan-400 font-bold text-xs py-2 rounded-lg border border-cyan-800/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open Investigation Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
