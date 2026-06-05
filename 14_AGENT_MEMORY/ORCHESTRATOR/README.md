# ORCHESTRATOR — Agent Memory

## Purpose

This directory stores the persistent memory of the ORCHESTRATOR agent.
The ORCHESTRATOR coordinates all other agents, decomposes missions into tasks, resolves inter-agent conflicts, approves patterns and decisions, and owns the overall mission success criteria.

## What this memory stores

| Category | Description |
|----------|-------------|
| Missions | Full mission retrospectives: original goal, agents involved, timeline, blockers encountered, final outcome, and lessons for future orchestration. |
| Errors | Coordination failures: tasks assigned to the wrong agent, dependency cycles between tasks, miscommunicated requirements, missed quality gates. |
| Lessons learned | Orchestration insights: task decomposition strategies that worked, communication patterns that reduced rework, agent pairing approaches for complex problems. |
| Approved patterns | Coordination patterns that proved reliable: mission kick-off checklist, agent handoff protocol, escalation path when an agent is blocked, approval workflow. |
| Previous decisions | Cross-cutting decisions that affect multiple agents: toolchain standards, branching strategy, release process, quality gate thresholds. |

## How to add an entry

1. Copy the template from `../MEMORY_TEMPLATE.md`.
2. For mission retrospectives, use TYPE=MISSION and include a brief agent-by-agent summary in CONTENT.
3. The ORCHESTRATOR is the self-approving authority for entries of TYPE=MISSION and TYPE=ERROR.
4. For TYPE=PATTERN and TYPE=DECISION, at least one other senior agent must concur before `APPROVED: true`.

---

## Missions

*(Add mission retrospectives here.)*

---

## Errors

*(Add coordination failure records here.)*

---

## Lessons Learned

*(Add orchestration lessons here.)*

---

## Approved Patterns

*(Add approved coordination patterns here.)*

---

## Previous Decisions

*(Add cross-cutting decisions here.)*
