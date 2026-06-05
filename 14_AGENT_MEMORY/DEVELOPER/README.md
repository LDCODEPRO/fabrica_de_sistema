# DEVELOPER — Agent Memory

## Purpose

This directory stores the persistent memory of the DEVELOPER agent.
The DEVELOPER implements features, fixes bugs, writes tests, and maintains code quality across all missions.

## What this memory stores

| Category | Description |
|----------|-------------|
| Missions | Implementation summaries: what was built, which modules were affected, major refactors, dependency changes. |
| Errors | Bugs introduced and fixed — root cause, the code path involved, and the fix applied. Regressions are especially valuable to record. |
| Lessons learned | Practices that improved or hurt code quality: a pattern that caused memory leaks, a library that introduced breaking changes, a test strategy that caught real bugs. |
| Approved patterns | Code patterns approved for this codebase: error handling conventions, logging standards, naming conventions, preferred libraries per domain. |
| Previous decisions | Decisions on implementation approach: choice of ORM, async vs sync, monorepo structure, module boundaries. |

## How to add an entry

1. Copy the template from `../MEMORY_TEMPLATE.md`.
2. Fill every field. Use TYPE=ERROR for bugs, TYPE=LESSON for process insights, TYPE=PATTERN for reusable code solutions.
3. Append the entry under the correct section heading below.
4. Set `APPROVED: true` only after the fix or pattern has been verified by QA or ARCHITECT.

---

## Missions

*(Add mission summaries here.)*

---

## Errors

*(Add bug/error records here.)*

---

## Lessons Learned

*(Add lessons here.)*

---

## Approved Patterns

*(Add approved code patterns here.)*

---

## Previous Decisions

*(Add significant implementation decisions here.)*
