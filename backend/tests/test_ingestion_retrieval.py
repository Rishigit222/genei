from app.ingestion.parsers import document_parser
from app.ingestion.extractor import extractor
from app.ingestion.entity_resolver import entity_resolver
from app.retrieval.hybrid_search import hybrid_retriever
from app.graph.falkor_service import graph_service
from data.synthetic_seeder import seed_synthetic_dataset

def test_document_ingestion_and_extraction():
    seed_synthetic_dataset()

    sample_text = """
    # Incident Security Report
    Vulnerability CVE-2026-9812 affects libauth-core.
    Auth-Service depends on libauth-core version 1.4.
    Auth-Service is deployed on Prod-K8s-Node-01 and connects to Customer-DB.
    """

    parsed = document_parser.parse_markdown(sample_text, "incident_report.md")
    assert parsed["format"] == "md"
    assert len(parsed["sections"]) > 0

    res = extractor.process_document(parsed)
    assert res["document_id"].startswith("doc-")
    assert res["nodes_added"] > 0
    assert res["relationships_added"] > 0

def test_deterministic_entity_resolution():
    seed_synthetic_dataset()

    # Test alias resolution: 'Postgres' should resolve to canonical 'db-customer-data'
    canonical_id, name = entity_resolver.resolve("Postgres", "DATABASE")
    assert canonical_id == "db-customer-data"
    assert name == "Customer-DB"

    # Test 'Authentication Service' alias
    auth_id, auth_name = entity_resolver.resolve("Authentication Service", "SERVICE")
    assert auth_id == "svc-auth-service"
    assert auth_name == "Auth-Service"

def test_hybrid_graphrag_retrieval():
    seed_synthetic_dataset()

    query = "What systems could be affected by CVE-2026-9812?"
    res = hybrid_retriever.search(query, max_depth=4)

    assert len(res["candidates"]) > 0
    assert res["candidates"][0]["id"] == "CVE-2026-9812"
    assert len(res["nodes"]) > 0
    assert len(res["relationships"]) > 0
    assert len(res["paths"]) > 0
