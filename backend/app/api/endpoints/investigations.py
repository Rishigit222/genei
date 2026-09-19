from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.investigation_service import investigation_service

router = APIRouter()

class CreateInvestigationRequest(BaseModel):
    question: str

@router.post("/api/v1/investigations")
def create_investigation(req: CreateInvestigationRequest):
    return investigation_service.create_investigation(req.question)

@router.get("/api/v1/investigations/{investigation_id}")
def get_investigation(investigation_id: str):
    state = investigation_service.investigations.get(investigation_id)
    if not state:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return state

@router.post("/api/v1/investigations/{investigation_id}/run")
def run_investigation(investigation_id: str):
    return investigation_service.run_investigation(investigation_id)

@router.get("/api/v1/investigations/{investigation_id}/evidence")
def get_evidence(investigation_id: str):
    state = investigation_service.investigations.get(investigation_id)
    if not state:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return state.evidence

@router.get("/api/v1/investigations/{investigation_id}/paths")
def get_paths(investigation_id: str):
    state = investigation_service.investigations.get(investigation_id)
    if not state:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return state.paths

@router.get("/api/v1/investigations/{investigation_id}/conflicts")
def get_conflicts(investigation_id: str):
    state = investigation_service.investigations.get(investigation_id)
    if not state:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return state.contradictions

