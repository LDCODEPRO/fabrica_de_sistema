# FRAMEWORKS AND METHODS — ORCHESTRATOR AGENT

## 1. Kanban Method (David J. Anderson)

**Overview**: A pull-based workflow management system adapted from lean manufacturing for knowledge work.

**Six Core Practices**:
1. Visualize the workflow
2. Limit Work in Progress (WIP)
3. Manage flow
4. Make process policies explicit
5. Implement feedback loops
6. Improve collaboratively, evolve experimentally

**Key Metrics**:
- **Lead Time**: Time from request to delivery
- **Cycle Time**: Time from start of work to completion
- **Throughput**: Number of items completed per time unit
- **Work Item Age**: How long active items have been in progress

**Board Design Principles**:
- Columns represent workflow states, not team members
- Each column can have sub-columns (In Progress / Done) to visualize handoffs
- Swimlanes can represent classes of service (expedite, fixed date, standard, intangible)

---

## 2. Scrum Framework (Schwaber & Sutherland)

**Overview**: An iterative, incremental framework for developing and delivering complex products within time-boxed sprints (1-4 weeks).

**Roles**:
- **Product Owner**: Manages and prioritizes the Product Backlog; owns the "what"
- **Scrum Master**: Removes impediments; coaches the team on Scrum practices; owns the "how of process"
- **Developers**: Self-organizing team that delivers the increment; owns the "how of building"

**Events**:
- **Sprint Planning**: Select and commit to Sprint Backlog items based on velocity and Sprint Goal
- **Daily Scrum**: 15-minute synchronization focused on the Sprint Goal
- **Sprint Review**: Demonstrate the increment; gather stakeholder feedback
- **Sprint Retrospective**: Inspect and adapt team process

**Artifacts**:
- Product Backlog (prioritized by value)
- Sprint Backlog (committed work for the sprint)
- Increment (potentially shippable product)

---

## 3. Scrumban

**Overview**: A hybrid approach combining Scrum's cadence and ceremonies with Kanban's flow metrics and WIP limits.

**When to Use**: Teams transitioning from Scrum to Kanban, or teams needing both sprint-based planning and continuous delivery.

**Core Characteristics**:
- Keeps Sprint cadence for planning and review
- Adds WIP limits to Scrum board columns
- Uses Kanban metrics (cycle time, throughput) alongside velocity
- Backlog replenishment triggered by WIP capacity, not fixed sprint start

---

## 4. Lean Software Development (Poppendieck)

**Seven Lean Principles for Software**:
1. Eliminate waste
2. Amplify learning
3. Decide as late as possible
4. Deliver as fast as possible
5. Empower the team
6. Build integrity in
7. See the whole

**Waste Types in Software** (adapted from TPS):
- Partially done work (inventory)
- Extra processes
- Extra features (overproduction)
- Task switching (motion)
- Waiting
- Defects
- Underutilized talent

---

## 5. SAFe — Scaled Agile Framework (Overview)

**Overview**: A framework for applying Agile and Lean at enterprise scale.

**Relevant Concepts for Orchestration**:
- **PI Planning** (Program Increment Planning): Quarterly cross-team planning session
- **Epics → Features → Stories hierarchy**: Multi-level backlog decomposition
- **ART (Agile Release Train)**: Cross-functional team of teams aligned to a program backlog
- **WSJF (Weighted Shortest Job First)**: Prioritization model based on cost of delay and job duration

---

## 6. Theory of Constraints (Goldratt)

**Overview**: A management philosophy focused on identifying and eliminating the single bottleneck (constraint) that limits system throughput.

**Five Focusing Steps**:
1. Identify the constraint
2. Exploit the constraint (maximize its output)
3. Subordinate everything else to the constraint
4. Elevate the constraint
5. Repeat — find the new constraint

**Application in Orchestration**: Use cumulative flow diagrams to identify where work accumulates (the constraint), then focus WIP reduction and swarming on that stage.
