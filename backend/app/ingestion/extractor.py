import re
import uuid
from typing import Dict, Any, List
from app.models.graph_models import NodeModel, RelationshipModel, NodeLabel, RelationshipType, RelationshipStatus
from app.ingestion.entity_resolver import entity_resolver
from app.graph.falkor_service import graph_service
from app.utils.logger import logger

class SchemaEnforcedExtractor:
    """
    Schema-enforced Graph Ingestion Extractor.
    Extracts entities and relationships from document sections and inserts them into FalkorDB.
    """
    def process_document(self, parsed_doc: Dict[str, Any]) -> Dict[str, Any]:
        file_name = parsed_doc["file_name"]
        doc_id = f"doc-{uuid.uuid4().hex[:8]}"

        # 1. Register Document Node in FalkorDB
        doc_node = NodeModel(
            id=doc_id,
            label=NodeLabel.DOCUMENT,
            name=file_name,
            description=f"Ingested document format {parsed_doc['format']}",
            properties={"format": parsed_doc["format"]}
        )
        graph_service.add_node(doc_node)

        extracted_nodes: List[NodeModel] = []
        extracted_relationships: List[RelationshipModel] = []

        # 2. Extract Entities & Relationships from Document Sections
        content = parsed_doc["content"]
        sections = parsed_doc.get("sections", [{"title": "Main", "text": content}])

        for section in sections:
            sec_text = section["text"]
            sec_title = section["title"]

            # Pattern 1: Vulnerability CVE-XXXX-XXXX
            cve_matches = re.findall(r'CVE-\d{4}-\d{4,7}', sec_text, re.IGNORECASE)
            for cve in cve_matches:
                cve_id, cve_name = entity_resolver.resolve(cve.upper(), "VULNERABILITY")
                node = NodeModel(
                    id=cve_id,
                    label=NodeLabel.VULNERABILITY,
                    name=cve_name,
                    description=f"Vulnerability referenced in {file_name}"
                )
                graph_service.add_node(node)
                extracted_nodes.append(node)

                # Link document MENTIONS CVE
                rel = RelationshipModel(
                    id=f"rel-{uuid.uuid4().hex[:8]}",
                    source_id=doc_id,
                    target_id=cve_id,
                    type=RelationshipType.MENTIONS,
                    confidence=1.0,
                    source_doc_id=doc_id,
                    evidence_span=f"Section '{sec_title}': Mentions {cve}"
                )
                graph_service.add_relationship(rel)
                extracted_relationships.append(rel)

            # Pattern 2: Service depends on Package / Service
            dep_matches = re.findall(r'([\w-]+)\s+(?:depends on|uses|relies on)\s+([\w-]+)', sec_text, re.IGNORECASE)
            for src_name, tgt_name in dep_matches:
                src_id, src_disp = entity_resolver.resolve(src_name, "SERVICE")
                tgt_id, tgt_disp = entity_resolver.resolve(tgt_name, "PACKAGE")

                src_node = NodeModel(id=src_id, label=NodeLabel.SERVICE, name=src_disp)
                tgt_node = NodeModel(id=tgt_id, label=NodeLabel.PACKAGE, name=tgt_disp)
                graph_service.add_node(src_node)
                graph_service.add_node(tgt_node)
                extracted_nodes.extend([src_node, tgt_node])

                rel = RelationshipModel(
                    id=f"rel-{uuid.uuid4().hex[:8]}",
                    source_id=src_id,
                    target_id=tgt_id,
                    type=RelationshipType.USES,
                    confidence=0.92,
                    source_doc_id=doc_id,
                    evidence_span=f"Extracted from {file_name}: '{src_name} depends on {tgt_name}'"
                )
                graph_service.add_relationship(rel)
                extracted_relationships.append(rel)

            # Pattern 3: Service deployed on Server
            deploy_matches = re.findall(r'([\w-]+)\s+(?:deployed on|hosted on|assigned to)\s+([\w-]+)', sec_text, re.IGNORECASE)
            for src_name, tgt_name in deploy_matches:
                src_id, src_disp = entity_resolver.resolve(src_name, "SERVICE")
                tgt_id, tgt_disp = entity_resolver.resolve(tgt_name, "SERVER")

                src_node = NodeModel(id=src_id, label=NodeLabel.SERVICE, name=src_disp)
                tgt_node = NodeModel(id=tgt_id, label=NodeLabel.SERVER, name=tgt_disp)
                graph_service.add_node(src_node)
                graph_service.add_node(tgt_node)
                extracted_nodes.extend([src_node, tgt_node])

                rel = RelationshipModel(
                    id=f"rel-{uuid.uuid4().hex[:8]}",
                    source_id=src_id,
                    target_id=tgt_id,
                    type=RelationshipType.DEPLOYED_ON,
                    confidence=0.95,
                    source_doc_id=doc_id,
                    evidence_span=f"Extracted from {file_name}: '{src_name} deployed on {tgt_name}'"
                )
                graph_service.add_relationship(rel)
                extracted_relationships.append(rel)

            # Pattern 4: Service connects to Database
            conn_matches = re.findall(r'([\w-]+)\s+(?:connects to|queries)\s+([\w-]+)', sec_text, re.IGNORECASE)
            for src_name, tgt_name in conn_matches:
                src_id, src_disp = entity_resolver.resolve(src_name, "SERVICE")
                tgt_id, tgt_disp = entity_resolver.resolve(tgt_name, "DATABASE")

                src_node = NodeModel(id=src_id, label=NodeLabel.SERVICE, name=src_disp)
                tgt_node = NodeModel(id=tgt_id, label=NodeLabel.DATABASE, name=tgt_disp)
                graph_service.add_node(src_node)
                graph_service.add_node(tgt_node)
                extracted_nodes.extend([src_node, tgt_node])

                rel = RelationshipModel(
                    id=f"rel-{uuid.uuid4().hex[:8]}",
                    source_id=src_id,
                    target_id=tgt_id,
                    type=RelationshipType.CONNECTS_TO,
                    confidence=0.95,
                    source_doc_id=doc_id,
                    evidence_span=f"Extracted from {file_name}: '{src_name} connects to {tgt_name}'"
                )
                graph_service.add_relationship(rel)
                extracted_relationships.append(rel)

        logger.log("INFO", f"Ingested document '{file_name}' into FalkorDB.", extra={
            "doc_id": doc_id,
            "nodes_added": len(extracted_nodes),
            "relationships_added": len(extracted_relationships)
        })

        return {
            "document_id": doc_id,
            "file_name": file_name,
            "nodes_added": len(extracted_nodes),
            "relationships_added": len(extracted_relationships)
        }

extractor = SchemaEnforcedExtractor()
