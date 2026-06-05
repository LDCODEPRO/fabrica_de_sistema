# ANALYST — Agent Memory

## Purpose

This directory stores the persistent memory of the ANALYST agent.
The ANALYST gathers requirements, performs feasibility analysis, interprets data, produces reports, and translates business needs into technical specifications for other agents.

## What this memory stores

| Category | Description |
|----------|-------------|
| Missions | Analysis deliverables per mission: requirements gathered, assumptions validated, scope boundaries set, outstanding ambiguities handed off to stakeholders. |
| Errors | Analytical failures: wrong assumptions that derailed implementation, requirements that were misinterpreted, data sources that turned out to be unreliable. |
| Lessons learned | Analysis insights: questions that always need to be asked at mission start, data quality checks that prevented downstream errors, stakeholder interview techniques that produced actionable requirements. |
| Approved patterns | Reusable analysis patterns: requirements template, edge-case enumeration checklist, data validation workflow, acceptance criteria format. |
| Previous decisions | Decisions on scope boundaries, prioritisation frameworks, and which data sources are authoritative for specific domains. |

## How to add an entry

1. Copy the template from `../MEMORY_TEMPLATE.md`.
2. For requirement errors, include the original (wrong) interpretation and the corrected version in CONTENT.
3. Append the entry under the correct section heading below.
4. Patterns require ORCHESTRATOR review before `APPROVED: true`.

---

## Missions

*(Add analysis mission summaries here.)*

---

## Errors

*(Add analysis error records here.)*

---

## Lessons Learned

*(Add analysis lessons here.)*

---

## Approved Patterns

*(Add approved analysis patterns here.)*

---

## Previous Decisions

*(Add scope and prioritisation decisions here.)*
