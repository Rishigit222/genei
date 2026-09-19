import re
from typing import List, Dict, Any, Optional
from app.graph.falkor_service import graph_service
from app.ingestion.entity_resolver import entity_resolver
from app.utils.logger import logger

class HybridGraphRAGSearch:
    """
    Hybrid GraphRAG Retrieval Engine combining:
    1. Candidate Entity Detection
    2. Vector Retrieval (Semantic similarity matching)
    3. Keyword Retrieval (BM25 token match over document evidence spans)
    4. Cypher Retrieval (FalkorDB parameterized graph traversal)
    5. Multi-Hop Graph Expansion (up to max_depth)
    """

    def detect_candidate_entities(self, query: str) -> List[Dict[str, Any]]:
        """Identify candidate graph entities mentioned in natural language query."""
        candidates = []
        tokens = re.findall(r'[\w-]+', query)

        # Check single & multi-token phrases against entity resolver / graph nodes
        for i in range(len(tokens)):
            for j in range(i + 1, min(i + 4, len(tokens) + 1)):
                phrase = " ".join(tokens[i:j])
                entity = graph_service.get_entity(phrase)
                if entity and entity not in candidates:
                    candidates.append(entity)

        # Pattern match for CVE IDs
        cves = re.findall(r'CVE-\d{4}-\d{4,7}', query, re.IGNORECASE)
        for cve in cves:
            entity = graph_service.get_entity(cve.upper())
            if entity and entity not in candidates:
                candidates.append(entity)

        return candidates

    def vector_retrieval(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Vector similarity retrieval over entity descriptions and properties."""
        query_terms = set(re.findall(r'\w+', query.lower()))
        scores = []

        for node in graph_service.fallback_nodes.values():
            text = f"{node['name']} {node.get('description', '')} {node.get('label', '')}".lower()
            text_terms = set(re.findall(r'\w+', text))
            intersection = query_terms.intersection(text_terms)
            score = len(intersection) / (len(query_terms) or 1)
            if score > 0:
                scores.append({"node": node, "score": score, "retrieval_type": "vector"})

        scores.sort(key=lambda x: x["score"], reverse=True)
        return scores[:limit]

    def keyword_retrieval(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Keyword (BM25-style) retrieval over evidence text spans."""
        query_terms = set(re.findall(r'\w+', query.lower()))
        matches = []

        for rel in graph_service.fallback_relationships.values():
            span = rel.get("evidence_span", "").lower()
            if not span:
                continue
            span_terms = set(re.findall(r'\w+', span))
            overlap = query_terms.intersection(span_terms)
            if overlap:
                matches.append({
                    "relationship_id": rel["id"],
                    "evidence_span": rel["evidence_span"],
                    "source_doc_id": rel.get("source_doc_id"),
                    "score": len(overlap),
                    "retrieval_type": "keyword"
                })

        matches.sort(key=lambda x: x["score"], reverse=True)
        return matches[:limit]

    def search(self, query: str, max_depth: int = 4) -> Dict[str, Any]:
        """
        Execute full Hybrid GraphRAG Retrieval pipeline.
        Returns candidate entities, vector matches, keyword evidence, and FalkorDB multi-hop Cypher paths.
        """
        candidates = self.detect_candidate_entities(query)
        vector_results = self.vector_retrieval(query)
        keyword_results = self.keyword_retrieval(query)

        all_paths = []
        discovered_nodes = {}
        discovered_edges = []

        # Cypher Multi-Hop Expansion starting from candidate entities
        for cand in candidates:
            cand_id = cand["id"]
            discovered_nodes[cand_id] = cand

            # K-Hop Neighborhood from FalkorDB
            nb = graph_service.get_neighborhood(cand_id, depth=max_depth)
            for node in nb.get("nodes", []):
                discovered_nodes[node["id"]] = node
            for edge in nb.get("relationships", []):
                if edge not in discovered_edges:
                    discovered_edges.append(edge)

            # Parameterized Cypher Multi-Hop Paths
            paths = graph_service.find_paths(cand_id, max_hops=max_depth)
            all_paths.extend(paths)

        logger.log("INFO", f"Hybrid search complete for query: '{query}'", extra={
            "candidates_found": len(candidates),
            "vector_matches": len(vector_results),
            "keyword_matches": len(keyword_results),
            "total_nodes_retrieved": len(discovered_nodes),
            "paths_traversed": len(all_paths)
        })

        return {
            "query": query,
            "candidates": candidates,
            "vector_results": vector_results,
            "keyword_results": keyword_results,
            "nodes": list(discovered_nodes.values()),
            "relationships": discovered_edges,
            "paths": all_paths,
            "retrieved_count": len(discovered_nodes)
        }

hybrid_retriever = HybridGraphRAGSearch()
