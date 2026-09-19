import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "GRAPH SENTINEL"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    # FalkorDB settings
    FALKORDB_HOST: str = os.getenv("FALKORDB_HOST", "localhost")
    FALKORDB_PORT: int = int(os.getenv("FALKORDB_PORT", "6379"))
    FALKORDB_USERNAME: str = os.getenv("FALKORDB_USERNAME", "")
    FALKORDB_PASSWORD: str = os.getenv("FALKORDB_PASSWORD", "")
    FALKORDB_GRAPH: str = os.getenv("FALKORDB_GRAPH", "graph_sentinel")
    USE_IN_MEMORY_FALLBACK: bool = os.getenv("USE_IN_MEMORY_FALLBACK", "true").lower() == "true"

    # LLM and Embedding settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

    # Agent limits
    MAX_AGENT_STEPS: int = int(os.getenv("MAX_AGENT_STEPS", "10"))
    AGENT_TIMEOUT_SECONDS: int = int(os.getenv("AGENT_TIMEOUT_SECONDS", "45"))
    MAX_TRAVERSAL_DEPTH: int = int(os.getenv("MAX_TRAVERSAL_DEPTH", "4"))

    # Self-healing operational modes
    DEMO_AUTO_REPAIR_MODE: bool = os.getenv("DEMO_AUTO_REPAIR_MODE", "false").lower() == "true"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
