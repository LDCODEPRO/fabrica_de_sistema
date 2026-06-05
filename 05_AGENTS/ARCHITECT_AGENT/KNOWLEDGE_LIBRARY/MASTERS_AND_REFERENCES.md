# ARCHITECT_AGENT — Masters and References

> Domain: Software Architecture & System Design
> Last updated: 2026-06-05

---

## Martin Fowler

**Role:** Chief Scientist at ThoughtWorks; one of the most influential voices in software architecture and enterprise patterns.

**Key contributions:**
- Defined enterprise integration patterns alongside Gregor Hohpe.
- Coined and popularized the term "microservices" architecture (with James Lewis, 2014 article).
- Authored the definitive catalog of patterns for enterprise application architecture.
- Maintains martinfowler.com — a reference site for architecture patterns, bliki articles, and methodology.

**Essential works:**
- *Patterns of Enterprise Application Architecture* (2002) — catalog of 51 patterns covering domain logic, data source, web presentation, concurrency, and base patterns.
- *Refactoring: Improving the Design of Existing Code* (1999, 2nd ed. 2018) — though developer-focused, directly impacts architectural refactoring decisions.
- *UML Distilled* (3rd ed., 2003) — practical guide to applying UML for architecture communication.
- Articles: "Microservices" (2014), "BoundedContext", "CQRS", "EventSourcing", "SagaPattern" (martinfowler.com).

---

## Eric Evans

**Role:** Author of Domain-Driven Design; founder of Domain Language, Inc.

**Key contributions:**
- Defined the foundational vocabulary of DDD: Ubiquitous Language, Bounded Context, Aggregate, Entity, Value Object, Domain Service, Repository, Factory, Context Map.
- Distinguished Strategic Design (large-scale structure, context mapping) from Tactical Design (patterns within a bounded context).

**Essential works:**
- *Domain-Driven Design: Tackling Complexity in the Heart of Software* (2003) — the original "Blue Book"; mandatory reading for any architect working on complex business domains.
- DDD Reference (free PDF, 2015) — condensed glossary and pattern summaries.
- Keynote: "DDD Isn't Done" (DDD Europe, 2016).

---

## Robert C. Martin (Uncle Bob)

**Role:** Software craftsman, author, speaker; creator of the SOLID principles.

**Key contributions:**
- Defined the SOLID principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion).
- Articulated the Dependency Rule and the layered structure of Clean Architecture.
- Promoted the concept of software craftsmanship.

**Essential works:**
- *Clean Architecture: A Craftsman's Guide to Software Structure and Design* (2017) — defines the architectural layers and the Dependency Rule.
- *Agile Software Development, Principles, Patterns, and Practices* (2002) — first published exposition of SOLID.

---

## Sam Newman

**Role:** Consultant and author specializing in microservices and distributed systems.

**Key contributions:**
- Wrote the most widely adopted practical guide to designing, building, and running microservices.
- Documented patterns for service decomposition, inter-service communication, data ownership, and testing.

**Essential works:**
- *Building Microservices: Designing Fine-Grained Systems* (1st ed. 2015, 2nd ed. 2021) — comprehensive reference for microservice architecture decisions.
- *Monolith to Microservices: Evolutionary Patterns to Transform Your Monolith* (2019) — patterns for incremental migration.

---

## Vaughn Vernon

**Role:** DDD practitioner, consultant, and author; creator of the IDDD Workshop.

**Key contributions:**
- Translated Eric Evans's DDD concepts into concrete implementation patterns.
- Documented reactive DDD using event-driven architectures.
- Popularized the use of Domain Events and Event Sourcing within DDD contexts.

**Essential works:**
- *Implementing Domain-Driven Design* (2013) — the "Red Book"; concrete implementation guidance with Java examples.
- *Domain-Driven Design Distilled* (2016) — accessible entry point to DDD strategy and tactics.
- *Reactive Messaging Patterns with the Actor Model* (2015).

---

## Gregor Hohpe

**Role:** Enterprise Architect at Google Cloud; co-author of *Enterprise Integration Patterns*.

**Key contributions:**
- Catalogued 65 messaging patterns used in enterprise integration (with Bobby Woolf).
- Introduced concepts such as Message Channel, Message Router, Message Translator, Message Endpoint.
- Authors the "Architect Elevator" concept of bridging technical depth with business strategy.

**Essential works:**
- *Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions* (2003) — canonical reference for integration architecture.
- *The Software Architect Elevator* (2020) — describes the role and skills of a modern enterprise architect.

---

## Michael Nygard

**Role:** Software architect and author; practitioner in large-scale distributed systems.

**Key contributions:**
- Documented stability patterns that prevent production failures (circuit breaker, bulkhead, timeout, fail fast).
- Introduced the ADR (Architecture Decision Record) format.

**Essential works:**
- *Release It! Design and Deploy Production-Ready Software* (1st ed. 2007, 2nd ed. 2018) — mandatory for designing resilient, production-grade systems.
- Blog post: "Documenting Architecture Decisions" (2011) — origin of the ADR format.

---

## Martin Kleppmann

**Role:** Researcher and author; distributed systems specialist.

**Key contributions:**
- Provided the most thorough practical treatment of distributed data systems available to practitioners.
- Covered replication, partitioning, transactions, consistency models, and stream processing in depth.

**Essential works:**
- *Designing Data-Intensive Applications* (2017) — essential reference for data architecture decisions in distributed systems.

---

## Simon Brown

**Role:** Independent consultant; creator of the C4 Model for software architecture diagrams.

**Key contributions:**
- Designed the C4 Model (Context, Container, Component, Code) as a lightweight, hierarchical approach to visualizing software architecture.
- Promoted architecture documentation that is both accessible and precise.

**Essential works:**
- *Software Architecture for Developers* (Vol. 1 & 2, 2014–2018) — practical guide covering technical leadership and visualization.
- C4 Model specification (c4model.com).

---

*All works are indexed in SOURCE_INDEX.md.*
