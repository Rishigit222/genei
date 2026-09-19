# GRAPH SENTINEL — UI/UX Redesign Plan
*(Shadcn Admin Design System Adaptation)*

## 1. Executive Summary & Philosophy
GraphSentinel is an **Autonomous Graph Investigation Workstation** for security intelligence and knowledge graph analytics. The UI redesign adopts the design language of `shadcn-admin`:
- Persistent collapsible sidebar layout
- High-density top command bar with global search & shortcut trigger (`Ctrl + K`)
- Command Palette modal for quick keyboard navigation
- High-contrast, low-distraction dark intelligence theme with semantic colors
- Clean typography (Inter + Monospace for IDs/Cypher/timestamps)
- Investigation-first visual hierarchy (Graph canvas as centerpiece)

---

## 2. Component Inventory & Strategy

### A. Existing Components to Preserve
- `GraphCanvas.tsx`: Retain `@xyflow/react` integration, parameterized path highlighting, and FalkorDB data binding. Update node/edge styling to match semantic color system.
- `api.ts`: Retain 100% of API endpoints and backend contracts.
- `types/index.ts`: Retain all TypeScript data models (`GraphData`, `InvestigationState`, `NodeModel`, `RelationshipModel`, `AuditEvent`, `RepairProposal`).

### B. Components to Restyle / Enhance
- `Dashboard.tsx`: Remove giant hero marketing sections. Convert into a high-density Security Intelligence Overview with status indicators, active investigation queue, and graph health metrics.
- `InvestigationWorkspace.tsx`: Make the graph canvas the primary centerpiece (65% screen area). Add structured findings drawer, step-by-step investigation trace bar, and node detail drawer.
- `KnowledgeGraphExplorer.tsx`: Add filter pills, search input, and high-density node panel.
- `EvidenceExplorer.tsx`: Restyle into a clean evidence table/card list with source attribution drawer.
- `ContradictionCenter.tsx`: Restyle into an investigation conflict queue with side-by-side OLD vs NEW claim comparison.
- `RepairCenter.tsx`: Restyle into a human-in-the-loop repair control plane with operation badges and approval/rejection triggers.
- `AuditTimeline.tsx`: Restyle into a high-density vertical audit event stream.
- `SystemHealth.tsx`: Restyle into an engineering diagnostic console displaying live FalkorDB TCP connection status, node/edge counts, and latency benchmarks.

### C. Components to Create
1. `components/layout/AppShell.tsx`: Main persistent sidebar + header + main content container.
2. `components/navigation/Sidebar.tsx`: Collapsible sidebar with navigation groups:
   - **INVESTIGATE**: Overview (`dashboard`), Workspace (`workspace`), History (`audit`)
   - **KNOWLEDGE**: Knowledge Graph (`graph`), Evidence Explorer (`evidence`), Contradiction Center (`contradictions`)
   - **SYSTEM**: Repair Center (`repairs`), Audit Timeline (`audit`), System Health (`health`)
3. `components/navigation/Header.tsx`: Top header with page breadcrumbs, global `Ctrl + K` search trigger, and live FalkorDB status indicator.
4. `components/navigation/CommandPalette.tsx`: Modal dialog for keyboard navigation across views and starting new investigations.
5. `components/ui/*`: Reusable UI primitives (Badge, Button, Card, Dialog, Table, Tooltip).

### D. Files That Must NOT Be Modified
- `backend/**/*`: All backend endpoints, services, graph logic, and tests remain 100% untouched.
- `docker-compose.yml`, `Dockerfile.*`: Infrastructure configurations remain untouched.

---

## 3. Visual Design Tokens & Semantic Color System

| Semantic Role | Token | Hex Color | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `--bg-root` | `#080a0f` | Main application background |
| **Surface** | `--bg-surface` | `#0f141f` | Cards, panels, sidebars |
| **Surface Hover** | `--bg-surface-hover` | `#161d2d` | Hover states |
| **Border** | `--border-subtle` | `#1e2738` | Structural dividers & borders |
| **Primary (Graph)** | `--color-blue` | `#38bdf8` | Graph paths, active nodes, primary actions |
| **Agent / Reasoning**| `--color-violet` | `#a855f7` | Agent logs, execution timeline |
| **Verified / Success**| `--color-green` | `#34d399` | Verified claims (`FACT`), approved repairs |
| **Warning / Uncertainty**| `--color-amber` | `#fbbf24` | Documented uncertainties, pending reviews |
| **Critical / Conflict**| `--color-red` | `#f87171` | Contradictions, vulnerability nodes |

---

## 4. Migration & Execution Strategy
- **Phase 2**: Create `AppShell`, `Sidebar`, `Header`, `CommandPalette`, and theme tokens.
- **Phase 3**: Redesign `Dashboard` into a high-density Overview workstation.
- **Phase 4**: Redesign `InvestigationWorkspace` into the central multi-hop graph workspace.
- **Phase 5-10**: Redesign Knowledge Graph, Evidence Explorer, Contradiction Center, Repair Center, Audit Timeline, and System Health.
- **Phase 11-13**: Build verification, accessibility pass, and final live smoke test.
