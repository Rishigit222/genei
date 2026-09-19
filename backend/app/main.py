import os
import sys

# Ensure root directory and backend directory are in sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
workspace_dir = os.path.dirname(root_dir)
if workspace_dir not in sys.path:
    sys.path.insert(0, workspace_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.api.router import api_router
from data.synthetic_seeder import seed_synthetic_dataset
from app.utils.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.log("INFO", "Starting GRAPH SENTINEL Backend Engine...")
    try:
        seed_synthetic_dataset()
    except Exception as e:
        logger.log("ERROR", f"Startup dataset seeding failed: {e}")
    yield
    logger.log("INFO", "Shutting down GRAPH SENTINEL Backend Engine...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Autonomous Multi-Agent Investigation & Self-Healing GraphRAG Intelligence Platform powered by FalkorDB",
    lifespan=lifespan
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
