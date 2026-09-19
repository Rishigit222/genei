from data.synthetic_seeder import seed_synthetic_dataset
from app.services.investigation_service import investigation_service
from app.services.audit_service import audit_service
from app.graph.falkor_service import graph_service
from app.models.graph_models import RelationshipStatus
from app.agents.tools import tools

def test_contradiction_detection_and_self_healing_flow():
    # 1. Seed dataset with planted contradiction
    seed_synthetic_dataset()

    # 2. Run investigation to DETECT contradictions & PROPOSE repairs
    inv = investigation_service.create_investigation("What systems could be affected by CVE-2026-9812?")
    state = investigation_service.run_investigation(inv.investigation_id)

    # 3. Assert Contradiction Detected
    assert len(state.contradictions) > 0
    conflict = state.contradictions[0]
    assert conflict.entity_id == "svc-auth-service"
    assert conflict.relationship_type == "USES"

    # 4. Assert Repair Proposed
    assert len(state.repair_proposals) > 0
    proposal = state.repair_proposals[0]
    assert proposal.operation.value == "MARK_SUPERSEDED"
    assert proposal.target_relationship_id == conflict.conflicting_relationship_id

    # 5. APPROVE & APPLY Repair
    res = tools.apply_repair(proposal)
    assert res["status"] == "APPLIED"

    # 6. VERIFY FalkorDB Graph Update (Status changed to SUPERSEDED)
    repaired_rel = graph_service.fallback_relationships.get(proposal.target_relationship_id)
    assert repaired_rel is not None
    assert repaired_rel["status"] == RelationshipStatus.SUPERSEDED.value

    # 7. VERIFY Immutable Audit Trail Entry Recorded
    events = audit_service.get_events()
    assert len(events) > 0
    repair_events = [e for e in events if e.repair_id == proposal.repair_id]
    assert len(repair_events) > 0
    assert repair_events[0].action == "REPAIR_MARK_SUPERSEDED"
