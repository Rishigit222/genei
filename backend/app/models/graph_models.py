from enum import Enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class NodeLabel(str, Enum):
    DOCUMENT = "Document"
    SOURCE = "Source"
    CLAIM = "Claim"
    ENTITY = "Entity"
    PERSON = "Person"
    ORGANIZATION = "Organization"
    PACKAGE = "Package"
    VULNERABILITY = "Vulnerability"
    SERVICE = "Service"
    APPLICATION = "Application"
    SERVER = "Server"
    DATABASE = "Database"
    SYSTEM = "System"
    INCIDENT = "Incident"
    REPOSITORY = "Repository"
    TEAM = "Team"
    ENVIRONMENT = "Environment"

class RelationshipType(str, Enum):
    MENTIONS = "MENTIONS"
    SUPPORTS = "SUPPORTS"
    CONTRADICTS = "CONTRADICTS"
    AFFECTS = "AFFECTS"
    DEPENDS_ON = "DEPENDS_ON"
    USED_BY = "USED_BY"
    DEPLOYED_ON = "DEPLOYED_ON"
    CONNECTS_TO = "CONNECTS_TO"
    STORES = "STORES"
    USES = "USES"
    INVOLVES = "INVOLVES"
    OWNS = "OWNS"
    RELATED_TO = "RELATED_TO"

class RelationshipStatus(str, Enum):
    ACTIVE = "ACTIVE"
    SUPERSEDED = "SUPERSEDED"
    DISPUTED = "DISPUTED"

class NodeModel(BaseModel):
    id: str
    label: NodeLabel
    name: str
    description: Optional[str] = ""
    properties: Dict[str, Any] = Field(default_factory=dict)
    aliases: List[str] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class RelationshipModel(BaseModel):
    id: str
    source_id: str
    target_id: str
    type: RelationshipType
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    source_doc_id: Optional[str] = None
    evidence_span: Optional[str] = None
    status: RelationshipStatus = RelationshipStatus.ACTIVE
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    valid_from: Optional[str] = None
    valid_until: Optional[str] = None
    properties: Dict[str, Any] = Field(default_factory=dict)

class GraphData(BaseModel):
    nodes: List[NodeModel]
    relationships: List[RelationshipModel]
