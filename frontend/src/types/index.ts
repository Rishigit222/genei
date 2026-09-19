export interface NodeModel {
  id: string;
  label: string;
  name: string;
  description?: string;
  aliases?: string[];
  properties?: Record<string, any>;
  created_at?: string;
}

export interface RelationshipModel {
  id: string;
  source_id: string;
  target_id: string;
  type: string;
  confidence: number;
  source_doc_id?: string;
  evidence_span?: string;
  status: 'ACTIVE' | 'SUPERSEDED' | 'DISPUTED';
  created_at?: string;
}

export interface GraphData {
  nodes: NodeModel[];
  relationships: RelationshipModel[];
}

export interface EvidenceModel {
  evidence_id: string;
  document_id: string;
  source_uri: string;
  text_span: string;
  confidence: number;
  entity_ids: string[];
  relationship_ids: string[];
  created_at?: string;
}

export interface ContradictionRecord {
  conflict_id: string;
  entity_id: string;
  relationship_type: string;
  existing_relationship_id: string;
  conflicting_relationship_id: string;
  existing_value: string;
  conflicting_value: string;
  source_a_id: string;
  source_b_id: string;
  source_a_confidence: number;
  source_b_confidence: number;
  status: string;
  created_at: string;
}

export interface RepairProposal {
  repair_id: string;
  investigation_id: string;
  operation: 'ADD_RELATIONSHIP' | 'UPDATE_RELATIONSHIP' | 'MARK_SUPERSEDED' | 'MERGE_ENTITY';
  target_relationship_id?: string;
  source_node_id: string;
  target_node_id: string;
  relationship_type: string;
  reason: string;
  confidence: number;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'APPLIED';
  created_at: string;
  approved_at?: string;
  approved_by?: string;
}

export interface AuditEvent {
  event_id: string;
  actor: string;
  action: string;
  entity_id?: string;
  relationship_id?: string;
  old_value?: string;
  new_value?: string;
  evidence_ids?: string[];
  timestamp: string;
}

export interface AgentStepLog {
  step_number: number;
  agent_name: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface InvestigationState {
  investigation_id: string;
  question: string;
  status: 'idle' | 'planning' | 'running' | 'verifying' | 'completed' | 'failed';
  target_entities: string[];
  plan: string[];
  visited_nodes: string[];
  paths: string[][];
  evidence: EvidenceModel[];
  contradictions: ContradictionRecord[];
  repair_proposals: RepairProposal[];
  agent_logs: AgentStepLog[];
  final_answer?: string;
  fact_claims: string[];
  inference_claims: string[];
  uncertainty_claims: string[];
  created_at: string;
  completed_at?: string;
}
