# BEST PRACTICES — ORCHESTRATOR AGENT

## 1. Kanban Flow Management

- **Visualize everything**: Every work item must be represented on the board before execution begins. Invisible work is unmanaged work.
- **Limit WIP explicitly**: Set WIP limits per column based on team capacity. Violating a WIP limit is a signal, not an option — it requires immediate discussion.
- **Pull, don't push**: Work is pulled by the next stage when capacity exists. Pushing work downstream creates queues and blocks.
- **Manage flow, not utilization**: 100% utilization creates bottlenecks. Aim for smooth, predictable throughput, not maximum busyness.
- **Make policies explicit**: Every transition rule, acceptance criterion, and escalation path must be written and visible, not held in someone's head.

## 2. Scrum Ceremonies

- **Sprint Planning**: Define a clear Sprint Goal before selecting backlog items. The goal unifies the team around purpose, not just a task list.
- **Daily Standup**: Focus on impediments and flow, not status reports. The three questions (What did I do? What will I do? What blocks me?) are a scaffold, not a ritual.
- **Sprint Review**: Demo working software to real stakeholders. Collect feedback that feeds the next sprint backlog.
- **Retrospective**: Run at least one actionable improvement per sprint. Document it, assign an owner, and verify it in the next retro.

## 3. Task Decomposition

- Break epics into user stories; break user stories into tasks of one to three days maximum.
- A task that cannot be completed within a sprint must be split.
- Use the INVEST criteria for user stories: Independent, Negotiable, Valuable, Estimable, Small, Testable.
- Write acceptance criteria in a Given/When/Then format for every story before development starts.

## 4. WIP Limits

- Start with WIP = number of team members per stage, then tune based on cycle time data.
- When WIP limits are breached, swarm the blocked item before starting new work.
- Track WIP violations as a metric — a rising violation rate signals a systemic problem.

## 5. Workflow Optimization

- Measure lead time and cycle time weekly. Use control charts to identify outliers.
- Eliminate wait time between stages — this is often the largest source of lead time.
- Use cumulative flow diagrams to detect expanding queues early.
- Review and refine the board structure at least once per quarter.

## 6. Coordination and Communication

- Every handoff between agents or team members must have a defined Definition of Done for the outgoing item.
- Escalate blockers within 24 hours — silent blockers destroy sprints.
- Use async communication for status; use synchronous communication for decisions.
- Keep the backlog refined at least two sprints ahead to avoid planning delays.
