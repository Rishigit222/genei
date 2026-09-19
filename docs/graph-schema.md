# GRAPH SENTINEL — Graph Schema Specification

FalkorDB strictly enforces allowlisted node labels and relationship types to guarantee schema safety.

## Node Labels
- `Document`
- `Source`
- `Claim`
- `Entity`
- `Person`
- `Organization`
- `Package`
- `Vulnerability`
- `Service`
- `Application`
- `Server`
- `Database`
- `System`
- `Incident`
- `Repository`
- `Team`
- `Environment`

## Relationship Types
- `AFFECTS` (Vulnerability -> Package)
- `DEPENDS_ON` / `USES` (Service -> Package / Service -> Service)
- `USED_BY` (Package -> Service)
- `DEPLOYED_ON` (Service -> Server)
- `CONNECTS_TO` (Service -> Database / Server -> Database)
- `STORES` (Database -> Data)
- `MENTIONS` (Document -> Entity)
- `SUPPORTS` / `CONTRADICTS` (Claim -> Relationship)

## Metadata Properties
Each relationship maintains:
- `source_id`: String
- `confidence`: Float (0.0 to 1.0)
- `source_doc_id`: String
- `evidence_span`: String
- `status`: `ACTIVE` | `SUPERSEDED` | `DISPUTED`
- `created_at`: ISO Timestamp
- `updated_at`: ISO Timestamp
