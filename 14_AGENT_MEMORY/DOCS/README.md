# DOCS — Agent Memory

## Purpose

This directory stores the persistent memory of the DOCS agent.
The DOCS agent writes, maintains, and governs all project documentation: technical references, API docs, architecture decision records (ADRs), onboarding guides, and changelogs.

## What this memory stores

| Category | Description |
|----------|-------------|
| Missions | Documentation deliverables per mission: which docs were created or updated, their location, and coverage gaps identified. |
| Errors | Documentation failures: outdated API references that caused developer errors, missing onboarding steps that blocked new agents, incorrect architecture diagrams. |
| Lessons learned | Writing insights: doc structures that reduced onboarding time, diagram types that clarified complex flows, doc formats that developers actually read. |
| Approved patterns | Approved documentation patterns: ADR format, changelog conventions, README structure, diagram tooling choices (Mermaid, PlantUML, etc.). |
| Previous decisions | Decisions on documentation tooling (MkDocs vs Sphinx), versioning strategy, where to store docs (repo vs wiki), and review cadence. |

## How to add an entry

1. Copy the template from `../MEMORY_TEMPLATE.md`.
2. Include the file path of the affected document in CONTENT.
3. Append the entry under the correct section heading below.
4. Approved patterns require ORCHESTRATOR sign-off before `APPROVED: true`.

---

## Missions

*(Add documentation mission summaries here.)*

---

## Errors

*(Add documentation error records here.)*

---

## Lessons Learned

*(Add documentation lessons here.)*

---

## Approved Patterns

*(Add approved documentation patterns here.)*

---

## Previous Decisions

*(Add tooling and strategy decisions here.)*
