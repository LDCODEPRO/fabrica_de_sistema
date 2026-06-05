# FRAMEWORKS INDEX — Fábrica de Sistemas Source of Truth

> Consolidated unique list of all real frameworks, methodologies, and design systems cited across the 7 agent knowledge libraries.
> Generated: 2026-06-05
> Agents covered: ARCHITECT, DEVELOPER, QA, DOCS, ORCHESTRATOR, ANALYST, DESIGNER

---

| ID | Framework / Methodology | Origin / Author | Year | Category | Description | Agent(s) |
|----|------------------------|-----------------|------|----------|-------------|---------|
| F-001 | Domain-Driven Design (DDD) | Eric Evans | 2003 | Architecture / Design | Strategic and tactical patterns for aligning software with complex business domains: Ubiquitous Language, Bounded Context, Aggregates, Domain Events, Context Map | ARCHITECT, ANALYST |
| F-002 | Clean Architecture | Robert C. Martin | 2017 | Architecture | Concentric-layer architecture enforcing the Dependency Rule; business rules independent of frameworks, UI, and databases | ARCHITECT, DEVELOPER |
| F-003 | Hexagonal Architecture (Ports and Adapters) | Alistair Cockburn | 2005 | Architecture | Application core exposes ports (interfaces); adapters implement ports for specific technologies; enables testability and multiple delivery mechanisms | ARCHITECT |
| F-004 | C4 Model | Simon Brown | 2014 | Architecture Visualization | Hierarchical diagrams at four abstraction levels: Context, Container, Component, Code | ARCHITECT |
| F-005 | 12-Factor App | Heroku / Adam Wiggins | 2012 | Cloud / DevOps | Twelve principles for building portable, scalable, maintainable cloud-native applications | ARCHITECT |
| F-006 | SOLID Principles | Robert C. Martin | 2002 | Object-Oriented Design | Five design principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion | DEVELOPER |
| F-007 | Test-Driven Development (TDD) | Kent Beck | 2002 | Development Practice | Red–Green–Refactor cycle; write failing test first, then minimal code to pass, then refactor | DEVELOPER, QA |
| F-008 | Behavior-Driven Development (BDD) | Dan North | 2006 | Development Practice | Specification of features using Given/When/Then (Gherkin) syntax; bridges business and technical stakeholders | QA, ANALYST |
| F-009 | Acceptance Test-Driven Development (ATDD) | Gojko Adzic (popularized) | 2011 | Development Practice | Acceptance criteria agreed and written as automated tests before development; dev complete when all pass | QA, ANALYST |
| F-010 | Extreme Programming (XP) | Kent Beck | 1999 | Software Process | 12 practices including TDD, continuous integration, pair programming, refactoring, simple design, collective ownership | DEVELOPER |
| F-011 | Scrum | Ken Schwaber, Jeff Sutherland | 1995 | Agile Framework | Iterative framework with Sprints (1-4 weeks), Product Owner, Scrum Master, Developers; defined events: Planning, Daily Scrum, Review, Retrospective | ORCHESTRATOR |
| F-012 | Kanban Method | David J. Anderson | 2010 | Lean / Flow | Pull-based workflow management: visualize, limit WIP, manage flow, make policies explicit, feedback loops, evolve experimentally | ORCHESTRATOR |
| F-013 | Scrumban | Corey Ladas | 2008 | Hybrid Agile | Hybrid of Scrum cadence and Kanban flow metrics and WIP limits | ORCHESTRATOR |
| F-014 | Lean Software Development | Mary & Tom Poppendieck | 2003 | Lean | Seven lean principles applied to software: eliminate waste, amplify learning, decide late, deliver fast, empower team, build integrity in, see the whole | ORCHESTRATOR |
| F-015 | Diataxis Framework | Daniele Procida | 2017 | Documentation | Four documentation types based on user need and time of use: Tutorials, How-to Guides, Reference, Explanation | DOCS |
| F-016 | Docs-as-Code | Anne Gentle | 2017 | Documentation | Apply software development tools (Git, CI/CD, PR reviews, issue tracking) to documentation workflows | DOCS |
| F-017 | Minimalism (Carroll) | John Carroll | 1990 | Documentation | Documentation should support action, not anticipate every error; users scan, not read; minimum viable instruction | DOCS |
| F-018 | BABOK v3 | IIBA | 2015 | Business Analysis | Six knowledge areas for business analysis: Planning, Elicitation, Requirements Lifecycle, Strategy Analysis, Analysis & Design Definition, Solution Evaluation | ANALYST |
| F-019 | Use Case Method (Cockburn) | Alistair Cockburn | 2000 | Requirements | Goal-oriented technique with goal levels (Cloud/Sea/Fish); Fully-Dressed and Casual use case formats | ANALYST |
| F-020 | Event Storming | Alberto Brandolini | 2013 | Domain Discovery | Collaborative workshop format using domain events, commands, aggregates, policies, and read models on an unlimited canvas | ANALYST |
| F-021 | Domain Storytelling | Stefan Hofer, Henning Schwentner | 2018 | Domain Discovery | Pictographic, story-based workshop technique for understanding domains; uses actors, work objects, and activities | ANALYST |
| F-022 | Specification by Example | Gojko Adzic | 2011 | Requirements / Testing | Use concrete examples as both requirements and automated tests; yields living documentation | ANALYST, QA |
| F-023 | Atomic Design | Brad Frost | 2013 | Design Systems | Five-level hierarchy: Atoms → Molecules → Organisms → Templates → Pages; foundation for component-based design systems | DESIGNER |
| F-024 | Nielsen's 10 Usability Heuristics | Jakob Nielsen | 1994 | UX Evaluation | Ten heuristics for expert evaluation of UI: visibility of status, match with real world, user control, consistency, error prevention, recognition over recall, flexibility, minimalism, error recovery, help & docs | DESIGNER |
| F-025 | WCAG 2.1 | W3C Web Accessibility Initiative | 2018 | Accessibility | Web Content Accessibility Guidelines based on POUR principles (Perceivable, Operable, Understandable, Robust); levels A, AA, AAA | DESIGNER |
| F-026 | Mobile-First Design | Luke Wroblewski | 2011 | Responsive Design | Design for smallest constraints first (mobile); expand progressively to larger viewports | DESIGNER |
| F-027 | Material Design 3 (Material You) | Google | 2021 | Design System | Open-source design system with components, motion, theming, and accessibility; implements dynamic color | DESIGNER |
| F-028 | Human Interface Guidelines (HIG) | Apple | 1984 (ongoing) | Design System | Design principles and components for macOS, iOS, iPadOS, watchOS, tvOS; platform idioms and interaction patterns | DESIGNER |
| F-029 | Session-Based Test Management (SBTM) | James Bach | 1996 | Testing | Structured exploratory testing using time-boxed sessions with charters; debrief after each session | QA |
| F-030 | Risk-Based Testing | ISTQB | 2011 | Testing | Prioritize testing effort by probability × impact of failure; allocate test depth proportionally to risk | QA |
| F-031 | Test Pyramid | Martin Fowler | 2009 | Testing Architecture | Three-layer model: many unit tests at base, fewer integration tests in middle, few E2E tests at top | QA, DEVELOPER |
| F-032 | GoF Design Patterns | Gamma, Helm, Johnson, Vlissides | 1994 | OOP Design Patterns | 23 patterns in three categories: Creational (5), Structural (7), Behavioral (11) | DEVELOPER |
| F-033 | Rapid Software Testing (RST) | James Bach, Michael Bolton | 2000 | Testing Methodology | Skills-based approach emphasizing critical thinking; distinguishes checking (automated) from testing (human) | QA |

---

*Total unique frameworks/methodologies: 33*
*Cross-reference: METHODS_INDEX.md, STANDARDS_INDEX.md, MASTER_INDEX.md*
