"""
Cypher Query Registry for FalkorDB in GRAPH SENTINEL.
All queries are parameterized to eliminate Cypher injection.
"""

# 1. Entity Lookup by ID or Name (case-insensitive)
MATCH_ENTITY = """
MATCH (n)
WHERE n.id = $id OR toLower(n.name) = toLower($name)
RETURN n
"""

# 2. Direct Neighbors Expansion
MATCH_DIRECT_NEIGHBORS = """
MATCH (n)-[r]->(m)
WHERE (n.id = $id OR toLower(n.name) = toLower($name)) AND r.status <> 'SUPERSEDED'
RETURN n, r, m
UNION
MATCH (n)<-[r]-(m)
WHERE (n.id = $id OR toLower(n.name) = toLower($name)) AND r.status <> 'SUPERSEDED'
RETURN m, r, n
"""

# 3. Multi-Hop Path Expansion (Configurable depth, default up to 4 hops)
MATCH_MULTI_HOP_PATHS = """
MATCH path = (start)-[r*1..4]->(target)
WHERE start.id = $start_id AND ALL(rel IN r WHERE rel.status <> 'SUPERSEDED')
RETURN path
LIMIT $limit
"""

# 4. Impact Tracing (Vulnerability -> Package -> Service -> Server -> Database -> System)
TRACE_VULNERABILITY_IMPACT = """
MATCH path = (v:Vulnerability)-[r1:AFFECTS]->(p:Package)-[r2:USED_BY|USES]->(s:Service)-[r3:DEPLOYED_ON]->(srv:Server)-[r4:CONNECTS_TO]->(db:Database)
WHERE (v.id = $vuln_id OR toLower(v.name) = toLower($vuln_id))
  AND r1.status <> 'SUPERSEDED' AND r2.status <> 'SUPERSEDED' AND r3.status <> 'SUPERSEDED' AND r4.status <> 'SUPERSEDED'
RETURN path
LIMIT $limit
"""

# 5. Shortest Path Lookup
MATCH_SHORTEST_PATH = """
MATCH path = shortestPath((start)-[*1..6]->(end))
WHERE start.id = $start_id AND end.id = $end_id
RETURN path
"""

# 6. Detect Contradictory Relationships (e.g. Service USES multiple versions of same package)
DETECT_CONTRADICTORY_RELATIONSHIPS = """
MATCH (a)-[r1]->(b1), (a)-[r2]->(b2)
WHERE a.id = $entity_id
  AND type(r1) = type(r2)
  AND b1.id <> b2.id
  AND r1.status <> 'SUPERSEDED' AND r2.status <> 'SUPERSEDED'
RETURN a, r1, b1, r2, b2
"""

# 7. Add Node
CREATE_NODE = """
MERGE (n:%s {id: $id})
SET n.name = $name,
    n.description = $description,
    n.created_at = $created_at
RETURN n
"""

# 8. Create or Update Relationship
CREATE_RELATIONSHIP = """
MATCH (a {id: $source_id})
MATCH (b {id: $target_id})
MERGE (a)-[r:%s {id: $rel_id}]->(b)
SET r.confidence = $confidence,
    r.source_doc_id = $source_doc_id,
    r.evidence_span = $evidence_span,
    r.status = $status,
    r.created_at = $created_at,
    r.updated_at = $updated_at
RETURN r
"""

# 9. Mark Relationship Superseded (Soft Delete)
SUPERSEDE_RELATIONSHIP = """
MATCH (a)-[r]->(b)
WHERE r.id = $rel_id OR (a.id = $source_id AND b.id = $target_id AND type(r) = $rel_type)
SET r.status = 'SUPERSEDED',
    r.updated_at = $updated_at
RETURN r
"""

# 10. Fetch Full Graph (for visualization & exploration)
FETCH_ALL_GRAPH = """
MATCH (n)-[r]->(m)
WHERE r.status <> 'SUPERSEDED'
RETURN n, r, m
LIMIT $limit
"""
