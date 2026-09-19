import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, Database, Search } from 'lucide-react';
import { api } from '../services/api';

export const EvidenceExplorer: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
`# Incident Advisory Report: CVE-2026-4401
Vulnerability CVE-2026-4401 affects package libauth-core version 1.4.
Auth-Service depends on libauth-core and is deployed on server Prod-K8s-Node-01.
Auth-Service connects directly to database Customer-DB.
`
  );
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleIngest = async () => {
    setLoading(true);
    try {
      const res = await api.ingestDocument(undefined, inputText, 'advisory-report.md');
      setIngestStatus(`Document processed successfully! Added ${res.nodes_added} nodes and ${res.relationships_added} relationships into FalkorDB.`);
    } catch (e) {
      setIngestStatus('Ingestion failed.');
    } finally {
      setLoading(false);
    }
  };

  const sampleEvidenceItems = [
    { id: 'ev-01', docId: 'doc-arch-spec.md', claim: 'Auth-Service uses libauth-core v1.4', entity: 'svc-auth-service', rel: 'USES', confidence: 0.95, status: 'VERIFIED' },
    { id: 'ev-02', docId: 'doc-patch-report.md', claim: 'Auth-Service uses libauth-legacy v0.9', entity: 'svc-auth-service', rel: 'USES', confidence: 0.60, status: 'DISPUTED' },
    { id: 'ev-03', docId: 'cve_report_2026_9812.md', claim: 'CVE-2026-9812 affects libauth-core', entity: 'CVE-2026-9812', rel: 'AFFECTS', confidence: 0.99, status: 'VERIFIED' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Ingestion Workbench Card */}
      <div className="bg-[#0f141f] border border-slate-800 p-5 rounded-xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Document Ingestion Workbench</h2>
              <p className="text-xs text-slate-400 font-mono">Ingest PDF, Markdown, JSON, or TXT security advisories into FalkorDB</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
            FalkorDB Parser Engine
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block font-mono">Raw Document Content (Markdown / Text / JSON)</label>
          <textarea
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-[#131926] border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/80 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleIngest}
            disabled={loading}
            className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer shadow-md shadow-cyan-500/10 disabled:opacity-50"
          >
            {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Upload className="w-3.5 h-3.5" />}
            <span>Extract Entities & Relationships</span>
          </button>
        </div>

        {ingestStatus && (
          <div className="bg-emerald-950/60 border border-emerald-800 p-3 rounded-xl text-xs text-emerald-300 font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{ingestStatus}</span>
          </div>
        )}
      </div>

      {/* Evidence Attribution Queue */}
      <div className="bg-[#0f141f] border border-slate-800 p-5 rounded-xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase font-mono">Attributed Document Evidence Spans</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Anti-Hallucination Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2 px-3">Evidence ID</th>
                <th className="py-2 px-3">Source Document</th>
                <th className="py-2 px-3">Claim Text Span</th>
                <th className="py-2 px-3">Entity</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Confidence</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sampleEvidenceItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#131926] transition-colors">
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">{item.id}</td>
                  <td className="py-2.5 px-3 text-slate-300">{item.docId}</td>
                  <td className="py-2.5 px-3 text-slate-200 max-w-md truncate">{item.claim}</td>
                  <td className="py-2.5 px-3 text-slate-400">{item.entity}</td>
                  <td className="py-2.5 px-3 text-purple-400">{item.rel}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{(item.confidence * 100).toFixed(0)}%</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      item.status === 'VERIFIED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
