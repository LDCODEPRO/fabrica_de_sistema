# QA — Agent Memory

## Purpose

This directory stores the persistent memory of the QA agent.
The QA agent designs test strategies, validates deliverables, tracks defects, and ensures quality gates are met before a mission closes.

## What this memory stores

| Category | Description |
|----------|-------------|
| Missions | QA summaries per mission: test coverage achieved, defects found, defects resolved, open risks at close. |
| Errors | Defects that escaped QA and reached production, or critical bugs that a previous test suite failed to catch — with root cause analysis of why they were missed. |
| Lessons learned | Testing insights: edge cases that keep appearing, test data strategies that work, integration test setups that reduced false positives. |
| Approved patterns | Validated test patterns: test pyramid ratios that worked, contract testing setup, mutation testing thresholds, fixture design conventions. |
| Previous decisions | Decisions on test tooling, coverage targets, regression strategy, and how to handle flaky tests. |

## How to add an entry

1. Copy the template from `../MEMORY_TEMPLATE.md`.
2. For escaped defects, use TYPE=ERROR and include the defect ID in CONTENT.
3. Append the entry under the correct section heading below.
4. Patterns must be reviewed by ARCHITECT before being marked `APPROVED: true`.

---

## Missions

*(Add QA mission summaries here.)*

---

## Errors

*(Add escaped defect records here.)*

---

## Lessons Learned

*(Add testing lessons here.)*

---

## Approved Patterns

*(Add approved test patterns here.)*

---

## Previous Decisions

*(Add test strategy decisions here.)*
