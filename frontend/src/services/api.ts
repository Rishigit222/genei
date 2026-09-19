import axios from 'axios';
import { GraphData, InvestigationState, EvidenceModel, ContradictionRecord, RepairProposal, AuditEvent, NodeModel } from '../types';

const API_BASE = '/api/v1';

export const api = {
  async getHealth() {
    const res = await axios.get('/health');
    return res.data;
  },

  async getFullGraph(): Promise<GraphData> {
    const res = await axios.get(`${API_BASE}/graph/full`);
    return res.data;
  },

  async getEntity(id: string): Promise<NodeModel> {
    const res = await axios.get(`${API_BASE}/graph/entity/${id}`);
    return res.data;
  },

  async createInvestigation(question: string): Promise<InvestigationState> {
    const res = await axios.post(`${API_BASE}/investigations`, { question });
    return res.data;
  },

  async runInvestigation(id: string): Promise<InvestigationState> {
    const res = await axios.post(`${API_BASE}/investigations/${id}/run`);
    return res.data;
  },

  async getInvestigation(id: string): Promise<InvestigationState> {
    const res = await axios.get(`${API_BASE}/investigations/${id}`);
    return res.data;
  },

  async ingestDocument(file?: File, text?: string, fileName?: string) {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text) formData.append('content', text);
    if (fileName) formData.append('file_name', fileName);
    const res = await axios.post(`${API_BASE}/ingest`, formData);
    return res.data;
  },

  async seedDataset() {
    const res = await axios.post(`${API_BASE}/seed`);
    return res.data;
  },

  async getRepairs(): Promise<RepairProposal[]> {
    const res = await axios.get(`${API_BASE}/repairs`);
    return res.data;
  },

  async approveRepair(repairId: string) {
    const res = await axios.post(`${API_BASE}/repairs/${repairId}/approve`);
    return res.data;
  },

  async rejectRepair(repairId: string) {
    const res = await axios.post(`${API_BASE}/repairs/${repairId}/reject`);
    return res.data;
  },

  async getAuditLog(): Promise<AuditEvent[]> {
    const res = await axios.get(`${API_BASE}/audit`);
    return res.data;
  },

  async runBenchmark() {
    const res = await axios.post(`${API_BASE}/benchmark/run`);
    return res.data;
  }
};
