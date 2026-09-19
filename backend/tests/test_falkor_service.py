import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.graph.falkor_service import FalkorGraphService, graph_service
from app.models.graph_models import NodeModel, RelationshipModel, NodeLabel, RelationshipType, RelationshipStatus
from data.synthetic_seeder import seed_synthetic_dataset

def test_health_endpoint():
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "nodes_count" in data

def test_falkor_service_connection():
    service = FalkorGraphService("test_phase_1_2")
    assert service.graph_name == "test_phase_1_2"

def test_schema_allowlist_validation():
    service = FalkorGraphService("test_phase_1_2")
    
    # Valid node label
    valid_node = NodeModel(id="vuln-01", label=NodeLabel.VULNERABILITY, name="CVE-2026-9812")
    res = service.add_node(valid_node)
    assert res.id == "vuln-01"

    # Valid relationship type
    node_pkg = NodeModel(id="pkg-01", label=NodeLabel.PACKAGE, name="libauth-core")
    service.add_node(node_pkg)

    valid_rel = RelationshipModel(
        id="rel-01",
        source_id="vuln-01",
        target_id="pkg-01",
        type=RelationshipType.AFFECTS,
        confidence=0.99
    )
    res_rel = service.add_relationship(valid_rel)
    assert res_rel.id == "rel-01"

def test_synthetic_seeder_and_graph_queries():
    stats = seed_synthetic_dataset()
    assert stats["nodes"] > 0
    assert stats["relationships"] > 0

    # Test entity lookup by ID on populated graph_service singleton
    cve = graph_service.get_entity("CVE-2026-9812")
    assert cve is not None
    assert cve["name"] == "CVE-2026-9812"

    # Test alias resolution
    postgres_db = graph_service.get_entity("Postgres")
    assert postgres_db is not None
    assert postgres_db["id"] == "db-customer-data"

    # Test neighborhood expansion
    nb = graph_service.get_neighborhood("svc-auth-service", depth=1)
    assert len(nb["nodes"]) > 1
    assert len(nb["relationships"]) > 0
