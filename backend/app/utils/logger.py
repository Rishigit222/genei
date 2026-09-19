import logging
import json
import time
from typing import Any, Dict, Optional

class StructuredLogger:
    def __init__(self, name: str = "graphsentinel"):
        self.logger = logging.getLogger(name)
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)

    def log(
        self,
        level: str,
        event: str,
        request_id: Optional[str] = None,
        investigation_id: Optional[str] = None,
        agent: Optional[str] = None,
        tool: Optional[str] = None,
        latency_ms: Optional[float] = None,
        extra: Optional[Dict[str, Any]] = None,
    ):
        payload = {
            "event": event,
            "request_id": request_id,
            "investigation_id": investigation_id,
            "agent": agent,
            "tool": tool,
            "latency_ms": round(latency_ms, 2) if latency_ms is not None else None,
        }
        if extra:
            payload.update(extra)

        clean_payload = {k: v for k, v in payload.items() if v is not None}
        msg = json.dumps(clean_payload)

        if level.upper() == "DEBUG":
            self.logger.debug(msg)
        elif level.upper() == "WARNING":
            self.logger.warning(msg)
        elif level.upper() == "ERROR":
            self.logger.error(msg)
        else:
            self.logger.info(msg)

logger = StructuredLogger()
