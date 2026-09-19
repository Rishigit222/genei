import pytest
from app.services.investigation_service import investigation_service
from data.synthetic_seeder import seed_synthetic_dataset

def test_full_investigation_flow():
    seed_synthetic_dataset()

    state = investigation_service.create_investigation("What systems could be affected by CVE-2026-9812?")
    assert state.status.value == "idle"

    completed = investigation_service.run_investigation(state.investigation_id)
    assert completed.status.value == "completed"
    assert len(completed.visited_nodes) > 0
    assert len(completed.evidence) > 0
    assert completed.final_answer is not None
    assert "FACT" in completed.final_answer
