from fastapi import APIRouter, HTTPException
from typing import List
from app.services.investigation_service import investigation_service
from app.services.audit_service import audit_service
from app.agents.tools import tools
from app.models.investigation import RepairProposal, RepairStatus

router = APIRouter()

@router.get("/api/v1/repairs", response_model=List[RepairProposal])
def list_repairs():
    all_repairs = []
    for inv in investigation_service.investigations.values():
        all_repairs.extend(inv.repair_proposals)
    return all_repairs

@router.post("/api/v1/repairs/{repair_id}/approve")
def approve_repair(repair_id: str):
    target_proposal = None
    for inv in investigation_service.investigations.values():
        for prop in inv.repair_proposals:
            if prop.repair_id == repair_id:
                target_proposal = prop
                break

    if not target_proposal:
        raise HTTPException(status_code=404, detail="Repair proposal not found")

    res = tools.apply_repair(target_proposal)
    audit_service.record_event(
        action="REPAIR_APPROVED_HUMAN",
        actor="HumanOperator",
        repair_id=repair_id,
        relationship_id=target_proposal.target_relationship_id,
        new_value=f"Approved repair: {target_proposal.reason}"
    )
    return res

@router.post("/api/v1/repairs/{repair_id}/reject")
def reject_repair(repair_id: str):
    for inv in investigation_service.investigations.values():
        for prop in inv.repair_proposals:
            if prop.repair_id == repair_id:
                prop.status = RepairStatus.REJECTED
                audit_service.record_event(
                    action="REPAIR_REJECTED_HUMAN",
                    actor="HumanOperator",
                    repair_id=repair_id
                )
                return {"repair_id": repair_id, "status": "REJECTED"}
    raise HTTPException(status_code=404, detail="Repair proposal not found")
