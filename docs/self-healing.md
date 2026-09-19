# Controlled Self-Healing Framework

GRAPH SENTINEL implements a human-in-the-loop self-healing graph protocol:

`DETECT → VERIFY → PROPOSE → APPROVE → APPLY → AUDIT`

## Protocol Steps
1. **DETECT**: `ContradictionDetectorAgent` scans FalkorDB graph topology for conflicting relationships (e.g. Service USES v1.4 and USES v2.1).
2. **VERIFY**: `VerifierAgent` fetches raw document evidence spans and source confidence scores.
3. **PROPOSE**: `RepairAgent` formulates a `RepairProposal` object with operation `MARK_SUPERSEDED`.
4. **APPROVE**: Human operator reviews proposal in Repair Center (or automatically approved in `DEMO_AUTO_REPAIR_MODE`).
5. **APPLY**: `tools.apply_repair()` sets target relationship status to `'SUPERSEDED'`.
6. **AUDIT**: `AuditService` records an immutable `AuditEvent` with timestamp, actor, and repair details.
