import React from 'react';
import { Shield, Play, AlertTriangle, RefreshCw, CheckCircle2, Activity, ArrowRight, Zap, Database } from 'lucide-react';
import { GraphData } from '../types';

interface DashboardProps {
  graphData: GraphData;
  onLaunchDemo: () => void;
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ graphData, onLaunchDemo, onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-dark-800 to-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-xs uppercase font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold tracking-wider">
            WeMakeDevs Graph Hacks Hackathon Entry
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Autonomous Cybersecurity GraphRAG Investigation Platform
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            GRAPH SENTINEL leverages FalkorDB to execute multi-hop Cypher path traversals, evidence-first claim verification, contradiction detection, and controlled self-healing graph repairs.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onLaunchDemo}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Demo Investigation Scenario</span>
            </button>
            <button
              onClick={() => onNavigate('workspace')}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
            >
              <span>Open Investigation Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#0d111a] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-mono block">FalkorDB Graph Nodes</span>
            <span className="text-2xl font-bold font-mono text-cyan-400">{graphData.nodes.length}</span>
          </div>
          <div className="p-3 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-800">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d111a] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-mono block">Active Relationships</span>
            <span className="text-2xl font-bold font-mono text-purple-400">{graphData.relationships.length}</span>
          </div>
          <div className="p-3 bg-purple-950 text-purple-400 rounded-xl border border-purple-800">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d111a] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-mono block">Planted Contradictions</span>
            <span className="text-2xl font-bold font-mono text-amber-400">1</span>
          </div>
          <div className="p-3 bg-amber-950 text-amber-400 rounded-xl border border-amber-800">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d111a] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-mono block">Self-Healing Proposals</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">1</span>
          </div>
          <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Signature Product Hierarchy Section */}
      <div className="bg-[#0d111a] border border-cyan-900/60 p-6 rounded-2xl space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
              Core Architectural Signature Feature
            </span>
            <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              GRAPH SENTINEL Product Hierarchy
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">FalkorDB Autonomous Multi-Agent Pipeline</span>
        </div>

        {/* Tree Diagram Rendering */}
        <div className="flex flex-col items-center justify-center space-y-4 py-2">
          {/* Level 1: Root & Autonomous Investigation */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white font-extrabold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 border border-cyan-400/30 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span>GRAPH SENTINEL</span>
            </div>
            <div className="h-4 w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500"></div>
            <div className="bg-slate-900 border border-slate-700 px-5 py-2 rounded-xl text-xs font-mono text-cyan-300 font-bold shadow-md">
              Autonomous Investigation Engine
            </div>
            <div className="h-4 w-0.5 bg-slate-700"></div>
          </div>

          {/* Level 2: Dual Pillars (GraphRAG + Evidence) */}
          <div className="w-full max-w-2xl relative flex justify-around">
            <div className="w-1/2 flex flex-col items-center pr-4">
              <div
                onClick={() => onNavigate('workspace')}
                className="w-full bg-[#131926] hover:bg-[#1a2336] border border-cyan-500/40 hover:border-cyan-400 p-3.5 rounded-xl text-center space-y-1 cursor-pointer transition-all shadow-md group"
              >
                <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold text-xs">
                  <Database className="w-4 h-4" />
                  <span>GraphRAG</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Multi-hop Cypher reasoning</p>
              </div>
            </div>

            <div className="w-1/2 flex flex-col items-center pl-4">
              <div
                onClick={() => onNavigate('evidence')}
                className="w-full bg-[#131926] hover:bg-[#1a2336] border border-purple-500/40 hover:border-purple-400 p-3.5 rounded-xl text-center space-y-1 cursor-pointer transition-all shadow-md group"
              >
                <div className="flex items-center justify-center gap-2 text-purple-400 font-bold text-xs">
                  <Shield className="w-4 h-4" />
                  <span>Evidence Explorer</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Source document attribution</p>
              </div>
            </div>
          </div>

          {/* Level 3: Knowledge QA Nexus */}
          <div className="flex flex-col items-center pt-1">
            <div className="h-4 w-0.5 bg-slate-700"></div>
            <div
              onClick={() => onNavigate('workspace')}
              className="bg-slate-900 hover:bg-slate-800 border border-emerald-500/50 px-6 py-2.5 rounded-xl text-xs font-mono text-emerald-300 font-bold shadow-lg shadow-emerald-950/50 flex items-center gap-2 cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Knowledge QA (FACT / INFERENCE / UNCERTAINTY)</span>
            </div>
            <div className="h-4 w-0.5 bg-slate-700"></div>
          </div>

          {/* Level 4: Contradiction Detection & Self-Healing Graph */}
          <div className="w-full max-w-2xl flex justify-around">
            <div className="w-1/2 flex flex-col items-center pr-4">
              <div
                onClick={() => onNavigate('contradictions')}
                className="w-full bg-[#131926] hover:bg-[#1b2333] border border-amber-500/40 hover:border-amber-400 p-3.5 rounded-xl text-center space-y-1 cursor-pointer transition-all shadow-md"
              >
                <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Contradiction Detection</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Conflicting document assertion analysis</p>
              </div>
            </div>

            <div className="w-1/2 flex flex-col items-center pl-4">
              <div
                onClick={() => onNavigate('repairs')}
                className="w-full bg-[#131926] hover:bg-[#1b2333] border border-emerald-500/40 hover:border-emerald-400 p-3.5 rounded-xl text-center space-y-1 cursor-pointer transition-all shadow-md"
              >
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs">
                  <RefreshCw className="w-4 h-4" />
                  <span>Self-Healing Graph</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Controlled MARK_SUPERSEDED repairs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-[#0d111a] border border-slate-800 p-5 rounded-xl space-y-2 cursor-pointer hover:border-cyan-500/50 transition-all" onClick={() => onNavigate('workspace')}>
          <div className="flex items-center space-x-2 text-cyan-400">
            <Shield className="w-5 h-5" />
            <h3 className="font-bold text-slate-200 text-sm">Multi-Hop Traversal</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Traverses vulnerability impact chains: CVE &rarr; Package &rarr; Microservice &rarr; K8s Node &rarr; PostgreSQL Customer DB.
          </p>
        </div>

        <div className="bg-[#0d111a] border border-slate-800 p-5 rounded-xl space-y-2 cursor-pointer hover:border-amber-500/50 transition-all" onClick={() => onNavigate('contradictions')}>
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-slate-200 text-sm">Contradiction Center</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Detects conflicting document claims (e.g. Auth-Service using libauth-core v1.4 vs libauth-legacy v0.9).
          </p>
        </div>

        <div className="bg-[#0d111a] border border-slate-800 p-5 rounded-xl space-y-2 cursor-pointer hover:border-emerald-500/50 transition-all" onClick={() => onNavigate('repairs')}>
          <div className="flex items-center space-x-2 text-emerald-400">
            <RefreshCw className="w-5 h-5" />
            <h3 className="font-bold text-slate-200 text-sm">Controlled Self-Healing</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Formulates repair proposals with soft-deletion (MARK_SUPERSEDED) and immutable audit log writebacks.
          </p>
        </div>
      </div>
    </div>
  );
};
