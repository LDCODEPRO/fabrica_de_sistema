# ARCHITECT_AGENT — Best Practices

> Domain: Software Architecture & System Design
> Last updated: 2026-06-05

---

## 1. Architecture Decision Records (ADRs)

- Every significant architectural decision must be recorded as an ADR.
- Use the Nygard format (title, status, context, decision, consequences).
- Store ADRs in version control alongside the codebase (e.g., `docs/adr/`).
- ADRs are immutable once accepted; superseded ADRs reference their successors.
- Reference: Michael Nygard, *Documenting Architecture Decisions* (2011); ADR GitHub organization (adr.github.io).

## 2. Separation of Concerns at Architectural Level

- Enforce clear boundaries between layers: Presentation, Application, Domain, Infrastructure.
- Avoid business logic leaking into infrastructure or UI layers.
- Apply the Dependency Rule from Robert C. Martin's Clean Architecture: source code dependencies point only inward, never outward.
- Reference: Robert C. Martin, *Clean Architecture* (2017), Chapter 5.

## 3. Design for Failure

- Assume every network call, external service, and database query can fail.
- Implement circuit breakers (pattern from Michael Nygard's *Release It!*) to isolate failures.
- Use bulkheads to prevent cascading failures across subsystems.
- Apply timeouts and retries with exponential backoff on all remote calls.
- Reference: Michael Nygard, *Release It! Design and Deploy Production-Ready Software* (2018), Chapters 4–5.

## 4. Evolutionary Architecture

- Prefer architectures that can be incrementally changed over "big bang" redesigns.
- Use fitness functions (automated tests/metrics) to guard architectural characteristics.
- Allow modules to evolve independently by keeping interfaces stable.
- Reference: Neal Ford, Rebecca Parsons, Patrick Kua, *Building Evolutionary Architectures* (2017).

## 5. Domain-Driven Design Core Practices

- Model the domain language explicitly as a Ubiquitous Language shared between developers and domain experts.
- Identify Bounded Contexts and define Context Maps before designing microservices.
- Use Aggregates to enforce invariants; keep aggregates small and focused.
- Separate read and write models (CQRS) when query complexity diverges from write complexity.
- Reference: Eric Evans, *Domain-Driven Design* (2003); Vaughn Vernon, *Implementing Domain-Driven Design* (2013).

## 6. API Design Principles

- Design APIs around resources and capabilities, not internal implementation.
- Version APIs from the start (URL versioning or header versioning).
- Apply the Postel's Law (robustness principle): be conservative in what you send, liberal in what you accept.
- Document APIs with OpenAPI/Swagger; treat the spec as the contract.
- Reference: Martin Fowler, "Richardson Maturity Model" (martinfowler.com).

## 7. Data Architecture Best Practices

- Apply the principle of polyglot persistence: choose the data store that fits the access pattern, not the one familiar to the team.
- Separate operational data from analytical data (OLTP vs. OLAP).
- Design for eventual consistency in distributed systems; use sagas or outbox patterns for distributed transactions.
- Reference: Martin Kleppmann, *Designing Data-Intensive Applications* (2017), Chapters 5, 9.

## 8. Documentation and Communication

- Use the C4 Model (Context, Container, Component, Code) to communicate architecture at multiple levels.
- Maintain living architecture diagrams in PlantUML or draw.io, checked into version control.
- Hold Architecture Review sessions before committing to major structural changes.
- Reference: Simon Brown, *Software Architecture for Developers* (2014); C4 Model (c4model.com).

## 9. Non-Functional Requirements as First-Class Citizens

- Identify and quantify NFRs (latency, throughput, availability, security) before selecting architecture styles.
- Use Architecture Tradeoff Analysis Method (ATAM) for evaluating competing options.
- Document NFR decisions in ADRs.
- Reference: Len Bass, Paul Clements, Rick Kazman, *Software Architecture in Practice* (4th ed., 2022).

## 10. Security by Design

- Apply the principle of least privilege at every architectural boundary.
- Treat authentication and authorization as cross-cutting concerns resolved at the architecture level.
- Classify data sensitivity early and enforce encryption at rest and in transit at the infrastructure layer.
- Reference: OWASP Architecture Cheat Sheet; NIST SP 800-160.

---

*All references are indexed in SOURCE_INDEX.md.*
