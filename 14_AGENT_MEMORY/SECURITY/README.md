# SECURITY — Agent Memory

## Purpose

This directory stores the persistent memory of the SECURITY agent.
The SECURITY agent performs threat modelling, security reviews, vulnerability assessments, and governs secure coding standards and compliance requirements across all missions.

## What this memory stores

| Category | Description |
|----------|-------------|
| Missions | Security review summaries per mission: threat model scope, findings severity distribution, mitigations applied, residual risks accepted and by whom. |
| Errors | Security failures: vulnerabilities that made it past review, insecure defaults introduced, misconfigurations deployed — with full post-mortem. |
| Lessons learned | Security insights: attack vectors that recur across missions, library vulnerabilities encountered, configuration mistakes that are easy to make in this stack. |
| Approved patterns | Security patterns approved for this project: authentication flow, secrets management approach, input validation convention, dependency pinning strategy, security headers configuration. |
| Previous decisions | Decisions on security tooling (SAST, DAST, dependency scanning), encryption choices, session management, and compliance scope (LGPD, OWASP Top 10). |

## How to add an entry

1. Copy the template from `../MEMORY_TEMPLATE.md`.
2. For vulnerabilities, include the CVE or CWE identifier in CONTENT if applicable.
3. Never include actual secrets, keys, or exploit payloads in memory entries.
4. Append the entry under the correct section heading below.
5. All PATTERN and DECISION entries require ORCHESTRATOR approval before `APPROVED: true`.

---

## Missions

*(Add security review mission summaries here.)*

---

## Errors

*(Add vulnerability and failure records here.)*

---

## Lessons Learned

*(Add security lessons here.)*

---

## Approved Patterns

*(Add approved security patterns here.)*

---

## Previous Decisions

*(Add security architecture decisions here.)*
