# DEVELOPER_AGENT — Applied Patterns

> Domain: Clean Code, Refactoring, Design Patterns, TDD, SOLID, Code Quality
> Last updated: 2026-06-05

---

## Creational Patterns (GoF)

### Factory Method
- **Intent:** Define an interface for creating an object, but let subclasses decide which class to instantiate.
- **When to use:** When the exact type of object to create is determined at runtime; when a class wants to delegate instantiation to subclasses.
- **SOLID connection:** Supports OCP — new product types are added by creating new subclasses, not modifying existing code.
- **Reference:** GoF, *Design Patterns* (1994), p. 107.

### Builder
- **Intent:** Separate the construction of a complex object from its representation so that the same construction process can create different representations.
- **When to use:** When a constructor would need many parameters (telescoping constructor antipattern); when object construction involves multiple steps.
- **Modern usage:** The Fluent Builder (method chaining) is the dominant form in Java and C#.
- **Reference:** GoF, *Design Patterns* (1994), p. 97; Joshua Bloch, *Effective Java* (2018), Item 2.

### Singleton
- **Intent:** Ensure a class has only one instance and provide a global access point.
- **When to use:** Sparingly. Singletons make testing difficult (global state) and violate SRP (managing their own lifecycle).
- **Preferred alternative:** Use dependency injection to inject shared instances rather than having classes self-manage their uniqueness.
- **Reference:** GoF, *Design Patterns* (1994), p. 127; Robert C. Martin, *Clean Code* (2008).

---

## Structural Patterns (GoF)

### Adapter
- **Intent:** Convert the interface of a class into another interface clients expect.
- **When to use:** Integrating third-party libraries or legacy code whose interfaces cannot be changed.
- **Forms:** Object adapter (composition) is preferred over class adapter (inheritance) for flexibility.
- **Reference:** GoF, *Design Patterns* (1994), p. 139.

### Decorator
- **Intent:** Attach additional responsibilities to an object dynamically. Provides a flexible alternative to subclassing for extending functionality.
- **When to use:** When you need to add behavior to individual objects without affecting others; when the number of combinations of behaviors would make subclassing impractical.
- **SOLID connection:** Supports OCP — new decorators extend behavior without modifying existing classes.
- **Reference:** GoF, *Design Patterns* (1994), p. 175.

### Facade
- **Intent:** Provide a simplified interface to a complex subsystem.
- **When to use:** To reduce coupling between clients and a subsystem; to provide a clean entry point to a set of classes.
- **Reference:** GoF, *Design Patterns* (1994), p. 185.

### Null Object
- **Intent:** Provide a default object with do-nothing behavior to avoid null checks.
- **When to use:** When null checks are scattered throughout the code and represent a valid "do nothing" case.
- **Benefits:** Eliminates NullPointerException risks; simplifies client code.
- **Reference:** Robert C. Martin, *Clean Code* (2008), Chapter 7; Martin Fowler, *Refactoring* (2018), "Introduce Special Case."

---

## Behavioral Patterns (GoF)

### Strategy
- **Intent:** Define a family of algorithms, encapsulate each one, and make them interchangeable.
- **When to use:** When you have multiple variants of an algorithm; when you need to eliminate large switch/if-else chains that select behavior based on type.
- **SOLID connection:** Embodies OCP and DIP simultaneously.
- **Reference:** GoF, *Design Patterns* (1994), p. 315.

### Observer
- **Intent:** Define a one-to-many dependency so that when one object changes state, all dependents are notified and updated automatically.
- **When to use:** When a change in one object requires changing others, and you don't know how many objects need to change.
- **Modern forms:** Event listeners in UI frameworks; reactive streams (RxJS, Project Reactor).
- **Reference:** GoF, *Design Patterns* (1994), p. 293.

### Command
- **Intent:** Encapsulate a request as an object, thereby allowing parameterization of clients with different requests, queuing, logging, and support for undoable operations.
- **When to use:** Implementing undo/redo; job queues; transaction logging.
- **Reference:** GoF, *Design Patterns* (1994), p. 233.

### Template Method
- **Intent:** Define the skeleton of an algorithm in an operation, deferring some steps to subclasses.
- **When to use:** When you have an algorithm whose overall structure is fixed but certain steps vary.
- **Caution:** Overuse leads to deep inheritance hierarchies; prefer Strategy (composition) when possible.
- **Reference:** GoF, *Design Patterns* (1994), p. 325.

---

## Code-Level Patterns and Techniques

### Guard Clause (Early Return)
- **Purpose:** Reduce nesting and improve readability by handling edge cases and preconditions at the top of a function, returning early.
- **Before:**
  ```
  if (user != null) {
    if (user.isActive()) {
      // main logic
    }
  }
  ```
- **After:**
  ```
  if (user == null) return;
  if (!user.isActive()) return;
  // main logic
  ```
- **Reference:** Martin Fowler, *Refactoring* (2018), "Replace Nested Conditional with Guard Clauses."

### Replace Primitive with Value Object
- **Purpose:** Wrap primitive types (strings, integers) that carry domain meaning in value objects that encapsulate validation and behavior.
- **Example:** Replace `String email` with an `Email` value object that validates on construction.
- **Reference:** Martin Fowler, *Refactoring* (2018), "Replace Primitive with Object"; Vaughn Vernon, *Domain-Driven Design Distilled* (2016).

### Dependency Injection (DI)
- **Purpose:** Supply dependencies to a class from the outside rather than having the class create them itself.
- **Forms:** Constructor injection (preferred), setter injection, interface injection.
- **Benefits:** Testability (inject test doubles), decoupling (depend on abstractions), flexibility (swap implementations).
- **SOLID connection:** Directly implements DIP.
- **Reference:** Robert C. Martin, *Clean Architecture* (2017); Martin Fowler, "InversionOfControl" (martinfowler.com).

### Object Mother / Test Data Builder
- **Purpose:** Create test fixtures for complex objects without duplicating construction logic across tests.
- **Object Mother:** A factory class that creates pre-configured test objects.
- **Test Data Builder:** A fluent builder for test objects, allowing customization of only the fields relevant to the test.
- **Reference:** Martin Fowler, "ObjectMother" (martinfowler.com); Nat Pryce, "Test Data Builders" blog post.

---

## Refactoring Patterns Applied

### Introduce Parameter Object
- **Smell:** Data Clumps — the same group of parameters appears in multiple method signatures.
- **Remedy:** Create a class that encapsulates the group of data.
- **Benefit:** Simplifies signatures; opens the door to moving behavior into the new class.

### Replace Conditional with Polymorphism
- **Smell:** Switch Statements / type-checking conditionals.
- **Remedy:** Create a class hierarchy or use the Strategy pattern; each case becomes a subclass or strategy.
- **SOLID connection:** Eliminates OCP violations.

### Extract Method
- **Smell:** Long Method, Duplicate Code, Comment Explaining a Code Block.
- **Remedy:** Identify a fragment with a clear purpose; extract it into a named method.
- **Rule of thumb:** If you need a comment to explain a block of code, that block should be a method with a name that replaces the comment.

---

*All references are indexed in SOURCE_INDEX.md.*
