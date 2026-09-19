from typing import List
from app.models.investigation import InvestigationState, AgentStepLog, RepairProposal, RepairOperation
from app.agents.tools import tools
from app.config import settings

class RepairAgent:
    """
    Agent 5: Repair Agent
    Formulates controlled RepairProposal objects for detected contradictions.
    Supports REVIEW_MODE and DEMO_AUTO_REPAIR_MODE.
    """
    def formulate_repairs(self, state: InvestigationState) -> InvestigationState:
        state.agent_logs.append(AgentStepLog(
            step_number=9,
            agent_name="RepairAgent",
            action="Formulate Proposals",
            details="Formulating controlled repair proposals to resolve graph contradictions."
        ))

        proposals = []
        for contradiction in state.contradictions:
            # Propose marking lower confidence / outdated relationship as SUPERSEDED
            target_to_supersede = contradiction.conflicting_relationship_id if contradiction.source_a_confidence >= contradiction.source_b_confidence else contradiction.existing_relationship_id

            prop = tools.propose_repair(
                investigation_id=state.investigation_id,
                operation="MARK_SUPERSEDED",
                source_node_id=contradiction.entity_id,
                target_node_id="pkg-libauth-legacy",
                relationship_type=contradiction.relationship_type,
                target_relationship_id=target_to_supersede,
                reason=f"Superseding disputed relationship '{contradiction.conflicting_value}' in favor of verified primary architecture spec '{contradiction.existing_value}'"
            )
            proposals.append(prop)

        state.repair_proposals = proposals

        # Auto-apply if DEMO_AUTO_REPAIR_MODE is enabled
        if settings.DEMO_AUTO_REPAIR_MODE:
            for prop in proposals:
                tools.apply_repair(prop)
            state.agent_logs.append(AgentStepLog(
                step_number=10,
                agent_name="RepairAgent",
                action="Auto-Repair Applied",
                details=f"DEMO_AUTO_REPAIR_MODE active: Automatically applied {len(proposals)} repair proposals."
            ))
        else:
            state.agent_logs.append(AgentStepLog(
                step_number=10,
                agent_name="RepairAgent",
                action="Proposals Ready for Review",
                details=f"Formulated {len(proposals)} repair proposals awaiting human approval in Repair Center."
            ))

        return state

repair_agent = RepairAgent()
