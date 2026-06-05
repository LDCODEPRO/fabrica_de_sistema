# PATTERNS INDEX — Fábrica de Sistemas Source of Truth

> Consolidated unique list of all real design patterns, architectural patterns, and testing patterns cited across the 7 agent knowledge libraries.
> Generated: 2026-06-05
> Agents covered: ARCHITECT, DEVELOPER, QA, DOCS, ORCHESTRATOR, ANALYST, DESIGNER

---

## Architectural Patterns

| ID | Pattern | Origin / Author | Category | Description | Agent(s) |
|----|---------|-----------------|----------|-------------|---------|
| P-001 | Layered Architecture | Martin Fowler (PEAA, 2002) | Structural | Organizes code into layers: Presentation → Application → Domain → Infrastructure | ARCHITECT |
| P-002 | Hexagonal Architecture (Ports and Adapters) | Alistair Cockburn (2005) | Structural | Application core with ports (interfaces); adapters for external technologies | ARCHITECT |
| P-003 | Clean Architecture | Robert C. Martin (2017) | Structural | Entities → Use Cases → Interface Adapters → Frameworks; Dependency Rule | ARCHITECT |
| P-004 | Microservices Architecture | Martin Fowler, Sam Newman | Structural | System decomposed into small, independently deployable services | ARCHITECT |
| P-005 | Event-Driven Architecture | Various | Structural | Components communicate through domain events; decoupled producers and consumers | ARCHITECT |
| P-006 | CQRS (Command Query Responsibility Segregation) | Greg Young, Martin Fowler | Data | Separate read (query) and write (command) models and data stores | ARCHITECT |
| P-007 | Event Sourcing | Greg Young | Data | Store state as an immutable sequence of domain events; rebuild state by replaying | ARCHITECT |
| P-008 | Repository Pattern | Martin Fowler (PEAA, 2002) | Data Access | Collection-like interface for domain objects; decouples domain from persistence | ARCHITECT, DEVELOPER |
| P-009 | Unit of Work | Martin Fowler (PEAA, 2002) | Data Access | Track all changes in a business transaction; commit or rollback atomically | ARCHITECT |
| P-010 | Strangler Fig Pattern | Martin Fowler (2004) | Migration | Incrementally replace monolith by routing new functionality to new services | ARCHITECT |
| P-011 | Branch by Abstraction | Martin Fowler (martinfowler.com) | Migration | Replace a component without feature branches; introduce abstraction, migrate callers gradually | ARCHITECT |
| P-012 | Sidecar Pattern | Kubernetes / Service Mesh community | Infrastructure | Deploy secondary container alongside primary for cross-cutting concerns (logging, security) | ARCHITECT |
| P-013 | Anticorruption Layer (ACL) | Eric Evans (DDD, 2003) | Integration | Translate between bounded contexts to protect domain integrity from external models | ARCHITECT |
| P-014 | Saga Pattern | Martin Fowler (martinfowler.com) | Distributed Systems | Manage distributed transactions through a sequence of local transactions with compensating events | ARCHITECT |
| P-015 | Circuit Breaker | Michael Nygard (Release It!, 2007) | Resilience | Detect failures and short-circuit calls to failing services; states: Closed, Open, Half-Open | ARCHITECT |
| P-016 | Bulkhead | Michael Nygard (Release It!, 2007) | Resilience | Isolate elements so that failure in one does not cascade to others | ARCHITECT |
| P-017 | Retry with Exponential Backoff | Michael Nygard | Resilience | Retry failed requests with increasing delays and jitter to avoid thundering herd | ARCHITECT |
| P-018 | API Gateway | Sam Newman | API Design | Single entry point for clients; handles routing, auth, rate limiting, aggregation | ARCHITECT |
| P-019 | Backend for Frontend (BFF) | Sam Newman | API Design | Separate backend service tailored to each frontend type (mobile, web, third-party) | ARCHITECT |

---

## Object-Oriented Design Patterns (GoF)

| ID | Pattern | Category | Intent | Agent(s) |
|----|---------|----------|--------|---------|
| P-020 | Factory Method | Creational | Define interface for object creation; subclasses decide which class to instantiate | DEVELOPER |
| P-021 | Abstract Factory | Creational | Create families of related objects without specifying concrete classes | DEVELOPER |
| P-022 | Builder | Creational | Separate construction of complex objects from their representation | DEVELOPER |
| P-023 | Prototype | Creational | Create new objects by copying an existing object | DEVELOPER |
| P-024 | Singleton | Creational | Ensure one instance; provide global access point (use sparingly) | DEVELOPER |
| P-025 | Adapter | Structural | Convert interface of a class into another interface clients expect | DEVELOPER |
| P-026 | Bridge | Structural | Decouple abstraction from implementation so both can vary independently | DEVELOPER |
| P-027 | Composite | Structural | Compose objects into tree structures to represent part-whole hierarchies | DEVELOPER |
| P-028 | Decorator | Structural | Attach additional responsibilities to an object dynamically | DEVELOPER |
| P-029 | Facade | Structural | Provide simplified interface to a complex subsystem | DEVELOPER |
| P-030 | Flyweight | Structural | Use sharing to efficiently support large numbers of fine-grained objects | DEVELOPER |
| P-031 | Proxy | Structural | Provide a surrogate to control access to another object | DEVELOPER |
| P-032 | Chain of Responsibility | Behavioral | Pass request along a chain of handlers; each decides to process or pass on | DEVELOPER |
| P-033 | Command | Behavioral | Encapsulate a request as an object; enables undo/redo and queuing | DEVELOPER |
| P-034 | Iterator | Behavioral | Provide sequential access to elements of an aggregate without exposing its representation | DEVELOPER |
| P-035 | Mediator | Behavioral | Define an object that encapsulates how a set of objects interact | DEVELOPER |
| P-036 | Memento | Behavioral | Capture and externalize an object's internal state for later restoration | DEVELOPER |
| P-037 | Null Object | Behavioral | Provide a default do-nothing behavior to avoid null checks | DEVELOPER |
| P-038 | Observer | Behavioral | Define a one-to-many dependency so all dependents are notified of state changes | DEVELOPER |
| P-039 | State | Behavioral | Allow an object to alter its behavior when its internal state changes | DEVELOPER |
| P-040 | Strategy | Behavioral | Define a family of algorithms, encapsulate each, and make them interchangeable | DEVELOPER |
| P-041 | Template Method | Behavioral | Define skeleton of an algorithm; let subclasses override specific steps | DEVELOPER |
| P-042 | Visitor | Behavioral | Add new operations to object structures without modifying them | DEVELOPER |

---

## Testing Patterns

| ID | Pattern | Origin / Author | Description | Agent(s) |
|----|---------|-----------------|-------------|---------|
| P-043 | AAA (Arrange-Act-Assert) | Gerard Meszaros (xUnit Test Patterns) | Standard three-phase structure for automated tests: setup, execute, verify | QA, DEVELOPER |
| P-044 | Test Double | Gerard Meszaros | Generic term for any test-replacement object: Stub, Mock, Fake, Spy, Dummy | QA, DEVELOPER |
| P-045 | Stub | Gerard Meszaros | Returns hardcoded values to isolate the unit under test from dependencies | QA |
| P-046 | Mock | Gerard Meszaros | Verifies that specific interactions (calls) occurred; used for side-effect testing | QA |
| P-047 | Fake | Gerard Meszaros | Working but simplified implementation (e.g., in-memory database) for fast tests | QA |
| P-048 | Spy | Gerard Meszaros | Wraps real object and records calls for later assertion | QA |
| P-049 | Page Object Model (POM) | Martin Fowler (martinfowler.com) | One class per UI page/component; encapsulates all selectors; tests call methods | QA |
| P-050 | Test Pyramid | Martin Fowler | Layer model: many unit tests, fewer integration tests, few E2E tests | QA, DEVELOPER |
| P-051 | Given/When/Then (Gherkin) | Dan North / Cucumber community | BDD scenario structure: precondition, action, expected outcome | QA, ANALYST |
| P-052 | Test Charter | James Bach (SBTM) | Short mission statement for an exploratory testing session: explore X to find Y | QA |

---

## DDD Tactical Patterns

| ID | Pattern | Origin | Description | Agent(s) |
|----|---------|--------|-------------|---------|
| P-053 | Entity | Eric Evans (DDD, 2003) | Object defined by identity thread, not attributes; has mutable state | ARCHITECT |
| P-054 | Value Object | Eric Evans (DDD, 2003) | Immutable object defined entirely by its attributes; no identity | ARCHITECT |
| P-055 | Aggregate | Eric Evans (DDD, 2003) | Cluster of domain objects with one root entity; consistency boundary | ARCHITECT |
| P-056 | Domain Event | Eric Evans / Vaughn Vernon | A record of something meaningful that happened in the domain | ARCHITECT |
| P-057 | Domain Service | Eric Evans (DDD, 2003) | Stateless operation not belonging to a specific entity or value object | ARCHITECT |
| P-058 | Application Service | DDD community | Orchestrates use cases; coordinates domain objects and infrastructure | ARCHITECT |
| P-059 | Factory | Eric Evans (DDD, 2003) | Encapsulates complex aggregate or object creation | ARCHITECT |
| P-060 | Specification Pattern | Eric Evans, Martin Fowler | Encapsulate business rules as first-class objects that can be combined | ARCHITECT |

---

## UI/UX Patterns

| ID | Pattern | Origin | Description | Agent(s) |
|----|---------|--------|-------------|---------|
| P-061 | Atomic Design | Brad Frost (2013) | Five-level component hierarchy: Atoms, Molecules, Organisms, Templates, Pages | DESIGNER |
| P-062 | F-Pattern Layout | Nielsen Norman Group | Eye-tracking: users read horizontal top band, then vertical left strip on text-heavy pages | DESIGNER |
| P-063 | Z-Pattern Layout | Nielsen Norman Group | Eye-tracking diagonal for sparse pages: top-left → top-right → bottom-left → bottom-right | DESIGNER |
| P-064 | Hook Model | Nir Eyal (Hooked, 2014) | Habit-forming loop: Trigger → Action → Variable Reward → Investment | DESIGNER |
| P-065 | Mobile-First Responsive | Luke Wroblewski | Design for smallest viewport first; expand progressively | DESIGNER |
| P-066 | Component Variant System | Brad Frost / Figma community | All component states/configs as explicit variants; no one-off modifications | DESIGNER |

---

*Total unique patterns: 66*
*Cross-reference: FRAMEWORKS_INDEX.md, MASTER_INDEX.md*
