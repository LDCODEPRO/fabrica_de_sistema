# APPLIED PATTERNS — ORCHESTRATOR AGENT

## Pattern 1: Two-Phase Sprint Planning

**Context**: Teams that struggle to balance high-level goal-setting with detailed task breakdown in a single planning session.

**Pattern**:
- **Phase 1 (What)**: Product Owner presents top-priority stories. Team confirms the Sprint Goal and selects stories that serve it.
- **Phase 2 (How)**: Developers decompose selected stories into tasks. Tasks are sized to one day or less.

**Source**: Henrik Kniberg, *Scrum and XP from the Trenches*

---

## Pattern 2: WIP Limit with Expedite Lane

**Context**: Teams with a mix of standard work and urgent, unplanned requests.

**Pattern**:
- Maintain a separate swimlane for expedite items with a WIP limit of 1.
- An expedite item automatically preempts standard WIP rules.
- Track expedite frequency — if it exceeds 10-15% of throughput, reclassify the work type.

**Source**: David J. Anderson, *Kanban: Successful Evolutionary Change* — Classes of Service

---

## Pattern 3: Dependency Mapping Before Sprint Commitment

**Context**: Teams that regularly miss sprint goals due to external dependencies discovered mid-sprint.

**Pattern**:
- During Sprint Planning Phase 1, map external dependencies for each candidate story.
- Any story with an unresolved dependency is moved to the dependency parking lot — it is not committed until the dependency is resolved.
- Assign an owner for each dependency and a resolution deadline.

---

## Pattern 4: Definition of Done Checklist

**Context**: Inconsistent quality and "done but not really done" work entering review stages.

**Pattern**:
- Maintain a team-level DoD as a shared checklist applied to every story.
- Include: code reviewed, tests written and passing, documentation updated, acceptance criteria verified, deployed to staging, Product Owner accepted.
- Review and evolve the DoD every retrospective.

**Source**: Scrum Guide 2020; Mike Cohn, *Agile Estimating and Planning*

---

## Pattern 5: Cumulative Flow Diagram Weekly Review

**Context**: Teams that detect bottlenecks too late (after they have caused sprint failure).

**Pattern**:
- Pull a cumulative flow diagram every Monday morning.
- Identify any band that is widening — this indicates accumulating queue at that stage.
- Apply swarming: temporarily move capacity from upstream to the bottleneck stage.

**Source**: David J. Anderson, *Kanban: Successful Evolutionary Change*

---

## Pattern 6: Backlog Health Score

**Context**: Backlogs that grow uncontrolled and lose prioritization signal.

**Pattern**:
- Define backlog health as: % of top-20 items with complete acceptance criteria + % of items estimated + staleness score (items not touched in 60+ days flagged for removal or deferral).
- Review health score in each Sprint Review.
- Set a minimum threshold (e.g., 80% health) before Sprint Planning can proceed.

---

## Pattern 7: Retrospective Action Tracking

**Context**: Retrospectives that produce good ideas but no lasting change.

**Pattern**:
- Every retrospective action item is written as a Jira/Linear ticket.
- It is assigned to a person with a due date.
- The first agenda item of the next retrospective is reviewing the prior actions — not generating new ones.

**Source**: Jeff Sutherland, *Scrum: The Art of Doing Twice the Work*

---

## Pattern 8: Task Decomposition by Deliverable

**Context**: Large tasks that sit "In Progress" for multiple days with no visible progress.

**Pattern**:
- Decompose not by activity (e.g., "write code") but by deliverable (e.g., "API endpoint returning user list with pagination").
- Each sub-task must have a testable output.
- Maximum granularity: one sub-task per day of estimated effort.

**Source**: Mike Cohn, *User Stories Applied*
