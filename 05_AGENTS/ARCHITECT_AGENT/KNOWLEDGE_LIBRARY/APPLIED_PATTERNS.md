# ARCHITECT_AGENT — Applied Patterns

> Domain: Software Architecture & System Design
> Last updated: 2026-06-05

---

## Structural Patterns

### Layered Architecture
- **Context:** Monolithic applications or services with clear separation between presentation, business logic, and data access.
- **Structure:** Presentation → Application → Domain → Infrastructure (dependencies point downward or inward).
- **When to use:** When clear separation of concerns is needed; when teams are organized by technical layer.
- **Tradeoffs:** Simple to understand; can lead to "lasagna code" with too many thin layers.
- **Reference:** Martin Fowler, *Patterns of Enterprise Application Architecture* (2002), p. 20.

### Hexagonal Architecture (Ports and Adapters)
- **Author:** Alistair Cockburn (2005).
- **Context:** Applications that must be testable in isolation from external systems (databases, message brokers, UIs).
- **Structure:** The application core (domain + use cases) exposes *ports* (interfaces); *adapters* implement those ports for specific technologies.
- **Primary ports:** Driving adapters (REST controllers, CLI, tests) call in.
- **Secondary ports:** Driven adapters (database repositories, email services) are called out.
- **When to use:** High testability requirements; multiple delivery mechanisms (REST + CLI + events).
- **Reference:** Alistair Cockburn, "Hexagonal Architecture" (alistair.cockburn.us, 2005); Robert C. Martin, *Clean Architecture* (2017).

### Clean Architecture
- **Author:** Robert C. Martin.
- **Structure:** Entities → Use Cases → Interface Adapters → Frameworks & Drivers.
- **Key rule:** The Dependency Rule — dependencies point inward; inner layers know nothing about outer layers.
- **Reference:** Robert C. Martin, *Clean Architecture* (2017), Chapter 22.

---

## Microservices Decomposition Patterns

### Strangler Fig Pattern
- **Author:** Martin Fowler (2004, martinfowler.com).
- **Context:** Migrating a monolith to microservices incrementally without a risky big-bang rewrite.
- **How it works:** New functionality is implemented as new services; over time, existing monolith functions are "strangled" by extracting them into services. A routing layer (facade) directs traffic.
- **Reference:** Martin Fowler, "StranglerFigApplication" (martinfowler.com).

### Branch by Abstraction
- **Context:** Replacing a large component (e.g., a data store or framework) without a feature branch.
- **How it works:** Introduce an abstraction layer; implement both old and new providers behind it; migrate callers gradually; remove the old implementation.
- **Reference:** Martin Fowler, "BranchByAbstraction" (martinfowler.com); Sam Newman, *Monolith to Microservices* (2019).

### Sidecar Pattern
- **Context:** Adding cross-cutting capabilities (observability, security, configuration) to services without modifying service code.
- **How it works:** Deploy a secondary container alongside the primary service container (in the same pod in Kubernetes).
- **Use cases:** Service mesh proxies (Envoy/Istio), log shippers, configuration agents.

---

## Data Patterns

### Repository Pattern
- **Author:** Martin Fowler, *Patterns of Enterprise Application Architecture* (2002).
- **Purpose:** Decouple the domain model from data access logic by providing a collection-like interface for accessing domain objects.
- **Implementation:** Define a repository interface in the domain layer; implement it in the infrastructure layer.

### CQRS (Command Query Responsibility Segregation)
- **Author:** Greg Young (2010); influenced by Bertrand Meyer's CQS principle.
- **Purpose:** Separate the models used for reading (queries) and writing (commands).
- **When to use:** When read and write workloads have significantly different scaling, consistency, or model requirements.
- **Reference:** Martin Fowler, "CQRS" (martinfowler.com); Vaughn Vernon, *Implementing Domain-Driven Design* (2013), Chapter 4.

### Event Sourcing
- **Purpose:** Persist state as a sequence of domain events rather than as the current state.
- **Benefits:** Full audit log; ability to rebuild projections; enables temporal queries.
- **Challenges:** Event schema evolution; eventual consistency of projections; complexity of compensating events.
- **Reference:** Martin Fowler, "EventSourcing" (martinfowler.com); Greg Young, "CQRS and Event Sourcing" (cqrs.nu).

### Outbox Pattern
- **Purpose:** Guarantee reliable event publication from a service without distributed transactions.
- **How it works:** Write domain events to an *outbox* table in the same database transaction as the state change; a separate relay process reads the outbox and publishes to the message broker.
- **Reference:** Documented in Sam Newman, *Building Microservices* (2021) and in Kleppmann, *Designing Data-Intensive Applications* (2017).

### Saga Pattern
- **Purpose:** Manage data consistency across multiple microservices without distributed transactions (which violate service autonomy).
- **Choreography-based Saga:** Each service publishes events and listens to events from other services; no central coordinator.
- **Orchestration-based Saga:** A central saga orchestrator directs the steps and handles compensating transactions.
- **Reference:** Hector Garcia-Molina & Kenneth Salem, "Sagas" (1987); documented extensively in Sam Newman, *Building Microservices* (2021), Chapter 6.

---

## Resilience Patterns

### Circuit Breaker
- **Author:** Michael Nygard, *Release It!* (2007/2018), Chapter 5.
- **Purpose:** Prevent a service from repeatedly calling a failing downstream dependency, giving it time to recover.
- **States:** Closed (normal), Open (requests fail immediately), Half-Open (test requests allowed through).
- **Implementation:** Netflix Hystrix (deprecated), Resilience4j (Java), Polly (.NET).

### Bulkhead
- **Author:** Michael Nygard, *Release It!* (2007/2018).
- **Purpose:** Isolate failures so that a problem in one subsystem does not cascade to others.
- **Implementation:** Separate thread pools or connection pools per downstream dependency; separate Kubernetes resource quotas per service.

### Retry with Exponential Backoff
- **Purpose:** Handle transient failures in remote calls by retrying with increasing delays.
- **Key rules:** Use jitter (random variance) to avoid thundering herd; set a maximum retry count and deadline.

### Timeout
- **Purpose:** Prevent a thread or resource from being held indefinitely waiting for a slow or unresponsive dependency.
- **Key rule:** Every remote call must have an explicit timeout. Never rely on system defaults alone.

---

## Integration Patterns (from Hohpe & Woolf)

| Pattern | Description |
|---|---|
| Message Channel | A conduit through which messages flow between applications. |
| Message Router | Routes a message to the correct channel based on its content or metadata. |
| Message Translator | Transforms a message from one format to another between systems. |
| Dead Letter Channel | A channel for messages that cannot be delivered or processed. |
| Claim Check | Stores large message payloads externally; passes a reference (claim check) in the message. |
| Idempotent Receiver | A consumer that can handle duplicate messages without side effects. |
| Competing Consumers | Multiple consumers reading from the same queue to increase throughput. |

**Reference:** Gregor Hohpe & Bobby Woolf, *Enterprise Integration Patterns* (2003).

---

*All references are indexed in SOURCE_INDEX.md.*
