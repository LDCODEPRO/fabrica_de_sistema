# ARCHITECT_AGENT — Books and Works

> Domain: Software Architecture & System Design
> Last updated: 2026-06-05

---

## Tier 1 — Foundational (Must Read)

### Domain-Driven Design: Tackling Complexity in the Heart of Software
- **Author:** Eric Evans
- **Publisher:** Addison-Wesley, 2003
- **Why essential:** Defines the strategic and tactical patterns that underpin modern service decomposition and complex domain modeling. The vocabulary (Ubiquitous Language, Bounded Context, Aggregate) is the lingua franca of architecture conversations.
- **Key chapters:** Part I (Putting the Domain Model to Work), Part II (Building Blocks of a Model-Driven Design), Part IV (Strategic Design).

### Clean Architecture: A Craftsman's Guide to Software Structure and Design
- **Author:** Robert C. Martin
- **Publisher:** Prentice Hall, 2017
- **Why essential:** Articulates the Dependency Rule and the concentric-layer model. Provides a principled framework for separating business rules from delivery mechanisms.
- **Key chapters:** Part III (Design Principles), Part V (Architecture), Chapter 22 (The Clean Architecture).

### Building Microservices: Designing Fine-Grained Systems (2nd ed.)
- **Author:** Sam Newman
- **Publisher:** O'Reilly Media, 2021
- **Why essential:** The most comprehensive practical guide to microservice design, covering service decomposition, communication styles, data ownership, testing, deployment, and organizational alignment.
- **Key chapters:** Chapter 2 (How to Model Microservices), Chapter 4 (Communication Styles), Chapter 6 (Workflow), Chapter 12 (Resiliency).

### Designing Data-Intensive Applications
- **Author:** Martin Kleppmann
- **Publisher:** O'Reilly Media, 2017
- **Why essential:** Authoritative treatment of data systems: replication, partitioning, transactions, consistency and consensus, batch processing, and stream processing. Indispensable for data architecture decisions.
- **Key chapters:** Chapter 5 (Replication), Chapter 7 (Transactions), Chapter 9 (Consistency and Consensus), Chapter 11 (Stream Processing).

### Patterns of Enterprise Application Architecture
- **Author:** Martin Fowler
- **Publisher:** Addison-Wesley, 2002
- **Why essential:** Catalog of 51 patterns for enterprise applications. Every architect must know the core patterns: Transaction Script, Domain Model, Table Module, Repository, Unit of Work, Identity Map, Lazy Load, and the presentation patterns.
- **Key chapters:** Part I (Narratives), Part II (Patterns).

### Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions
- **Authors:** Gregor Hohpe, Bobby Woolf
- **Publisher:** Addison-Wesley, 2003
- **Why essential:** The canonical reference for message-based integration. Defines 65 patterns covering messaging systems, message channels, message routing, message transformation, and endpoints.
- **Key chapters:** Chapter 3 (Messaging Systems), Chapter 7 (Message Routing), Chapter 8 (Message Transformation).

---

## Tier 2 — Highly Recommended

### Release It! Design and Deploy Production-Ready Software (2nd ed.)
- **Author:** Michael Nygard
- **Publisher:** Pragmatic Bookshelf, 2018
- **Why essential:** Stability and capacity patterns derived from real production incidents. The circuit breaker, bulkhead, and timeout patterns are documented here first.
- **Key chapters:** Chapter 4 (Stability Antipatterns), Chapter 5 (Stability Patterns), Chapter 9 (Interconnect).

### Implementing Domain-Driven Design
- **Author:** Vaughn Vernon
- **Publisher:** Addison-Wesley, 2013
- **Why essential:** Translates Evans's concepts into concrete implementation guidance. Covers Bounded Contexts, Context Maps, Aggregates, Domain Events, and Application Services with detailed examples.
- **Key chapters:** Chapter 2 (Domains, Subdomains, and Bounded Contexts), Chapter 7 (Services), Chapter 8 (Domain Events), Chapter 10 (Aggregates).

### Building Evolutionary Architectures: Support Constant Change
- **Authors:** Neal Ford, Rebecca Parsons, Patrick Kua
- **Publisher:** O'Reilly Media, 2017
- **Why essential:** Introduces the concept of fitness functions for guiding architectural evolution. Provides strategies for incremental architectural change.
- **Key chapters:** Chapter 2 (Fitness Functions), Chapter 3 (Engineering Incremental Change).

### Monolith to Microservices: Evolutionary Patterns to Transform Your Monolith
- **Author:** Sam Newman
- **Publisher:** O'Reilly Media, 2019
- **Why essential:** Migration patterns for decomposing monolithic applications. Documents Strangler Fig, Branch by Abstraction, Parallel Run, and data decomposition strategies.

### Software Architecture in Practice (4th ed.)
- **Authors:** Len Bass, Paul Clements, Rick Kazman
- **Publisher:** Addison-Wesley, 2022
- **Why essential:** Academic and practitioner foundation of software architecture. Covers quality attributes (availability, performance, security, modifiability) and Architecture Tradeoff Analysis Method (ATAM).

### Domain-Driven Design Distilled
- **Author:** Vaughn Vernon
- **Publisher:** Addison-Wesley, 2016
- **Why essential:** Accessible introduction to DDD strategy and tactics. Ideal for sharing DDD concepts with teams and stakeholders who cannot tackle the full Evans book.

---

## Tier 3 — Supplementary

### The Software Architect Elevator: Redefining the Architect's Role in the Digital Enterprise
- **Author:** Gregor Hohpe
- **Publisher:** O'Reilly Media, 2020
- **Focus:** The architect's role in bridging technical depth and business strategy within large organizations.

### Reactive Messaging Patterns with the Actor Model
- **Author:** Vaughn Vernon
- **Publisher:** Addison-Wesley, 2015
- **Focus:** Applying the Actor Model and reactive design within DDD event-driven architectures.

### Software Architecture for Developers (Vol. 1 & 2)
- **Author:** Simon Brown
- **Publisher:** Leanpub, 2014–2018
- **Focus:** Technical leadership, architectural thinking, and the C4 Model for visualization.

### A Philosophy of Software Design
- **Author:** John Ousterhout
- **Publisher:** Yaknyam Press, 2018
- **Focus:** Managing software complexity; deep vs. shallow modules; comments as design tools.

---

## Reference Specifications and Online Resources

| Resource | Author / Organization | URL |
|---|---|---|
| C4 Model | Simon Brown | c4model.com |
| 12-Factor App | Heroku / Adam Wiggins | 12factor.net |
| ADR Format | Michael Nygard | adr.github.io |
| DDD Reference (free PDF) | Eric Evans | domainlanguage.com |
| martinfowler.com Bliki | Martin Fowler | martinfowler.com |
| OWASP Architecture Cheat Sheet | OWASP Foundation | owasp.org |

---

*All entries are cross-referenced in SOURCE_INDEX.md.*
