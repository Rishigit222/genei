import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.graph.falkor_service import graph_service
from app.models.graph_models import RelationshipStatus, RelationshipModel, RelationshipType
from app.models.investigation import RepairProposal, RepairOperation, RepairStatus
from app.services.audit_service import audit_service

class AgentTools:
    """Explicit Tools for Investigation, Contradiction Detection, & Controlled Self-Healing."""

    @staticmethod
    def search_graph(query: str, label: Optional[str] = None) -> List[Dict[str, Any]]:
        """Tool 1: Find entities in graph matching query and optional label."""
        results = []
        q_lower = query.lower()
        for node in graph_service.fallback_nodes.values():
            if label and node.get("label") != label:
                continue
            if q_lower in node["name"].lower() or q_lower in node.get("description", "").lower():
                results.append(node)
            else:
                for alias in node.get("aliases", []):
                    if q_lower in alias.lower():
                        results.append(node)
                        break
        return results

    @staticmethod
    def expand_graph(entity_id: str, depth: int = 1) -> Dict[str, Any]:
        """Tool 2: Expand k-hop neighborhood around entity (both incoming & outgoing edges)."""
        return graph_service.get_neighborhood(entity_id, depth=depth)

    @staticmethod
    def find_paths(source_id: str, max_hops: int = 4) -> List[Dict[str, Any]]:
        """Tool 3: Multi-hop graph traversal from source node (both incoming and outgoing active edges)."""
        paths = []
        visited_in_path = set()

        def dfs(current_id: str, current_path: List[Dict[str, Any]], depth: int):
            if depth > max_hops or current_id in visited_in_path:
                return
            visited_in_path.add(current_id)

            for rel in graph_service.fallback_relationships.values():
                if rel.get("status") == RelationshipStatus.SUPERSEDED.value:
                    continue

                next_id = None
                if rel["source_id"] == current_id:
                    next_id = rel["target_id"]
                elif rel["target_id"] == current_id:
                    next_id = rel["source_id"]

                if next_id and next_id not in visited_in_path:
                    new_path = current_path + [rel]
                    paths.append(new_path)
                    dfs(next_id, new_path, depth + 1)

            visited_in_path.remove(current_id)

        dfs(source_id, [], 1)
        return paths

    @staticmethod
    def search_evidence(query: str, entity_ids: List[str]) -> List[Dict[str, Any]]:
        """Tool 4: Retrieve text spans and source documents supporting claims."""
        evidence_list = []
        for rel in graph_service.fallback_relationships.values():
            if rel.get("source_id") in entity_ids or rel.get("target_id") in entity_ids:
                if rel.get("evidence_span"):
                    evidence_list.append({
                        "evidence_id": f"ev-{rel['id']}",
                        "document_id": rel.get("source_doc_id", "unknown-doc"),
                        "text_span": rel["evidence_span"],
                        "confidence": rel.get("confidence", 1.0),
                        "relationship_id": rel["id"],
                        "source_id": rel.get("source_id"),
                        "target_id": rel.get("target_id")
                    })
        return evidence_list

    @staticmethod
    def detect_conflicts(entity_id: str) -> List[Dict[str, Any]]:
        """Tool 5: Detect conflicting graph facts (e.g. multiple active version dependencies on single entity)."""
        conflicts = []
        rels = [r for r in graph_service.fallback_relationships.values() if r["source_id"] == entity_id]

        # Group relationships by type
        by_type: Dict[str, List[Dict[str, Any]]] = {}
        for r in rels:
            t = r["type"]
            by_type.setdefault(t, []).append(r)

        for rtype, r_list in by_type.items():
            active_list = [r for r in r_list if r.get("status") != RelationshipStatus.SUPERSEDED.value]
            if len(active_list) > 1 and rtype in ["USES", "DEPENDS_ON", "DEPLOYED_ON"]:
                r1 = active_list[0]
                r2 = active_list[1]
                conflicts.append({
                    "conflict_id": f"conflict-{uuid.uuid4().hex[:6]}",
                    "entity_id": entity_id,
                    "relationship_type": rtype,
                    "r1": r1,
                    "r2": r2,
                    "reason": f"Entity '{entity_id}' has conflicting {rtype} relationships with target '{r1['target_id']}' and target '{r2['target_id']}'"
                })
        return conflicts

    @staticmethod
    def propose_repair(
        investigation_id: str,
        operation: str,
        source_node_id: str,
        target_node_id: str,
        relationship_type: str,
        target_relationship_id: Optional[str] = None,
        reason: str = "Self-healing resolution of contradictory relationship"
    ) -> RepairProposal:
        """Tool 6: Formulate typed RepairProposal object."""
        proposal = RepairProposal(
            repair_id=f"repair-{uuid.uuid4().hex[:8]}",
            investigation_id=investigation_id,
            operation=RepairOperation(operation),
            target_relationship_id=target_relationship_id,
            source_node_id=source_node_id,
            target_node_id=target_node_id,
            relationship_type=relationship_type,
            reason=reason,
            confidence=0.95,
            status=RepairStatus.PROPOSED
        )
        return proposal

    @staticmethod
    def apply_repair(repair: RepairProposal) -> Dict[str, Any]:
        """
        Tool 7: Execute approved repair transaction in FalkorDB through allowlisted graph service.
        Writes immutable audit log entry.
        """
        old_val = None
        new_val = None

        if repair.operation == RepairOperation.MARK_SUPERSEDED and repair.target_relationship_id:
            old_rel = graph_service.fallback_relationships.get(repair.target_relationship_id)
            old_val = f"Status: {old_rel.get('status', 'ACTIVE') if old_rel else 'ACTIVE'}"
            graph_service.supersede_relationship(repair.target_relationship_id)
            new_val = "Status: SUPERSEDED"

        elif repair.operation == RepairOperation.ADD_RELATIONSHIP:
            new_rel = RelationshipModel(
                id=f"rel-{uuid.uuid4().hex[:8]}",
                source_id=repair.source_node_id,
                target_id=repair.target_node_id,
                type=RelationshipType(repair.relationship_type),
                confidence=repair.confidence,
                status=RelationshipStatus.ACTIVE,
                evidence_span=repair.reason
            )
            graph_service.add_relationship(new_rel)
            new_val = f"Added relationship {repair.source_node_id} -> {repair.relationship_type} -> {repair.target_node_id}"

        repair.status = RepairStatus.APPLIED
        repair.approved_at = datetime.now(timezone.utc).isoformat()

        # AUDIT: Record immutable audit event
        audit_service.record_event(
            action=f"REPAIR_{repair.operation.value}",
            actor="ControlledSelfHealingEngine",
            entity_id=repair.source_node_id,
            relationship_id=repair.target_relationship_id,
            old_value=old_val,
            new_value=new_val,
            repair_id=repair.repair_id
        )

        return {"repair_id": repair.repair_id, "status": "APPLIED"}

    @staticmethod
    def get_entity(entity_id: str) -> Optional[Dict[str, Any]]:
        """Tool 8: Retrieve node metadata."""
        return graph_service.get_entity(entity_id)

    @staticmethod
    def get_relationship_evidence(relationship_id: str) -> Optional[Dict[str, Any]]:
        """Tool 9: Retrieve edge evidence text span and document reference."""
        rel = graph_service.fallback_relationships.get(relationship_id)
        if rel:
            return {
                "relationship_id": rel["id"],
                "type": rel["type"],
                "source_doc_id": rel.get("source_doc_id"),
                "evidence_span": rel.get("evidence_span"),
                "confidence": rel.get("confidence", 1.0),
                "status": rel.get("status")
            }
        return None

tools = AgentTools()
