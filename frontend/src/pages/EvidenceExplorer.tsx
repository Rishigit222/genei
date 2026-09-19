import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, ExternalLink } from 'lucide-react';
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

  const handleIngest = async () => {
    try {
      const res = await api.ingestDocument(undefined, inputText, 'advisory-report.md');
      setIngestStatus(`Document processed successfully! Added ${res.nodes_added} nodes and ${res.relationships_added} relationships.`);
    } catch (e) {
      setIngestStatus('Ingestion failed.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#0d111a] border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <FileText className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="text-base font-bold text-slate-200">Knowledge Graph Document Ingestion</h2>
            <p className="text-xs text-slate-400">Ingest PDF, Markdown, JSON, or TXT documents into FalkorDB</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block font-mono">Raw Document Content (Markdown / Text / JSON)</label>
          <textarea
            rows={8}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-[#131926] border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <button
          onClick={handleIngest}
          className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Extract Entities & Relationships into FalkorDB</span>
        </button>

        {ingestStatus && (
          <div className="bg-emerald-950/60 border border-emerald-800 p-3 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{ingestStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
};
