# ARCHITECT_AGENT — Learning Notes

> Domain: Software Architecture & System Design
> Last updated: 2026-06-05
> Purpose: Condensed insights, lessons learned, and synthesis notes from study of core references.

---

## Notes on Domain-Driven Design (Evans, Vernon)

### The Strategic Design Insight
The most important takeaway from Evans is not the tactical patterns (Aggregate, Entity, Value Object) — it is **Strategic Design**. Bounded Contexts and Context Maps are what make DDD applicable to large, multi-team systems. Many teams apply DDD tactically without the strategic foundation and end up with an anemic domain model wrapped in unnecessary complexity.

> "The most important thing about a Bounded Context is that it is explicitly defined and its relationships with other contexts are explicitly mapped." — Vaughn Vernon

### Ubiquitous Language is Not Optional
A Ubiquitous Language is not just about naming conventions. It represents an ongoing collaboration between domain experts and developers. The language must be visible in code: class names, method names, variable names, and test names should all reflect domain concepts. When there is a translation between the domain expert's words and the code, it is a symptom of a missing or broken Ubiquitous Language.

### Aggregates: Keep Them Small
Evans and Vernon both emphasize that aggregates should be as small as possible. The temptation is to include multiple related entities in one aggregate "for consistency." The correct approach is to use eventual consistency between aggregates and only enforce strong consistency within a single aggregate root's boundary. An aggregate that is too large becomes a concurrency bottleneck.

### Domain Events as the Integration Mechanism
Domain Events (introduced in Evans's 2004 addendum and expanded by Vernon) are the cleanest mechanism for integration between bounded contexts. An event represents something that happened, not a request. Publishing events decouples producer from consumer and makes integration explicit in the domain model.

---

## Notes on Clean Architecture (Robert C. Martin)

### The Dependency Rule is the Core
Everything in Clean Architecture flows from one rule: **dependencies point inward**. This means:
- Use cases do not depend on the web framework.
- Entities do not depend on use cases.
- The database is a detail, not the center of the application.

### The "Details" Mindset
Martin's most important architectural insight may be this: databases, web frameworks, and UI frameworks are **details**. They are interchangeable components that should be plugged into the outer layers. When a team designs around the database first, they have violated the Dependency Rule before writing a single line of business logic.

### Use Cases Define the Application
Use cases (also called Interactors) are the heart of the application layer. They encode what the system does — not how it is delivered or stored. A system with well-defined use cases can be tested without spinning up HTTP servers or databases, which is both a design goal and a validation mechanism.

---

## Notes on Microservices (Sam Newman)

### The Decomposition Problem is the Hardest Part
Newman's key lesson from years of consulting: the hardest part of microservices is not the technology — it is finding the right service boundaries. Services that are too fine-grained create high operational overhead and chatty inter-service communication. Services that are too coarse-grained are just distributed monoliths. The correct alignment is one service per Bounded Context (DDD), evolving boundaries as the domain understanding deepens.

### Data Ownership is Non-Negotiable
The moment two services share a database, you have a distributed monolith. Each service must own its data store. If two services both need the same data, one of three things is true:
1. They belong in the same bounded context (merge the services).
2. One service should expose an API for the other to query.
3. One service should publish events that the other consumes to maintain its own projection.

### Don't Start with Microservices
Newman explicitly advises against starting greenfield projects as microservices. Start with a monolith (a "majestic monolith"), define clear internal module boundaries, and extract services when you have enough domain understanding and operational maturity to justify the complexity.

---

## Notes on Resilience (Michael Nygard)

### The Root Cause of Cascading Failures
Nygard's central insight from *Release It!* is that cascading failures almost always originate from **unbounded resource consumption**: threads waiting indefinitely for a slow database, connections exhausted waiting for a slow downstream service, queues filling up because a consumer is blocked. The circuit breaker, bulkhead, and timeout patterns all exist to impose bounds on resource usage.

### Timeouts Are Not Optional
Every network call in a production system must have an explicit timeout. The absence of a timeout means a single slow dependency can exhaust all threads in a thread pool and bring down an otherwise healthy service. This is one of the most common and preventable causes of production outages.

---

## Notes on Data-Intensive Systems (Martin Kleppmann)

### Consistency is a Spectrum
Kleppmann's most important contribution is clarifying that "consistency" means different things in different contexts. Linearizability (the strongest form) means that the system appears to execute operations atomically and in real-time order. Eventual consistency means that, given no new updates, all replicas converge to the same value. Most systems do not need linearizability; they need causal consistency or read-your-writes consistency at most. The cost of linearizability (coordination, latency) is often not justified.

### Event Logs as the Source of Truth
The log-structured approach that Kleppmann describes — treating an append-only event log as the primary source of truth — is the foundation of both Event Sourcing and Kafka's design. Database replication, change data capture (CDC), and event sourcing are all variations of the same idea: a total order of events is the most reliable foundation for a distributed data system.

---

## Notes on Architecture Communication (Simon Brown, C4 Model)

### Most Architecture Diagrams Fail at Communication
Brown's observation is that most architecture diagrams are either too abstract (boxes labeled "service" connected by arrows labeled "talks to") or too detailed (UML class diagrams that only the author can read). The C4 Model solves this with four levels of abstraction, each targeted at a different audience. A system context diagram can be understood by a non-technical stakeholder; a component diagram is for developers.

### Diagrams Must Be Maintained
Architecture diagrams that are not maintained become worse than no diagrams, because they actively mislead. The solution is either to generate diagrams from code (Structurizr DSL, PlantUML from annotations) or to treat diagrams as first-class artifacts stored in version control and reviewed with the same rigor as code.

---

## Synthesis: Common Mistakes in Architecture

| Mistake | Better Approach |
|---|---|
| Designing the database schema first | Design the domain model first; the schema is a persistence detail. |
| Treating all bounded contexts as microservices | Start with a modular monolith; extract services when justified. |
| Sharing a database between services | Each service owns its data; integrate via APIs or events. |
| Skipping ADRs | Document every significant decision with context and consequences. |
| No timeouts on remote calls | Add explicit timeouts to every network call. |
| Architecture diagrams in PowerPoint | Use versioned, text-based diagrams (PlantUML, Structurizr). |
| Anemic domain model | Move business logic from services/scripts into domain objects. |
| Over-engineering for scale that doesn't exist | Design for the current scale; use fitness functions to guide evolution. |

---

*All referenced works are indexed in SOURCE_INDEX.md.*
