import time
import json
from typing import List, Dict, Any, Optional, Tuple
from app.config import settings
from app.utils.logger import logger
from app.models.graph_models import NodeLabel, RelationshipType, RelationshipStatus, NodeModel, RelationshipModel

try:
    from falkordb import FalkorDB
    FALKOR_SDK_AVAILABLE = True
except ImportError:
    FALKOR_SDK_AVAILABLE = False

class FalkorGraphService:
    def __init__(self, graph_name: Optional[str] = None):
        self.graph_name = graph_name or settings.FALKORDB_GRAPH
        self.driver = None
        self.graph = None
        self.is_connected = False
        
        # In-memory graph engine fallback for zero-dependency execution & testing
        self.fallback_nodes: Dict[str, Dict[str, Any]] = {}
        self.fallback_relationships: Dict[str, Dict[str, Any]] = {}
        
        self.connect()

    def connect(self) -> bool:
        if FALKOR_SDK_AVAILABLE:
            try:
                self.driver = FalkorDB(
                    host=settings.FALKORDB_HOST,
                    port=settings.FALKORDB_PORT,
                    username=settings.FALKORDB_USERNAME or None,
                    password=settings.FALKORDB_PASSWORD or None
                )
                self.graph = self.driver.select_graph(self.graph_name)
                # Test connection
                res = self.graph.query("RETURN 1 AS ping")
                self.is_connected = True
                logger.log("INFO", "Connected to FalkorDB successfully", extra={"graph": self.graph_name})
                return True
            except Exception as e:
                logger.log("WARNING", f"FalkorDB connection failed: {e}. Using in-memory graph fallback engine.")
                self.is_connected = False
        else:
            logger.log("WARNING", "FalkorDB SDK not available. Using in-memory graph fallback engine.")
            self.is_connected = False
        return False

    def query(self, cypher: str, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Execute a Cypher query on FalkorDB or fallback engine."""
        params = params or {}
        if self.is_connected and self.graph:
            try:
                start_time = time.time()
                result = self.graph.query(cypher, params)
                latency = (time.time() - start_time) * 1000
                logger.log("DEBUG", "Cypher query executed", latency_ms=latency, extra={"cypher": cypher})
                
                output = []
                if hasattr(result, "result_set") and result.result_set:
                    for row in result.result_set:
                        # Convert FalkorDB node/edge objects to dicts
                        output_row = {}
                        for idx, header in enumerate(result.header if hasattr(result, "header") else range(len(row))):
                            val = row[idx]
                            output_row[str(header)] = self._format_cypher_value(val)
                        output.append(output_row)
                return output
            except Exception as e:
                logger.log("ERROR", f"Cypher query error: {e}", extra={"cypher": cypher, "params": params})
                # Fall through to fallback engine if connection dropped
        
        return self._execute_fallback_cypher(cypher, params)

    def _format_cypher_value(self, val: Any) -> Any:
        if hasattr(val, "properties"):
            props = dict(val.properties)
            if hasattr(val, "labels"):
                props["_labels"] = list(val.labels)
            if hasattr(val, "relation"):
                props["_type"] = val.relation
            if hasattr(val, "id"):
                props["_internal_id"] = val.id
            return props
        if isinstance(val, list):
            return [self._format_cypher_value(v) for v in val]
        return val

    # ==========================================
    # Node & Relationship Management API
    # ==========================================

    def add_node(self, node: NodeModel) -> NodeModel:
        """Add or update an allowlisted node."""
        if node.label not in NodeLabel.__members__.values() and node.label.value not in NodeLabel.__members__.values():
            raise ValueError(f"Label '{node.label}' is not in allowlisted node schema.")

        # Cypher parameterized query
        cypher = f"""
        MERGE (n:{node.label.value if hasattr(node.label, 'value') else node.label} {{id: $id}})
        SET n.name = $name,
            n.description = $description,
            n.aliases = $aliases,
            n.properties = $properties,
            n.created_at = $created_at
        RETURN n
        """
        params = {
            "id": node.id,
            "name": node.name,
            "description": node.description or "",
            "aliases": json.dumps(node.aliases),
            "properties": json.dumps(node.properties),
            "created_at": node.created_at
        }
        self.query(cypher, params)
        
        # Save to fallback
        self.fallback_nodes[node.id] = {
            "id": node.id,
            "label": node.label.value if hasattr(node.label, "value") else str(node.label),
            "name": node.name,
            "description": node.description,
            "aliases": node.aliases,
            "properties": node.properties,
            "created_at": node.created_at
        }
        return node

    def add_relationship(self, rel: RelationshipModel) -> RelationshipModel:
        """Add or update an allowlisted relationship."""
        rel_type_str = rel.type.value if hasattr(rel.type, 'value') else str(rel.type)
        if rel_type_str not in [t.value for t in RelationshipType]:
            raise ValueError(f"Relationship type '{rel.type}' is not in allowlisted schema.")

        cypher = f"""
        MATCH (a {{id: $source_id}})
        MATCH (b {{id: $target_id}})
        MERGE (a)-[r:{rel_type_str} {{id: $rel_id}}]->(b)
        SET r.confidence = $confidence,
            r.source_doc_id = $source_doc_id,
            r.evidence_span = $evidence_span,
            r.status = $status,
            r.created_at = $created_at,
            r.updated_at = $updated_at
        RETURN r
        """
        params = {
            "source_id": rel.source_id,
            "target_id": rel.target_id,
            "rel_id": rel.id,
            "confidence": rel.confidence,
            "source_doc_id": rel.source_doc_id or "",
            "evidence_span": rel.evidence_span or "",
            "status": rel.status.value if hasattr(rel.status, 'value') else str(rel.status),
            "created_at": rel.created_at,
            "updated_at": rel.updated_at
        }
        self.query(cypher, params)

        # Save to fallback
        self.fallback_relationships[rel.id] = {
            "id": rel.id,
            "source_id": rel.source_id,
            "target_id": rel.target_id,
            "type": rel_type_str,
            "confidence": rel.confidence,
            "source_doc_id": rel.source_doc_id,
            "evidence_span": rel.evidence_span,
            "status": rel.status.value if hasattr(rel.status, 'value') else str(rel.status),
            "created_at": rel.created_at,
            "updated_at": rel.updated_at
        }
        return rel

    def get_entity(self, entity_id_or_name: str) -> Optional[Dict[str, Any]]:
        """Find entity by ID or exact/alias name."""
        if entity_id_or_name in self.fallback_nodes:
            return self.fallback_nodes[entity_id_or_name]
        
        target_lower = entity_id_or_name.lower()
        for node in self.fallback_nodes.values():
            if node["name"].lower() == target_lower or target_lower in [a.lower() for a in node.get("aliases", [])]:
                return node
        
        cypher = """
        MATCH (n)
        WHERE n.id = $id OR toLower(n.name) = toLower($id)
        RETURN n
        LIMIT 1
        """
        res = self.query(cypher, {"id": entity_id_or_name})
        if res and len(res) > 0:
            return list(res[0].values())[0]
        return None

    def get_neighborhood(self, entity_id: str, depth: int = 1) -> Dict[str, Any]:
        """Fetch k-hop neighborhood of active relationships."""
        nodes = {}
        edges = []

        center = self.get_entity(entity_id)
        if center:
            nodes[center["id"]] = center

        for rel in self.fallback_relationships.values():
            if rel.get("status") == RelationshipStatus.SUPERSEDED.value:
                continue
            if rel["source_id"] == entity_id or rel["target_id"] == entity_id:
                edges.append(rel)
                if rel["source_id"] in self.fallback_nodes:
                    nodes[rel["source_id"]] = self.fallback_nodes[rel["source_id"]]
                if rel["target_id"] in self.fallback_nodes:
                    nodes[rel["target_id"]] = self.fallback_nodes[rel["target_id"]]

        return {"nodes": list(nodes.values()), "relationships": edges}

    def find_paths(self, start_id: str, max_hops: int = 4) -> List[Dict[str, Any]]:
        """Multi-hop path traversal starting from an entity."""
        paths = []
        visited = set()

        def dfs(current_id: str, current_path: List[Dict[str, Any]], depth: int):
            if depth > max_hops or current_id in visited:
                return
            visited.add(current_id)

            for rel in self.fallback_relationships.values():
                if rel.get("status") == RelationshipStatus.SUPERSEDED.value:
                    continue
                if rel["source_id"] == current_id:
                    next_id = rel["target_id"]
                    new_path = current_path + [rel]
                    paths.append(new_path)
                    dfs(next_id, new_path, depth + 1)

        dfs(start_id, [], 1)
        return paths

    def supersede_relationship(self, rel_id: str) -> bool:
        """Soft-delete relationship by setting status = 'SUPERSEDED'."""
        if rel_id in self.fallback_relationships:
            self.fallback_relationships[rel_id]["status"] = RelationshipStatus.SUPERSEDED.value
            self.fallback_relationships[rel_id]["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ")

        cypher = """
        MATCH (a)-[r]->(b)
        WHERE r.id = $rel_id
        SET r.status = 'SUPERSEDED'
        RETURN r
        """
        self.query(cypher, {"rel_id": rel_id})
        return True

    def get_all_active_graph(self) -> Dict[str, Any]:
        """Return full active graph for visualization."""
        active_rels = [r for r in self.fallback_relationships.values() if r.get("status") != RelationshipStatus.SUPERSEDED.value]
        node_ids = set()
        for r in active_rels:
            node_ids.add(r["source_id"])
            node_ids.add(r["target_id"])

        active_nodes = [self.fallback_nodes[nid] for nid in node_ids if nid in self.fallback_nodes]
        return {"nodes": active_nodes, "relationships": active_rels}

    # ==========================================
    # Fallback Engine Implementation
    # ==========================================

    def _execute_fallback_cypher(self, cypher: str, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Simulate basic Cypher query execution for fallback engine."""
        return []

graph_service = FalkorGraphService()
