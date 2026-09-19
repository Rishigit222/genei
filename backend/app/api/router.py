from fastapi import APIRouter
from app.api.endpoints import health, graph, ingest, retrieval, investigations, repairs, audit

api_router = APIRouter()

# Phase 1, 2, 3, 4, 5, 7, & 8 Endpoints
api_router.include_router(health.router)
api_router.include_router(graph.router)
api_router.include_router(ingest.router)
api_router.include_router(retrieval.router)
api_router.include_router(investigations.router)
api_router.include_router(repairs.router)
api_router.include_router(audit.router)
