# GRAPH SENTINEL — Architecture Overview

GRAPH SENTINEL is an Autonomous Multi-Agent Investigation & Self-Healing GraphRAG Intelligence Platform built for **FalkorDB**.

```
Document Ingestion (PDF/TXT/MD/CSV/JSON)
           ↓
Deterministic Entity Resolution & Normalization
           ↓
FalkorDB Parameterized Cypher Graph Storage
           ↓
Hybrid GraphRAG Retrieval (Vector + BM25 + Multi-Hop Cypher)
           ↓
5 Inspectable Agents (Planner, Reasoner, Verifier, Contradiction, Repair)
           ↓
Evidence-First Grounding & Anti-Hallucination Contract
           ↓
Controlled Self-Healing Repair Protocol (DETECT -> VERIFY -> PROPOSE -> APPROVE -> APPLY -> AUDIT)
           ↓
Immutable Audit Trail & React Flow Visual Workspace
```

## Core Components
1. **FalkorDB Graph Service (`app/graph/falkor_service.py`)**: Executes parameterized Cypher queries for multi-hop expansion, shortest paths, impact tracing, and graph mutation transactions.
2. **Deterministic Entity Resolver (`app/ingestion/entity_resolver.py`)**: Normalizes candidate entities before LLM processing to eliminate duplicate nodes (e.g. Postgres -> PostgreSQL).
3. **5 Inspectable Agents (`app/agents/`)**:
   - `PlannerAgent`: Formulates investigation blueprint.
   - `ReasonerAgent`: Executes multi-hop Cypher traversals.
   - `VerifierAgent`: Binds text spans and confidence scores to claims.
   - `ContradictionDetectorAgent`: Identifies conflicting graph assertions.
   - `RepairAgent`: Formulates self-healing proposals.
4. **Controlled Self-Healing Framework (`app/healing/repair_engine.py`)**: Soft-deletes superseded relationships (`MARK_SUPERSEDED`) and logs immutable audit events.
