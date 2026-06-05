# ARCHITECT_AGENT — Frameworks and Methods

> Domain: Software Architecture & System Design
> Last updated: 2026-06-05

---

## 1. Domain-Driven Design (DDD)

**Origin:** Eric Evans, *Domain-Driven Design* (2003); extended by Vaughn Vernon.

**Purpose:** Align software models with complex business domains through shared language and strategic decomposition.

### Strategic Design Patterns

| Pattern | Description |
|---|---|
| Ubiquitous Language | A shared, precise vocabulary between developers and domain experts, enforced in code. |
| Bounded Context | An explicit boundary within which a particular domain model applies. |
| Context Map | A diagram showing the relationships and integration styles between bounded contexts. |
| Subdomain | A partition of the problem space: Core Domain (competitive advantage), Supporting Subdomain, Generic Subdomain. |

### Tactical Design Patterns

| Pattern | Description |
|---|---|
| Entity | An object defined by a thread of continuity and identity. |
| Value Object | An immutable object defined entirely by its attributes; no identity. |
| Aggregate | A cluster of associated objects treated as a unit for data changes; has a root entity. |
| Domain Event | A record of something meaningful that happened in the domain. |
| Repository | An abstraction for retrieving and persisting aggregates. |
| Domain Service | Stateless operations that do not belong to a specific entity or value object. |
| Factory | Encapsulates complex object or aggregate creation. |
| Application Service | Orchestrates use cases; coordinates domain objects and infrastructure. |

### Integration Patterns (Context Map Relationships)

- **Shared Kernel:** Two contexts share a subset of the domain model.
- **Customer/Supplier:** Upstream context serves the downstream; downstream influences priorities.
- **Conformist:** Downstream adopts the upstream model with no influence.
- **Anticorruption Layer (ACL):** Translates between two models to protect domain integrity.
- **Open Host Service / Published Language:** A well-documented protocol for integration.
- **Separate Ways:** Contexts with no integration.

---

## 2. Clean Architecture

**Origin:** Robert C. Martin, *Clean Architecture* (2017).

**Purpose:** Organize code so that business rules are independent of frameworks, UI, databases, and external agencies.

### The Dependency Rule

> "Source code dependencies must point only inward, toward higher-level policies."

### Layers (outer to inner)

1. **Frameworks & Drivers** — Web frameworks, databases, UI.
2. **Interface Adapters** — Controllers, Presenters, Gateways. Convert data between use cases and external forms.
3. **Application Business Rules (Use Cases)** — Application-specific business rules. Orchestrate the flow of data.
4. **Enterprise Business Rules (Entities)** — Core business rules and data structures. Most stable layer.

### Key Principles Applied

- **SOLID** principles govern each layer.
- Use **Dependency Inversion** at every layer boundary (depend on abstractions, not concretions).
- **Entities** have no knowledge of use cases; **use cases** have no knowledge of frameworks.

---

## 3. Microservices Architecture

**Origin:** James Lewis & Martin Fowler (2014 article); Sam Newman, *Building Microservices* (2021).

**Purpose:** Decompose an application into small, independently deployable services, each owning its data and bounded by business capability.

### Core Principles

- Services are deployed independently.
- Each service owns its data store (no shared databases between services).
- Services communicate over well-defined APIs (REST, gRPC, or messaging).
- Align service boundaries with Bounded Contexts.

### Key Decomposition Strategies

- **Decompose by Business Capability:** Each service implements one business capability.
- **Decompose by Subdomain (DDD):** Map services to subdomains.
- **Strangler Fig Pattern:** Incrementally replace monolith functionality with new services (Martin Fowler).

### Communication Patterns

| Style | Use When |
|---|---|
| Synchronous REST/HTTP | Simple request/response; low coupling needed. |
| gRPC | High-performance, contract-first, polyglot services. |
| Asynchronous Messaging (events) | Loose coupling, resilience, eventual consistency. |
| Saga Pattern | Distributed transactions across multiple services. |

### Data Patterns

- **Database per Service** — enforces loose coupling.
- **CQRS (Command Query Responsibility Segregation)** — separate read and write models.
- **Event Sourcing** — store state as an immutable log of events.
- **Outbox Pattern** — ensure at-least-once event delivery without distributed transactions.

---

## 4. C4 Model

**Origin:** Simon Brown, *Software Architecture for Developers* (2014); c4model.com.

**Purpose:** A hierarchical, lightweight set of diagrams for communicating software architecture.

### Four Levels

| Level | Audience | Shows |
|---|---|---|
| Level 1: System Context | Non-technical stakeholders | The system and its users and external dependencies. |
| Level 2: Container | Technical stakeholders | Applications, databases, microservices inside the system boundary. |
| Level 3: Component | Developers | Major structural building blocks inside a container. |
| Level 4: Code | Developers | Classes, interfaces, functions (usually auto-generated). |

**Tooling:** PlantUML with C4-PlantUML library; Structurizr (Simon Brown's tool).

---

## 5. 12-Factor App

**Origin:** Adam Wiggins / Heroku (2011); 12factor.net.

**Purpose:** A methodology for building portable, resilient, scalable software-as-a-service applications.

### The 12 Factors

| # | Factor | Principle |
|---|---|---|
| I | Codebase | One codebase per app; tracked in version control. |
| II | Dependencies | Explicitly declare and isolate dependencies. |
| III | Config | Store config in the environment, not code. |
| IV | Backing Services | Treat databases, queues, etc. as attached resources. |
| V | Build, Release, Run | Strictly separate build and run stages. |
| VI | Processes | Execute the app as stateless processes. |
| VII | Port Binding | Export services via port binding. |
| VIII | Concurrency | Scale out via the process model. |
| IX | Disposability | Fast startup and graceful shutdown. |
| X | Dev/Prod Parity | Keep development, staging, and production as similar as possible. |
| XI | Logs | Treat logs as event streams. |
| XII | Admin Processes | Run admin/management tasks as one-off processes. |

---

## 6. Architecture Tradeoff Analysis Method (ATAM)

**Origin:** Software Engineering Institute (SEI), Carnegie Mellon University; Len Bass, Paul Clements, Rick Kazman.

**Purpose:** Structured evaluation of architectural decisions against competing quality attributes.

### Process Steps

1. Present the ATAM.
2. Present the business drivers.
3. Present the architecture.
4. Identify architectural approaches.
5. Generate the quality attribute utility tree.
6. Analyze architectural approaches against quality attributes.
7. Identify and prioritize scenarios.
8. Analyze against scenarios.
9. Present results.

---

## 7. Event-Driven Architecture (EDA)

**Origin:** Documented extensively by Martin Fowler, Gregor Hohpe, and Vaughn Vernon.

**Purpose:** Decouple producers and consumers of information through an event bus or message broker.

### Patterns

- **Event Notification:** Notify other bounded contexts that something happened (lightweight, no data in event).
- **Event-Carried State Transfer:** Include all relevant data in the event so consumers do not need to query back.
- **Event Sourcing:** Persist the full history of domain events as the source of truth for state.
- **CQRS + Event Sourcing:** Commands produce events; events build read-optimized projections.

**Infrastructure:** Apache Kafka, RabbitMQ, AWS EventBridge, Azure Service Bus.

---

*All references are indexed in SOURCE_INDEX.md.*
