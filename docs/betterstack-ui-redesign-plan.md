# GRAPH SENTINEL — Better Stack-Inspired UI/UX Redesign Plan
*(Enterprise Observability & Security Investigation Console)*

## 1. Executive Summary & Design Vision
GraphSentinel is an **Autonomous Graph Investigation Workstation** engineered around **FalkorDB**. This redesign adapts the high-density information architecture, dark engineering aesthetics, and investigation-first UX patterns of **Better Stack Tracing** (https://betterstack.com/tracing):
- **Deep Graphite Dark Mode**: High-contrast, low-distraction dark mode (`#0b0d13` background, `#121620` panels, `#1e2433` borders).
- **Trace = Investigation**: Translating HTTP tracing concepts into multi-hop graph investigation (Span = Agent Operation, Waterfall = Agent Trace Timeline, Service = Graph Entity, Error = Contradiction).
- **High Information Density**: Compact typography (Inter + Monospace for IDs, timestamps, and Cypher), dense tables, filter bars, status badges, and contextual right detail drawers.
- **Graph Canvas as Centerpiece**: The interactive graph canvas occupies the primary visual area in the workspace, with semantic node coloring and traversal path highlighting.

---

## 2. Concept Mapping (Better Stack Tracing → GraphSentinel)

| Better Stack Concept | GraphSentinel Concept | Implementation in GraphSentinel |
| :--- | :--- | :--- |
| **Tracing** | **Graph Investigation** | Natural language multi-hop vulnerability & dependency reasoning |
| **Trace** | **Investigation Execution** | `InvestigationState` lifecycle (`inv-xxxx`) |
| **Span** | **Agent Operation** | Step logs (`PlannerAgent`, `ReasonerAgent`, `VerifierAgent`, `ContradictionDetector`, `RepairAgent`) |
| **Waterfall Timeline** | **Agent Execution Trace** | Bottom timeline showing step durations (ms), inputs, outputs, and discovered entities |
| **Service** | **Graph Entity** | FalkorDB canonical node (`Vulnerability`, `Package`, `Service`, `Server`, `Database`) |
| **Service Map** | **Knowledge Graph** | `@xyflow/react` multi-hop dependency canvas |
| **Error / Exception** | **Contradiction / Conflict** | Version or relationship conflicts across document sources |
| **Span Attributes / Logs** | **Evidence Metadata & Spans** | Document text spans, source IDs, and confidence scores |
| **Root Cause** | **Investigation Finding** | Verified facts (`FACT`) and multi-hop inferences (`INFERENCE`) |
| **Remediation Action** | **Self-Healing Repair** | Controlled `MARK_SUPERSEDED` proposal and approval workflow |
| **Audit Log** | **Audit Trail Event** | Immutable ledger recording graph mutations and human approvals |

---

## 3. Component Inventory & Action Plan

### A. Core Layout & Application Shell
- `components/layout/AppShell.tsx`: High-density container with persistent collapsible sidebar, top command bar, breadcrumbs, and modal overlay.
- `components/navigation/Sidebar.tsx`: Navigation groups (`OVERVIEW`, `INVESTIGATE`, `OBSERVE`, `ANALYZE`, `HEAL`, `AUDIT`, `SYSTEM`) with Lucide icons and active route indicators.
- `components/navigation/TopBar.tsx`: Compact header with dynamic breadcrumbs (`GraphSentinel / Investigations / INV-2026-9812`), global `Ctrl+K` search trigger, and live FalkorDB status indicator.
- `components/navigation/CommandPalette.tsx`: `Ctrl+K` command palette for instant route navigation and query execution.

### B. Workspace & Graph Canvas (Centerpiece)
- `pages/InvestigationWorkspace.tsx`: 3-panel layout:
  - **Left**: Investigation query input, action controls (`Run`, `Stop`, `Rerun`), entity/confidence filter chips.
  - **Center**: Graph Canvas (`@xyflow/react`) with semantic node coloring, circular layout, path traversal highlighting, and hover tooltips.
  - **Right**: Contextual Detail Drawer with tabs (`Overview`, `Relationships`, `Evidence`, `History`).
  - **Bottom**: Tracing/Waterfall Timeline displaying step-by-step agent spans with expandable metadata.
- `components/GraphCanvas.tsx`: Preserved `@xyflow/react` rendering with semantic colors (Red = Vulnerability, Blue = Package, Violet = Service, Orange = Server, Green = Database, Gray = Document).
- `components/AgentTraceTimeline.tsx`: Observability-style waterfall timeline for agent execution steps.

### C. Pages & Observability Views
- `pages/Dashboard.tsx`: High-density Security Intelligence Overview with compact metrics (Graph Nodes/Edges, Active Investigations, Evidence, Contradictions, Repairs), recent investigation traces table, and knowledge graph health metrics.
- `pages/KnowledgeGraphExplorer.tsx`: Full-screen graph exploration console with filter toolbar and node metadata panel.
- `pages/EvidenceExplorer.tsx`: High-density evidence attribution data table with document text span inspection drawer.
- `pages/ContradictionCenter.tsx`: Incident/issue queue with side-by-side OLD vs NEW assertion comparison cards.
- `pages/RepairCenter.tsx`: Controlled change-management console displaying repair proposals (`MARK_SUPERSEDED`) with approval/rejection API triggers.
- `pages/AuditTimeline.tsx`: Chronological vertical event viewer stream.
- `pages/SystemHealth.tsx`: Engineering diagnostic console displaying live FalkorDB status and latency benchmarks.

---

## 4. Semantic Design System Tokens

```css
:root {
  /* Background & Surfaces (Deep Graphite) */
  --bg-root: #0b0d13;
  --bg-panel: #121620;
  --bg-[#161c29]: #161c29;
  --border-subtle: #1e2433;
  --border-focus: #38bdf8;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Semantic State Colors */
  --color-blue: #38bdf8;       /* Graph info / Primary */
  --color-violet: #a855f7;     /* Agent reasoning activity */
  --color-green: #34d399;      /* Verified facts / Healthy status */
  --color-amber: #fbbf24;      /* Uncertainty / Pending review */
  --color-red: #f87171;        /* Contradiction / Threat */
  --color-gray: #94a3b8;       /* Neutral metadata */
}
```

---

## 5. Migration & Validation Strategy
1. **Preserve All Backend APIs & Logic**: `100% backend preservation`.
2. **Incremental Component Redesign**:
   - Phase 1: Create `AppShell`, `Sidebar`, `TopBar`, `CommandPalette`.
   - Phase 2: Redesign `Dashboard` into a high-density Overview workstation.
   - Phase 3: Redesign `InvestigationWorkspace` with tracing waterfall timeline & contextual detail drawer.
   - Phase 4: Redesign Knowledge Graph, Evidence Explorer, Contradiction Center, Repair Center, Audit Timeline, and System Health.
3. **Build & Test Verification**: Verify `npm run build` and `pytest backend/tests` after each phase.
