# ARCHITECT — Agent Memory

## Purpose

This directory stores the persistent memory of the ARCHITECT agent.
The ARCHITECT is responsible for system design, technology selection, integration patterns, and architectural governance across all missions.

## What this memory stores

| Category | Description |
|----------|-------------|
| Missions | High-level summaries of architecture work completed per mission: scope, chosen patterns, rejected alternatives, and rationale. |
| Errors | Architectural mistakes — wrong technology choices, over-engineering, premature optimisation, coupling violations — and how they were corrected. |
| Lessons learned | Insights that changed how architecture decisions are made: scalability limits discovered in production, bottlenecks introduced by a pattern, etc. |
| Approved patterns | Reusable architectural patterns vetted for this project: hexagonal architecture, CQRS, event sourcing, API gateway patterns, etc. |
| Previous decisions | Significant technology and design decisions with full rationale so future agents do not re-litigate them without new evidence. |

## How to add an entry

1. Copy the template from `../MEMORY_TEMPLATE.md`.
2. Fill every field. Set `APPROVED: false` until reviewed.
3. Append the entry under the correct section heading below.
4. Ask ORCHESTRATOR to review and approve if TYPE is PATTERN or DECISION.

---

## Missions

*(Add mission summaries here.)*

---

## Errors

*(Add error records here.)*

---

## Lessons Learned

*(Add lessons here.)*

---

## Approved Patterns

*(Add approved architectural patterns here.)*

---

## Previous Decisions

*(Add significant past decisions here.)*
