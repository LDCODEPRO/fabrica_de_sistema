# METHODS INDEX — Fábrica de Sistemas Source of Truth

> Consolidated unique list of all real methods, methodologies, and structured techniques cited across the 7 agent knowledge libraries.
> Generated: 2026-06-05
> Agents covered: ARCHITECT, DEVELOPER, QA, DOCS, ORCHESTRATOR, ANALYST, DESIGNER

---

| ID | Method / Methodology | Origin / Author | Category | Description | Agent(s) |
|----|---------------------|-----------------|----------|-------------|---------|
| M-001 | Agile Software Development | Agile Manifesto Signatories (2001) | Software Process | Values and principles for iterative, collaborative, adaptive software development | ORCHESTRATOR, DEVELOPER |
| M-002 | Scrum | Ken Schwaber, Jeff Sutherland (1995) | Agile Framework | Iterative framework: Sprints, Product Owner, Scrum Master, Developer team; Planning, Daily, Review, Retrospective events | ORCHESTRATOR |
| M-003 | Kanban Method | David J. Anderson (2010) | Lean / Flow | Pull-based evolutionary change for knowledge work: visualize, limit WIP, manage flow, explicit policies, feedback loops | ORCHESTRATOR |
| M-004 | Extreme Programming (XP) | Kent Beck (1999) | Agile Methodology | 12 practices: TDD, continuous integration, pair programming, refactoring, simple design, small releases, collective ownership, on-site customer | DEVELOPER |
| M-005 | Scrumban | Corey Ladas (2008) | Hybrid Agile | Combines Scrum sprint cadence with Kanban WIP limits and flow metrics for hybrid teams | ORCHESTRATOR |
| M-006 | Lean Software Development | Mary & Tom Poppendieck (2003) | Lean | Seven lean principles applied to software: eliminate waste, amplify learning, decide late, deliver fast, empower team, build integrity in, see the whole | ORCHESTRATOR |
| M-007 | Test-Driven Development (TDD) | Kent Beck (2002) | Development Practice | Write failing test → write minimal code to pass → refactor; enforces testable design and living regression suite | DEVELOPER, QA |
| M-008 | Behavior-Driven Development (BDD) | Dan North (2006) | Development / Testing | Feature specification using Given/When/Then; bridges business and technical; executable with Cucumber/SpecFlow/Behave | QA, ANALYST |
| M-009 | Acceptance Test-Driven Development (ATDD) | Gojko Adzic (popularized, 2011) | Development / Testing | Acceptance criteria written as automated tests before development; development complete when all tests pass | QA, ANALYST |
| M-010 | Rapid Software Testing (RST) | James Bach, Michael Bolton (2000) | Testing Methodology | Skills-based testing approach emphasizing critical thinking; distinguishes checking (automated verification) from testing (human investigation) | QA |
| M-011 | Session-Based Test Management (SBTM) | James Bach (1996) | Testing | Structured exploratory testing with time-boxed sessions, charters, and debriefs; tracks coverage and defect density | QA |
| M-012 | Exploratory Testing | Cem Kaner (1984, named), James Bach, Elisabeth Hendrickson | Testing | Simultaneous learning, test design, and execution; uses heuristics, charters, and tours | QA |
| M-013 | Risk-Based Testing | ISTQB (2011) | Testing | Prioritize test effort by probability × impact; allocate depth proportional to risk level | QA |
| M-014 | Domain-Driven Design (DDD) | Eric Evans (2003) | Architecture / Design | Align software models with business domains through Ubiquitous Language, Bounded Contexts, and tactical patterns | ARCHITECT, ANALYST |
| M-015 | Event Storming | Alberto Brandolini (2013) | Domain Discovery | Collaborative workshop: domain events (orange) → commands (blue) → aggregates (yellow) → policies (purple) → read models (green) | ANALYST |
| M-016 | Domain Storytelling | Stefan Hofer, Henning Schwentner (2018) | Domain Discovery | Pictographic workshop technique; actors, work objects, and activities; produces annotated domain stories | ANALYST |
| M-017 | Specification by Example | Gojko Adzic (2011) | Requirements / Testing | Use concrete examples to specify, develop, and verify behavior; produces living documentation (automated tests = specs) | ANALYST, QA |
| M-018 | Use Case Method | Alistair Cockburn (2000) | Requirements | Goal-oriented actor-system interaction capture; goal levels (Cloud/Sea/Fish); Fully-Dressed and Casual formats | ANALYST |
| M-019 | Requirements Workshops (JAD) | IBM (1970s), Ellen Gottesdiener (2002) | Requirements Elicitation | Facilitated group sessions for collaborative requirements definition; JAD = Joint Application Design | ANALYST |
| M-020 | Five Whys | Taiichi Ohno (Toyota) | Root Cause Analysis | Iterative interrogation technique: ask "why?" up to 5 times to reach the root cause of a problem | ANALYST |
| M-021 | User Story Mapping | Jeff Patton (2005) | Product Discovery | Two-dimensional backlog: user activities (columns) × priority slices (rows); reveals gaps and release scope | ANALYST |
| M-022 | Impact Mapping | Gojko Adzic (2012) | Product Strategy | Mind-map technique: Goal → Actors → Impacts → Deliverables; ensures software decisions map to business goals | ANALYST |
| M-023 | Diataxis Documentation Method | Daniele Procida (2017) | Documentation | Separate documentation into four types based on user need: Tutorial, How-to Guide, Reference, Explanation | DOCS |
| M-024 | Docs-as-Code | Anne Gentle (2017) | Documentation | Apply Git, pull requests, CI/CD, and issue tracking to documentation workflows; docs treated as first-class artifacts | DOCS |
| M-025 | Minimalism (Carroll) | John Carroll (1990) | Documentation | Support action, trust users, allow errors; minimum viable documentation; combat information overload | DOCS |
| M-026 | Human-Centered Design (HCD) | Don Norman, IDEO (1990s) | UX Design | Design process centered on users' needs, behaviors, and contexts; iterate: empathize, define, ideate, prototype, test | DESIGNER |
| M-027 | Goal-Directed Design | Alan Cooper (About Face, 2004) | UX Design | Design based on user goals, not tasks or features; uses personas and scenarios | DESIGNER |
| M-028 | Heuristic Evaluation | Jakob Nielsen (1994) | UX Evaluation | Expert inspection using 10 usability heuristics; evaluators assign severity ratings (0-4) | DESIGNER |
| M-029 | Usability Testing | Steve Krug, Nielsen Norman Group | UX Research | Observe real users attempting real tasks; think-aloud protocol; 5-user rule for finding major issues | DESIGNER |
| M-030 | User Journey Mapping | Various UX practitioners | UX Research | Visualize end-to-end user experience across touchpoints; identify pain points and opportunities | DESIGNER |
| M-031 | A/B Testing | Conversion Optimization community | UX Validation | Controlled experiment comparing two design variants; statistical significance determines winner | DESIGNER |
| M-032 | Persona Creation | Alan Cooper (The Inmates Are Running the Asylum, 1999) | UX Research | Archetypal user representations based on research; represent goals, behaviors, and contexts | DESIGNER |
| M-033 | Refactoring | Martin Fowler (1999) | Development Practice | Behavior-preserving transformations that improve internal code structure; defined catalog of 66+ named techniques | DEVELOPER |
| M-034 | Two-Phase Sprint Planning | Henrik Kniberg (Scrum and XP from the Trenches, 2007) | Agile Practice | Phase 1: What (select stories, define Sprint Goal); Phase 2: How (decompose stories into tasks) | ORCHESTRATOR |
| M-035 | Pair Programming | Kent Beck (XP, 1999) | Development Practice | Two programmers work together at one workstation; driver writes, navigator reviews in real time | DEVELOPER |
| M-036 | Code Review | Google Engineering Practices | Development Practice | Systematic examination of code by peers; catches bugs, improves design, shares knowledge | DEVELOPER |
| M-037 | Continuous Integration (CI) | Martin Fowler (2000) | DevOps Practice | Integrate code into shared repository frequently; automated build and tests run on every commit | DEVELOPER |
| M-038 | Planning Poker | Mike Cohn (2005) | Estimation | Consensus-based story point estimation using Fibonacci-sequenced cards; prevents anchoring | ORCHESTRATOR |
| M-039 | Cumulative Flow Diagram (CFD) Review | Kanban Method | Flow Metrics | Weekly CFD review to identify widening bands (queue buildup) and apply swarming to bottlenecks | ORCHESTRATOR |
| M-040 | Definition of Done (DoD) | Scrum Guide | Quality Gate | Team-level checklist applied to every story: code reviewed, tests passing, docs updated, PO accepted | ORCHESTRATOR |

---

*Total unique methods/methodologies: 40*
*Cross-reference: FRAMEWORKS_INDEX.md, STANDARDS_INDEX.md, MASTER_INDEX.md*
