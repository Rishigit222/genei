from fastapi import APIRouter
from typing import List
from app.services.audit_service import audit_service
from app.models.investigation import AuditEvent

router = APIRouter()

@router.get("/api/v1/audit", response_model=List[AuditEvent])
def get_audit_log():
    return audit_service.get_events()
