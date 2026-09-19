import uuid
from datetime import datetime, timezone
from typing import List, Optional
from app.models.investigation import AuditEvent

class AuditService:
    """
    Immutable Audit Log Manager recording every graph mutation, user approval, and self-healing action.
    """
    def __init__(self):
        self._audit_log: List[AuditEvent] = []

    def record_event(
        self,
        action: str,
        actor: str = "GraphSentinelEngine",
        entity_id: Optional[str] = None,
        relationship_id: Optional[str] = None,
        old_value: Optional[str] = None,
        new_value: Optional[str] = None,
        repair_id: Optional[str] = None,
        evidence_ids: Optional[List[str]] = None
    ) -> AuditEvent:
        event = AuditEvent(
            event_id=f"audit-{uuid.uuid4().hex[:8]}",
            actor=actor,
            action=action,
            entity_id=entity_id,
            relationship_id=relationship_id,
            old_value=old_value,
            new_value=new_value,
            repair_id=repair_id,
            evidence_ids=evidence_ids or [],
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        self._audit_log.insert(0, event)
        return event

    def get_events(self, limit: int = 50) -> List[AuditEvent]:
        return self._audit_log[:limit]

audit_service = AuditService()
