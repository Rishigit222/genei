from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class InvestigationStatus(str, Enum):
    IDLE = "idle"
    PLANNING = "planning"
    RUNNING = "running"
    VERIFYING = "verifying"
    COMPLETED = "completed"
    FAILED = "failed"

class EvidenceModel(BaseModel):
    evidence_id: str
    document_id: str
    source_uri: str
    page: Optional[int] = 1
    section: Optional[str] = "Main"
    text_span: str
    entity_ids: List[str] = Field(default_factory=list)
    relationship_ids: List[str] = Field(default_factory=list)
    confidence: float = 1.0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContradictionRecord(BaseModel):
    conflict_id: str
    entity_id: str
    relationship_type: str
    existing_relationship_id: str
    conflicting_relationship_id: str
    existing_value: str
    conflicting_value: str
    source_a_id: str
    source_b_id: str
    source_a_confidence: float = 1.0
    source_b_confidence: float = 1.0
    status: str = "OPEN" # OPEN, RESOLVED
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class RepairOperation(str, Enum):
    ADD_RELATIONSHIP = "ADD_RELATIONSHIP"
    UPDATE_RELATIONSHIP = "UPDATE_RELATIONSHIP"
    MARK_SUPERSEDED = "MARK_SUPERSEDED"
    MERGE_ENTITY = "MERGE_ENTITY"

class RepairStatus(str, Enum):
    PROPOSED = "PROPOSED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    APPLIED = "APPLIED"

class RepairProposal(BaseModel):
    repair_id: str
    investigation_id: str
    operation: RepairOperation
    target_relationship_id: Optional[str] = None
    source_node_id: str
    target_node_id: str
    relationship_type: str
    proposed_relationship_type: Optional[str] = None
    reason: str
    evidence_ids: List[str] = Field(default_factory=list)
    confidence: float = 0.95
    status: RepairStatus = RepairStatus.PROPOSED
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    approved_at: Optional[str] = None
    approved_by: Optional[str] = None

class AuditEvent(BaseModel):
    event_id: str
    actor: str = "GraphSentinelEngine"
    action: str
    entity_id: Optional[str] = None
    relationship_id: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    evidence_ids: List[str] = Field(default_factory=list)
    repair_id: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AgentStepLog(BaseModel):
    step_number: int
    agent_name: str
    action: str
    details: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class InvestigationState(BaseModel):
    investigation_id: str
    question: str
    status: InvestigationStatus = InvestigationStatus.IDLE
    target_entities: List[str] = Field(default_factory=list)
    plan: List[str] = Field(default_factory=list)
    visited_nodes: List[str] = Field(default_factory=list)
    paths: List[List[str]] = Field(default_factory=list)
    evidence: List[EvidenceModel] = Field(default_factory=list)
    contradictions: List[ContradictionRecord] = Field(default_factory=list)
    repair_proposals: List[RepairProposal] = Field(default_factory=list)
    agent_logs: List[AgentStepLog] = Field(default_factory=list)
    final_answer: Optional[str] = None
    fact_claims: List[str] = Field(default_factory=list)
    inference_claims: List[str] = Field(default_factory=list)
    uncertainty_claims: List[str] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    completed_at: Optional[str] = None
