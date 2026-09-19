from fastapi import APIRouter, HTTPException
from app.graph.falkor_service import graph_service
from data.synthetic_seeder import seed_synthetic_dataset

router = APIRouter()

@router.get("/api/v1/graph/entity/{entity_id}")
def get_entity(entity_id: str):
    entity = graph_service.get_entity(entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail=f"Entity '{entity_id}' not found in FalkorDB")
    return entity

@router.get("/api/v1/graph/neighborhood/{entity_id}")
def get_neighborhood(entity_id: str, depth: int = 1):
    return graph_service.get_neighborhood(entity_id, depth=depth)

@router.get("/api/v1/graph/full")
def get_full_graph():
    return graph_service.get_all_active_graph()

@router.post("/api/v1/seed")
def seed_graph():
    res = seed_synthetic_dataset()
    return {"message": "Synthetic cybersecurity dataset seeded into FalkorDB successfully", "stats": res}
