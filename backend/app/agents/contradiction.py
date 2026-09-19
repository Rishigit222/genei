from typing import List
from app.models.investigation import InvestigationState, AgentStepLog, ContradictionRecord
from app.agents.tools import tools

class ContradictionDetectorAgent:
    """
    Agent 4: Contradiction Detector
    Scans visited FalkorDB graph nodes for conflicting relationships,
    evaluating source reliability, document IDs, and confidence scores.
    """
    def detect(self, state: InvestigationState) -> InvestigationState:
        state.agent_logs.append(AgentStepLog(
            step_number=7,
            agent_name="ContradictionDetectorAgent",
            action="Scan Conflicts",
            details="Scanning visited FalkorDB graph nodes for contradictory relationship assertions."
        ))

        contradictions = []
        for entity_id in state.visited_nodes:
            conflicts = tools.detect_conflicts(entity_id)
            for c in conflicts:
                r1 = c["r1"]
                r2 = c["r2"]
                rec = ContradictionRecord(
                    conflict_id=c["conflict_id"],
                    entity_id=entity_id,
                    relationship_type=c["relationship_type"],
                    existing_relationship_id=r1["id"],
                    conflicting_relationship_id=r2["id"],
                    existing_value=f"{entity_id} {r1['type']} {r1['target_id']}",
                    conflicting_value=f"{entity_id} {r2['type']} {r2['target_id']}",
                    source_a_id=r1.get("source_doc_id", "doc-arch-spec"),
                    source_b_id=r2.get("source_doc_id", "doc-patch-report"),
                    source_a_confidence=r1.get("confidence", 0.95),
                    source_b_confidence=r2.get("confidence", 0.60),
                    status="OPEN"
                )
                contradictions.append(rec)

        state.contradictions = contradictions

        if contradictions:
            state.agent_logs.append(AgentStepLog(
                step_number=8,
                agent_name="ContradictionDetectorAgent",
                action="Contradiction Alert",
                details=f"Detected {len(contradictions)} conflicting graph facts requiring self-healing repair."
            ))
        else:
            state.agent_logs.append(AgentStepLog(
                step_number=8,
                agent_name="ContradictionDetectorAgent",
                action="No Conflicts",
                details="No contradictory relationships detected in current graph state."
            ))

        return state

contradiction_agent = ContradictionDetectorAgent()
