# DEVELOPER_AGENT — Frameworks and Methods

> Domain: Clean Code, Refactoring, Design Patterns, TDD, SOLID, Code Quality
> Last updated: 2026-06-05

---

## 1. SOLID Principles

**Origin:** Robert C. Martin; first published in *Agile Software Development, Principles, Patterns, and Practices* (2002).

### Single Responsibility Principle (SRP)
> "A class should have one, and only one, reason to change."

- A "reason to change" corresponds to a stakeholder group or actor that could request changes.
- Violations look like: classes that mix persistence logic with business rules; report generators that also format output.
- Remedy: Extract Class, Move Method.

### Open/Closed Principle (OCP)
> "Software entities should be open for extension but closed for modification."

- New behavior should be added by writing new code, not by changing existing code.
- Achieved through abstractions (interfaces, abstract classes) and polymorphism.
- Violations look like: large switch/if-else chains that must be modified to add new behavior.
- Remedy: Replace Conditional with Polymorphism; use the Strategy pattern.

### Liskov Substitution Principle (LSP)
> "Subtypes must be substitutable for their base types."

- A subclass must not strengthen preconditions, weaken postconditions, or violate base class invariants.
- Classic violation: Square subclassing Rectangle and overriding setWidth/setHeight.
- Violations reveal flawed inheritance hierarchies; the remedy is often to favor composition.

### Interface Segregation Principle (ISP)
> "Clients should not be forced to depend on interfaces they do not use."

- Large, monolithic interfaces force implementing classes to provide meaningless stubs.
- Split fat interfaces into smaller, role-specific interfaces (role interfaces).
- Remedy: Extract Interface.

### Dependency Inversion Principle (DIP)
> "High-level modules should not depend on low-level modules. Both should depend on abstractions."

- Details (implementations) should depend on abstractions, not the other way around.
- Applied via constructor injection or parameter injection (Dependency Injection).
- Enables testability: swap real implementations for test doubles.

---

## 2. Test-Driven Development (TDD)

**Origin:** Kent Beck, *Test-Driven Development: By Example* (2002).

### The Three Laws of TDD (Robert C. Martin)
1. You may not write production code until you have written a failing unit test.
2. You may not write more of a unit test than is sufficient to fail.
3. You may not write more production code than is sufficient to make the currently failing test pass.

### Red-Green-Refactor Cycle
```
RED    → Write a failing test that describes desired behavior.
GREEN  → Write the minimum code to make the test pass.
REFACTOR → Improve the code's design without changing behavior.
```

### F.I.R.S.T. Principles for Unit Tests (Robert C. Martin)
| Principle | Meaning |
|---|---|
| Fast | Tests must run quickly (milliseconds); slow tests are not run. |
| Independent | Tests must not depend on each other; any test can run in isolation. |
| Repeatable | Tests must produce the same result in any environment. |
| Self-Validating | Tests must return a boolean result (pass/fail); no manual inspection. |
| Timely | Tests should be written just before the production code they test. |

### Test Doubles (Martin Fowler taxonomy)
| Type | Description |
|---|---|
| Dummy | Passed around but never used; fills parameter lists. |
| Stub | Returns canned answers; no logic, just pre-programmed responses. |
| Spy | A stub that also records information about how it was called. |
| Mock | Pre-programmed with expectations; verifies interactions. |
| Fake | Has a working implementation, but simplified (e.g., in-memory database). |

**Reference:** Martin Fowler, "Mocks Aren't Stubs" (martinfowler.com).

### Test Pyramid (Mike Cohn)
```
        /\
       /  \  E2E Tests (few, slow, expensive)
      /----\
     /      \ Integration Tests
    /--------\
   /          \ Unit Tests (many, fast, cheap)
  /____________\
```
- The majority of tests should be fast unit tests; fewer integration tests; even fewer end-to-end tests.
- Reference: Mike Cohn, *Succeeding with Agile* (2009).

---

## 3. Refactoring

**Origin:** Martin Fowler, *Refactoring: Improving the Design of Existing Code* (1st ed. 1999, 2nd ed. 2018).

### Core Refactoring Techniques (selected catalog)

| Technique | Smell it Treats | What it Does |
|---|---|---|
| Extract Method | Long Method | Move code fragment into a new method with a descriptive name. |
| Inline Method | Unnecessary indirection | Replace a method call with the method body. |
| Extract Class | Large Class, Divergent Change | Move related fields and methods to a new class. |
| Move Method | Feature Envy | Move a method to the class whose data it most uses. |
| Replace Temp with Query | Long Method, Lazy Lazy | Replace temp variable with a method call. |
| Introduce Parameter Object | Data Clumps | Replace a group of parameters with a single object. |
| Replace Conditional with Polymorphism | Switch Statements | Use subclasses/strategy to eliminate type-checking conditionals. |
| Rename Variable/Method/Class | Misleading Names | Give the element a name that reveals its intent. |
| Replace Magic Literal | Primitive Obsession | Introduce a named constant or enum. |
| Decompose Conditional | Complex Conditional | Extract condition and branches into methods. |

### The Mechanics of Safe Refactoring
1. Ensure test coverage before touching the code.
2. Make one small change at a time.
3. Run tests after every change.
4. Commit when tests are green.
5. Never refactor and add features in the same commit.

---

## 4. Design Patterns (GoF)

**Origin:** Gamma, Helm, Johnson, Vlissides, *Design Patterns* (1994).

### Creational Patterns

| Pattern | Intent |
|---|---|
| Factory Method | Define an interface for creating an object, but let subclasses decide which class to instantiate. |
| Abstract Factory | Provide an interface for creating families of related objects without specifying their concrete classes. |
| Builder | Separate the construction of a complex object from its representation. |
| Singleton | Ensure a class has only one instance and provide a global point of access. |
| Prototype | Create new objects by copying an existing object. |

### Structural Patterns

| Pattern | Intent |
|---|---|
| Adapter | Convert the interface of a class into another interface clients expect. |
| Decorator | Attach additional responsibilities to an object dynamically. |
| Facade | Provide a simplified interface to a complex subsystem. |
| Composite | Compose objects into tree structures to represent part-whole hierarchies. |
| Proxy | Provide a surrogate or placeholder for another object to control access. |

### Behavioral Patterns

| Pattern | Intent |
|---|---|
| Strategy | Define a family of algorithms, encapsulate each, and make them interchangeable. |
| Observer | Define a one-to-many dependency so when one object changes state, all dependents are notified. |
| Command | Encapsulate a request as an object, allowing parameterization and queuing of requests. |
| Template Method | Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. |
| Iterator | Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation. |
| State | Allow an object to alter its behavior when its internal state changes. |

---

## 5. Continuous Integration (CI)

**Origin:** Kent Beck and Martin Fowler; documented in Martin Fowler's article "Continuous Integration" (2006).

### Core Practices
- Maintain a single shared repository (version control).
- Automate the build.
- Make the build self-testing.
- Every commit to main triggers a build.
- Fix broken builds immediately — the pipeline is the team's priority.
- Keep the build fast (target: under 10 minutes for the full CI pipeline).

### CI Tooling
- **GitHub Actions** — YAML-based workflows integrated with GitHub repositories.
- **GitLab CI/CD** — Built-in CI/CD pipelines for GitLab repositories.
- **Jenkins** — Self-hosted, plugin-rich CI server.

---

## 6. Semantic Versioning (SemVer)

**Origin:** Tom Preston-Werner; semver.org.

**Format:** `MAJOR.MINOR.PATCH`

| Segment | When to increment |
|---|---|
| MAJOR | Incompatible API changes. |
| MINOR | New backward-compatible functionality. |
| PATCH | Backward-compatible bug fixes. |

- Pre-release: `1.0.0-alpha.1`, `1.0.0-beta.2`, `1.0.0-rc.1`.
- Build metadata: `1.0.0+build.20260605`.

---

*All references are indexed in SOURCE_INDEX.md.*
