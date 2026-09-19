from app.services.investigation_service import investigation_service
from data.synthetic_seeder import seed_synthetic_dataset
from fastapi.testclient import TestClient
from app.main import app

def test_investigation_engine_end_to_end():
    # 1. Seed dataset
    seed_synthetic_dataset()

    # 2. Create investigation for target question
    state = investigation_service.create_investigation("What systems could be affected by CVE-2026-9812?")
    assert state.status.value == "idle"

    # 3. Execute investigation pipeline (Planner -> Reasoner -> Verifier)
    completed = investigation_service.run_investigation(state.investigation_id)

    # 4. Verify structured state outputs
    assert completed.status.value == "completed"
    assert "CVE-2026-9812" in completed.target_entities
    assert len(completed.plan) >= 5
    assert len(completed.visited_nodes) > 0
    assert len(completed.paths) > 0
    assert len(completed.evidence) > 0
    assert completed.final_answer is not None

    # 5. Verify Anti-Hallucination Claims
    assert len(completed.fact_claims) > 0
    assert any("FACT:" in claim for claim in completed.fact_claims)
    assert any("INFERENCE:" in claim for claim in completed.inference_claims)
    assert any("UNCERTAINTY:" in claim for claim in completed.uncertainty_claims)

def test_all_api_endpoints():
    client = TestClient(app)
    seed_synthetic_dataset()

    # 1. GET /health
    r_health = client.get("/health")
    assert r_health.status_code == 200
    assert r_health.json()["status"] == "healthy"

    # 2. POST /api/v1/ingest
    r_ingest = client.post("/api/v1/ingest", data={"content": "Vulnerability CVE-2026-9812 affects libauth-core.", "file_name": "advisory.txt"})
    assert r_ingest.status_code == 200
    assert r_ingest.json()["nodes_added"] >= 0

    # 3. POST /api/v1/investigations
    r_create = client.post("/api/v1/investigations", json={"question": "What systems could be affected by CVE-2026-9812?"})
    assert r_create.status_code == 200
    inv_id = r_create.json()["investigation_id"]

    # 4. GET /api/v1/investigations/{id}
    r_get = client.get(f"/api/v1/investigations/{inv_id}")
    assert r_get.status_code == 200

    # 5. POST /api/v1/investigations/{id}/run
    r_run = client.post(f"/api/v1/investigations/{inv_id}/run")
    assert r_run.status_code == 200
    assert r_run.json()["status"] == "completed"

    # 6. GET /api/v1/investigations/{id}/evidence
    r_ev = client.get(f"/api/v1/investigations/{inv_id}/evidence")
    assert r_ev.status_code == 200

    # 7. GET /api/v1/investigations/{id}/paths
    r_paths = client.get(f"/api/v1/investigations/{inv_id}/paths")
    assert r_paths.status_code == 200

    # 8. GET /api/v1/investigations/{id}/conflicts
    r_conflicts = client.get(f"/api/v1/investigations/{inv_id}/conflicts")
    assert r_conflicts.status_code == 200

    # 9. GET /api/v1/repairs
    r_repairs = client.get("/api/v1/repairs")
    assert r_repairs.status_code == 200
    repairs = r_repairs.json()
    if len(repairs) > 0:
        repair_id = repairs[0]["repair_id"]
        # 10. POST /api/v1/repairs/{id}/approve
        r_app = client.post(f"/api/v1/repairs/{repair_id}/approve")
        assert r_app.status_code == 200

    # 11. GET /api/v1/audit
    r_audit = client.get("/api/v1/audit")
    assert r_audit.status_code == 200

    # 12. GET /api/v1/graph/neighborhood/{id}
    r_nb = client.get("/api/v1/graph/neighborhood/svc-auth-service")
    assert r_nb.status_code == 200

    # 13. POST /api/v1/benchmark/run
    r_bench = client.post("/api/v1/benchmark/run")
    assert r_bench.status_code == 200

