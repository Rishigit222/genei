# SECURITY ADVISORY: CVE-2026-9812

**Vulnerability ID**: CVE-2026-9812  
**Published Date**: 2026-02-14  
**Severity**: CRITICAL (CVSS 9.8)  

## Summary
A remote code execution vulnerability exists in `libauth-core` versions <= 2.1.0 due to un-sanitized deserialization in the OAuth token parser.

## Affected Components
- `libauth-core` (Package) is affected by `CVE-2026-9812`.
- `Auth-Service` (Service) depends on `libauth-core` version 1.4.2.
- `Payment-Gateway` (Service) relies on `Auth-Service` for token validation.
- `Auth-Service` is deployed on server `Prod-K8s-Node-01` and connects to database `Customer-DB`.

## Remediation
Upgrade `libauth-core` to version `2.2.0` immediately.
