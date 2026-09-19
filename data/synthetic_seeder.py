"""
Synthetic Cybersecurity Dataset Seeder for GRAPH SENTINEL
Creates realistic software dependency graphs, infrastructure links, and planted contradictions.
"""

from app.models.graph_models import NodeModel, RelationshipModel, NodeLabel, RelationshipType, RelationshipStatus
from app.graph.falkor_service import graph_service
from app.utils.logger import logger

def seed_synthetic_dataset():
    logger.log("INFO", "Seeding synthetic cybersecurity dependency dataset into FalkorDB...")

    # 1. Create Nodes
    nodes = [
        # Vulnerabilities
        NodeModel(
            id="CVE-2026-9812",
            label=NodeLabel.VULNERABILITY,
            name="CVE-2026-9812",
            description="Critical Remote Code Execution in libauth-core authentication parser",
            properties={"severity": "CRITICAL", "cvss": 9.8, "cve_year": 2026}
        ),
        # Packages
        NodeModel(
            id="pkg-libauth-core",
            label=NodeLabel.PACKAGE,
            name="libauth-core",
            description="Core authentication and token verification library",
            aliases=["libauth", "auth-core-pkg"]
        ),
        NodeModel(
            id="pkg-libauth-legacy",
            label=NodeLabel.PACKAGE,
            name="libauth-legacy",
            description="Legacy version of authentication library",
            aliases=["libauth-v0"]
        ),
        # Services
        NodeModel(
            id="svc-auth-service",
            label=NodeLabel.SERVICE,
            name="Auth-Service",
            description="Centralized OAuth2 and JWT token issuer service",
            aliases=["Authentication Service", "AuthMicroservice"]
        ),
        NodeModel(
            id="svc-payment-gateway",
            label=NodeLabel.SERVICE,
            name="Payment-Gateway",
            description="Processes credit card billing and checkout transactions",
            aliases=["Payment Service", "Billing API"]
        ),
        NodeModel(
            id="svc-user-directory",
            label=NodeLabel.SERVICE,
            name="User-Directory-Service",
            description="User profile metadata and active session manager",
            aliases=["User API"]
        ),
        # Servers
        NodeModel(
            id="srv-k8s-prod-01",
            label=NodeLabel.SERVER,
            name="Prod-K8s-Node-01",
            description="Production Kubernetes worker node in us-east-1a",
            properties={"ip": "10.0.12.45", "zone": "us-east-1a"}
        ),
        NodeModel(
            id="srv-k8s-prod-02",
            label=NodeLabel.SERVER,
            name="Prod-K8s-Node-02",
            description="Production Kubernetes worker node in us-east-1b",
            properties={"ip": "10.0.12.46", "zone": "us-east-1b"}
        ),
        # Databases
        NodeModel(
            id="db-customer-data",
            label=NodeLabel.DATABASE,
            name="Customer-DB",
            description="PostgreSQL cluster storing customer profiles and credentials",
            aliases=["Postgres", "PostgreSQL", "postgres database"],
            properties={"contains_pii": True}
        ),
        NodeModel(
            id="db-pci-vault",
            label=NodeLabel.DATABASE,
            name="PCI-Vault-DB",
            description="Encrypted PCI payment token vault database",
            properties={"contains_pci": True, "compliance": "PCI-DSS-v4"}
        ),
        # Documents
        NodeModel(
            id="doc-sec-advisory",
            label=NodeLabel.DOCUMENT,
            name="sec-advisory-2026-9812.md",
            description="Security Advisory for CVE-2026-9812"
        ),
        NodeModel(
            id="doc-arch-spec",
            label=NodeLabel.DOCUMENT,
            name="architecture-spec-2026.json",
            description="Enterprise Microservice Infrastructure Inventory"
        ),
        NodeModel(
            id="doc-patch-report",
            label=NodeLabel.DOCUMENT,
            name="patch-audit-report-q3.txt",
            description="Conflicting Patch Audit Report"
        )
    ]

    for node in nodes:
        graph_service.add_node(node)

    # 2. Create Relationships
    relationships = [
        # CVE affects package
        RelationshipModel(
            id="rel-01",
            source_id="CVE-2026-9812",
            target_id="pkg-libauth-core",
            type=RelationshipType.AFFECTS,
            confidence=0.99,
            source_doc_id="doc-sec-advisory",
            evidence_span="CVE-2026-9812 affects libauth-core versions prior to v2.2.0"
        ),
        # Service USES package (Document A claim - Active)
        RelationshipModel(
            id="rel-02-v14",
            source_id="svc-auth-service",
            target_id="pkg-libauth-core",
            type=RelationshipType.USES,
            confidence=0.95,
            source_doc_id="doc-arch-spec",
            evidence_span="Auth-Service depends on libauth-core v1.4.2 in deployment manifest",
            status=RelationshipStatus.ACTIVE
        ),
        # Service USES package (Document B claim - Contradictory old entry)
        RelationshipModel(
            id="rel-02-v21",
            source_id="svc-auth-service",
            target_id="pkg-libauth-legacy",
            type=RelationshipType.USES,
            confidence=0.60,
            source_doc_id="doc-patch-report",
            evidence_span="Auth-Service legacy build utilizes libauth-legacy v0.9",
            status=RelationshipStatus.DISPUTED
        ),
        # Payment Gateway USED_BY Auth Service or DEPENDS_ON Auth-Service
        RelationshipModel(
            id="rel-03",
            source_id="svc-payment-gateway",
            target_id="svc-auth-service",
            type=RelationshipType.DEPENDS_ON,
            confidence=0.92,
            source_doc_id="doc-arch-spec",
            evidence_span="Payment-Gateway invokes Auth-Service REST endpoints for session verification"
        ),
        # Auth Service DEPLOYED_ON Prod-K8s-Node-01
        RelationshipModel(
            id="rel-04",
            source_id="svc-auth-service",
            target_id="srv-k8s-prod-01",
            type=RelationshipType.DEPLOYED_ON,
            confidence=0.98,
            source_doc_id="doc-arch-spec",
            evidence_span="Auth-Service pod assigned to worker node Prod-K8s-Node-01"
        ),
        # Payment Gateway DEPLOYED_ON Prod-K8s-Node-02
        RelationshipModel(
            id="rel-05",
            source_id="svc-payment-gateway",
            target_id="srv-k8s-prod-02",
            type=RelationshipType.DEPLOYED_ON,
            confidence=0.98,
            source_doc_id="doc-arch-spec",
            evidence_span="Payment-Gateway pod assigned to worker node Prod-K8s-Node-02"
        ),
        # Auth Service CONNECTS_TO Customer-DB
        RelationshipModel(
            id="rel-06",
            source_id="svc-auth-service",
            target_id="db-customer-data",
            type=RelationshipType.CONNECTS_TO,
            confidence=0.99,
            source_doc_id="doc-arch-spec",
            evidence_span="Auth-Service connects directly to PostgreSQL Customer-DB via connection pool"
        ),
        # Payment Gateway CONNECTS_TO PCI-Vault-DB
        RelationshipModel(
            id="rel-07",
            source_id="svc-payment-gateway",
            target_id="db-pci-vault",
            type=RelationshipType.CONNECTS_TO,
            confidence=0.99,
            source_doc_id="doc-arch-spec",
            evidence_span="Payment-Gateway connects to PCI-Vault-DB for billing tokenization"
        )
    ]

    for rel in relationships:
        graph_service.add_relationship(rel)

    logger.log("INFO", f"Synthetic dataset successfully seeded with {len(nodes)} nodes and {len(relationships)} relationships.")
    return {"nodes": len(nodes), "relationships": len(relationships)}

if __name__ == "__main__":
    seed_synthetic_dataset()
