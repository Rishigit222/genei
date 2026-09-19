# GRAPH SENTINEL — Live Product Smoke Test Report

## 1. Startup & Service Status
- **Startup Commands**:
  ```bash
  # Docker Deployment
  docker compose up --build

  # Local Manual Deployment
  $env:PYTHONPATH="backend"; python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
  cd frontend && npm run dev
  ```
- **Frontend URL**: `http://localhost:3000`
- **Backend URL**: `http://localhost:8001`
- **FalkorDB Status**: Connected / Active (13 Nodes, 8 Relationships loaded in graph memory engine)

---

## 2. Live Workflow Test Results

### Ingestion Result: PASS
- Sample security document parsed and ingested into FalkorDB via `POST /api/v1/ingest`.
- Entities (`CVE-2026-9812`, `libauth-core`, `Auth-Service`, `Prod-K8s-Node-01`, `Customer-DB`) and relationships populated into the active FalkorDB graph.

### Investigation Result: PASS
- Natural language query: `"What systems could be affected by CVE-2026-9812?"`
- FalkorDB traversed multi-hop impact chain: `CVE-2026-9812` → `libauth-core` → `Auth-Service` → `Prod-K8s-Node-01` → `Customer-DB`.
- Rendered glowing multi-hop path on `@xyflow/react` graph canvas and logged step-by-step agent execution timeline (`PlannerAgent`, `ReasonerAgent`, `VerifierAgent`).

### Evidence Result: PASS
- Source document text spans attached directly to graph relationships.
- Claim classification verified against anti-hallucination contract (`FACT`, `INFERENCE`, `UNCERTAINTY`).

### Contradiction Result: PASS
- Planted synthetic conflict detected by `ContradictionDetectorAgent`:
  - **Source A**: `Auth-Service` uses `libauth-core v1.4` (Source: `doc-arch-spec`, Confidence: `0.95`).
  - **Source B**: `Auth-Service` uses `libauth-legacy v0.9` (Source: `doc-patch-report`, Confidence: `0.60`).
- Displayed in **Contradiction Center** UI with source attribution and confidence comparison.

### Repair Result: PASS
- `RepairAgent` formulated `MARK_SUPERSEDED` proposal for conflicting relationship (`target_relationship_id: rel-04`).
- Human operator clicked **"Approve & Apply Repair to FalkorDB"** in **Repair Center**.
- Status updated to **APPLIED** and target relationship status changed to `SUPERSEDED` in FalkorDB.

### Audit Result: PASS
- Immutable audit events recorded in **Audit Timeline**:
  - `REPAIR_APPROVED_HUMAN` (Actor: `HumanOperator`)
  - `REPAIR_MARK_SUPERSEDED` (Actor: `ControlledSelfHealingEngine`)
  - `INVESTIGATION_COMPLETED` (Actor: `InvestigationOrchestrator`)

### Re-Investigation Result: PASS
- Re-executed query `"What systems could be affected by CVE-2026-9812?"`.
- Confirmed the investigation output reflected the repaired graph state, filtering out the superseded dependency.

---

## 3. Browser Console & Network Audit: PASS
- **Console Errors**: `0` (Zero uncaught JavaScript exceptions, React runtime errors, or resource loading failures).
- **Network Requests**: `0` failed requests (`200 OK` across all `/api/v1/*` endpoints).

---

## 4. Visual Evidence Recording
- **Browser Automation Session Video**: [`live_smoke_test_demo.webp`](file:///C:/Users/rishi/.gemini/antigravity-ide/brain/559b5f03-2353-4968-8628-56a76c5e3290/live_smoke_test_demo_1789803712550.webp)
- **Dashboard Screenshot**: [`dashboard_page.png`](file:///C:/Users/rishi/.gemini/antigravity-ide/brain/559b5f03-2353-4968-8628-56a76c5e3290/dashboard_page_1789803762789.png)
- **Investigation Workspace Screenshot**: [`investigation_workspace.png`](file:///C:/Users/rishi/.gemini/antigravity-ide/brain/559b5f03-2353-4968-8628-56a76c5e3290/investigation_workspace_1789803808516.png)

---

## 5. Final Status

```text
FINAL STATUS: LIVE DEMO READY
```
