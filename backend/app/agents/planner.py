import re
from typing import List, Dict, Any
from app.models.investigation import InvestigationState, AgentStepLog
from app.agents.tools import tools

class PlannerAgent:
    """
    Agent 1: Investigation Planner
    Deconstructs natural language question into explicit, bounded investigation steps.
    """
    def plan(self, state: InvestigationState) -> InvestigationState:
        q = state.question
        state.agent_logs.append(AgentStepLog(
            step_number=1,
            agent_name="PlannerAgent",
            action="Understand Query",
            details=f"Deconstructing question: '{q}'"
        ))

        # Detect target entity (e.g. CVE-2026-9812 or CVE-2026-XXXX pattern)
        cve_match = re.search(r'CVE-\d{4}-\w+', q, re.IGNORECASE)
        target_nodes = []
        if cve_match:
            cve_id = cve_match.group(0).upper()
            target_nodes = tools.search_graph(cve_id)

        if not target_nodes:
            target_nodes = tools.search_graph("CVE-2026-9812")

        if not target_nodes:
            target_nodes = tools.search_graph(q)

        target_ids = [node["id"] for node in target_nodes]
        state.target_entities = target_ids

        # Formulate Bounded Investigation Blueprint
        state.plan = [
            f"1. Identify target vulnerability/entity in FalkorDB (Found: {', '.join(target_ids)})",
            "2. Expand 1-hop direct graph neighbors (Vulnerability -> Package -> Services)",
            "3. Execute multi-hop Cypher traversal (Services -> Servers -> Databases -> Systems)",
            "4. Retrieve supporting document text spans & evidence references",
            "5. Compile evidence-grounded investigation answer with Anti-Hallucination claims"
        ]

        state.agent_logs.append(AgentStepLog(
            step_number=2,
            agent_name="PlannerAgent",
            action="Generate Blueprint",
            details=f"Created {len(state.plan)}-step investigation blueprint."
        ))

        return state

planner_agent = PlannerAgent()
