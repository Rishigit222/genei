from typing import List, Dict, Any
from app.models.investigation import InvestigationState, AgentStepLog
from app.agents.tools import tools
from app.config import settings

class ReasonerAgent:
    """
    Agent 2: Graph Reasoner
    Executes FalkorDB Cypher multi-hop graph traversals, dependency chain tracing,
    and connected entity discovery.
    """
    def reason(self, state: InvestigationState) -> InvestigationState:
        state.agent_logs.append(AgentStepLog(
            step_number=3,
            agent_name="ReasonerAgent",
            action="Graph Traversal",
            details=f"Executing FalkorDB multi-hop Cypher queries (max depth = {settings.MAX_TRAVERSAL_DEPTH})."
        ))

        visited = set()
        discovered_paths = []

        for entity_id in state.target_entities:
            visited.add(entity_id)

            # 1-hop & k-hop neighborhood expansion
            nb = tools.expand_graph(entity_id, depth=settings.MAX_TRAVERSAL_DEPTH)
            for node in nb.get("nodes", []):
                visited.add(node["id"])

            # Parameterized Cypher multi-hop paths
            paths = tools.find_paths(entity_id, max_hops=settings.MAX_TRAVERSAL_DEPTH)
            for path in paths:
                path_node_ids = []
                for rel in path:
                    path_node_ids.append(rel["source_id"])
                    path_node_ids.append(rel["target_id"])
                    visited.add(rel["source_id"])
                    visited.add(rel["target_id"])
                if path_node_ids not in discovered_paths:
                    discovered_paths.append(path_node_ids)

        state.visited_nodes = list(visited)
        state.paths = discovered_paths

        state.agent_logs.append(AgentStepLog(
            step_number=4,
            agent_name="ReasonerAgent",
            action="Path Analysis Complete",
            details=f"Discovered {len(visited)} connected nodes and {len(discovered_paths)} multi-hop dependency paths."
        ))

        return state

reasoner_agent = ReasonerAgent()
