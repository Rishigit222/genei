import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { KnowledgeGraphExplorer } from './pages/KnowledgeGraphExplorer';
import { InvestigationWorkspace } from './pages/InvestigationWorkspace';
import { EvidenceExplorer } from './pages/EvidenceExplorer';
import { ContradictionCenter } from './pages/ContradictionCenter';
import { RepairCenter } from './pages/RepairCenter';
import { AuditTimeline } from './pages/AuditTimeline';
import { SystemHealth } from './pages/SystemHealth';
import { api } from './services/api';
import { GraphData, InvestigationState } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [falkorConnected, setFalkorConnected] = useState<boolean>(false);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], relationships: [] });
  const [investigationState, setInvestigationState] = useState<InvestigationState | null>(null);

  const refreshData = async () => {
    try {
      const health = await api.getHealth();
      setFalkorConnected(health.falkordb_connected);
      const fullGraph = await api.getFullGraph();
      setGraphData(fullGraph);
    } catch (e) {
      console.error("Failed to load initial graph data:", e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLaunchDemo = async () => {
    setActiveTab('workspace');
    try {
      const created = await api.createInvestigation('What systems could be affected by CVE-2026-9812?');
      const result = await api.runInvestigation(created.investigation_id);
      setInvestigationState(result);
      refreshData();
    } catch (e) {
      console.error("Demo launch failed:", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        falkorConnected={falkorConnected}
      />

      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <Dashboard
            graphData={graphData}
            onLaunchDemo={handleLaunchDemo}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'workspace' && (
          <InvestigationWorkspace
            graphData={graphData}
            investigationState={investigationState}
            setInvestigationState={setInvestigationState}
            onRefreshGraph={refreshData}
          />
        )}
        {activeTab === 'graph' && (
          <KnowledgeGraphExplorer graphData={graphData} />
        )}
        {activeTab === 'evidence' && (
          <EvidenceExplorer />
        )}
        {activeTab === 'contradictions' && (
          <ContradictionCenter
            contradictions={investigationState?.contradictions || []}
            onNavigateToRepairs={() => setActiveTab('repairs')}
          />
        )}
        {activeTab === 'repairs' && (
          <RepairCenter
            proposals={investigationState?.repair_proposals || []}
            onRefreshGraph={refreshData}
          />
        )}
        {activeTab === 'audit' && (
          <AuditTimeline />
        )}
        {activeTab === 'health' && (
          <SystemHealth />
        )}
      </main>
    </div>
  );
};

export default App;
