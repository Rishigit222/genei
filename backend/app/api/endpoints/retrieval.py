from fastapi import APIRouter
from pydantic import BaseModel
from app.retrieval.hybrid_search import hybrid_retriever

router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    max_depth: int = 4

@router.post("/api/v1/search")
def execute_hybrid_search(req: SearchRequest):
    return hybrid_retriever.search(req.query, max_depth=req.max_depth)
