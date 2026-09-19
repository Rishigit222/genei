import re
from typing import Dict, Any, Optional, Tuple, List
from app.graph.falkor_service import graph_service

class DeterministicEntityResolver:
    """
    Deterministic Entity Normalizer preventing duplicate entities and resolving aliases
    (e.g., 'Postgres' / 'postgres database' -> 'db-customer-data' / 'Customer-DB').
    """
    def __init__(self):
        # Predefined static alias dictionary for canonical system entities
        self.static_alias_map = {
            "postgres": "db-customer-data",
            "postgresql": "db-customer-data",
            "postgres database": "db-customer-data",
            "auth service": "svc-auth-service",
            "authentication service": "svc-auth-service",
            "authmicroservice": "svc-auth-service",
            "payment service": "svc-payment-gateway",
            "billing api": "svc-payment-gateway",
            "payment gateway": "svc-payment-gateway",
            "libauth": "pkg-libauth-core",
            "auth-core-pkg": "pkg-libauth-core",
            "cve 2026 9812": "CVE-2026-9812",
            "cve-2026-9812": "CVE-2026-9812",
            "prod-k8s-node-1": "srv-k8s-prod-01",
            "k8s node 1": "srv-k8s-prod-01"
        }

    def normalize_name(self, raw_name: str) -> str:
        """Strip punctuation and normalize string for comparison."""
        clean = re.sub(r'[^\w\s-]', '', raw_name).strip().lower()
        return clean

    def resolve(self, raw_name: str, entity_type: str) -> Tuple[str, str]:
        """
        Returns (canonical_id, canonical_display_name).
        Resolves against static alias map or existing FalkorDB graph nodes.
        """
        normalized = self.normalize_name(raw_name)

        # 1. Static Alias Map lookup
        if normalized in self.static_alias_map:
            canonical_id = self.static_alias_map[normalized]
            existing = graph_service.get_entity(canonical_id)
            if existing:
                return existing["id"], existing["name"]

        # 2. Check FalkorDB existing entity by ID or exact name
        existing = graph_service.get_entity(raw_name)
        if existing:
            return existing["id"], existing["name"]

        # 3. Check alias matches across all existing graph nodes
        all_nodes = graph_service.fallback_nodes.values()
        for node in all_nodes:
            if node["name"].lower() == normalized:
                return node["id"], node["name"]
            for alias in node.get("aliases", []):
                if self.normalize_name(alias) == normalized:
                    return node["id"], node["name"]

        # 4. If no match found, format a clean canonical ID
        formatted_id = f"{entity_type.lower()}-{normalized.replace(' ', '-')}"
        return formatted_id, raw_name.strip()

entity_resolver = DeterministicEntityResolver()
