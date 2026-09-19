import uuid
import time
from typing import Dict, Any, Optional
from app.models.investigation import InvestigationState, InvestigationStatus
from app.agents.planner import planner_agent
from app.agents.reasoner import reasoner_agent
from app.agents.verifier import verifier_agent
from app.agents.contradiction import contradiction_agent
from app.agents.repair import repair_agent
from app.services.audit_service import audit_service
from app.utils.logger import logger

class InvestigationOrchestrator:
    """
    Master Orchestrator executing the 5 inspectable agents in sequence:
    PLANNER -> REASONER -> VERIFIER -> CONTRADICTION DETECTOR -> REPAIR AGENT.
    """
    def __init__(self):
        self.investigations: Dict[str, InvestigationState] = {}

    def create_investigation(self, question: str) -> InvestigationState:
        inv_id = f"inv-{uuid.uuid4().hex[:8]}"
        state = InvestigationState(
            investigation_id=inv_id,
            question=question,
            status=InvestigationStatus.IDLE
        )
        self.investigations[inv_id] = state
        return state

    def run_investigation(self, investigation_id: str) -> InvestigationState:
        state = self.investigations.get(investigation_id)
        if not state:
            raise ValueError(f"Investigation ID '{investigation_id}' not found.")

        start_time = time.time()
        state.status = InvestigationStatus.RUNNING

        try:
            # Step 1: Planner Agent
            state = planner_agent.plan(state)

            # Step 2: Reasoner Agent (FalkorDB Cypher Traversals)
            state = reasoner_agent.reason(state)

            # Step 3: Verifier Agent (Evidence Spans & Anti-Hallucination Claims)
            state = verifier_agent.verify(state)

            # Step 4: Contradiction Detector Agent
            state = contradiction_agent.detect(state)

            # Step 5: Repair Agent
            state = repair_agent.formulate_repairs(state)

            # Construct final explainable answer
            state.final_answer = self._construct_answer(state)
            state.status = InvestigationStatus.COMPLETED
            state.completed_at = time.strftime("%Y-%m-%dT%H:%M:%SZ")

            latency = (time.time() - start_time) * 1000
            audit_service.record_event(
                action="INVESTIGATION_COMPLETED",
                actor="InvestigationOrchestrator",
                entity_id=", ".join(state.target_entities),
                new_value=state.question
            )

            logger.log("INFO", f"Investigation '{investigation_id}' completed successfully.", latency_ms=latency)
            return state

        except Exception as e:
            state.status = InvestigationStatus.FAILED
            logger.log("ERROR", f"Investigation failed: {e}")
            raise e

    def _construct_answer(self, state: InvestigationState) -> str:
        lines = [
            f"### Investigation Report for Query: '{state.question}'",
            "",
            "#### Verified Facts (FalkorDB Graph & Evidence Grounded)",
            "\n".join([f"- {fact}" for fact in state.fact_claims]),
            "",
            "#### Multi-Hop Reasoning Inferences",
            "\n".join([f"- {inf}" for inf in state.inference_claims]),
            "",
            "#### Documented Uncertainties",
            "\n".join([f"- {unc}" for unc in state.uncertainty_claims]),
            "",
            f"**FalkorDB Traversal Summary**: Traversed {len(state.visited_nodes)} entities across {len(state.paths)} multi-hop dependency chains.",
            f"**Contradictions Identified**: {len(state.contradictions)} conflicting graph facts.",
            f"**Self-Healing Proposals**: {len(state.repair_proposals)} repair proposals generated."
        ]
        return "\n".join(lines)

investigation_service = InvestigationOrchestrator()
