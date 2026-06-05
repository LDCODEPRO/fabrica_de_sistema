# DEVELOPER_AGENT — Best Practices

> Domain: Clean Code, Refactoring, Design Patterns, TDD, SOLID, Code Quality
> Last updated: 2026-06-05

---

## 1. Write Code for Humans First

- Code is read far more often than it is written. Optimize for the reader.
- Names of variables, functions, and classes must reveal intent. Avoid abbreviations, single-letter names (except conventional loop counters), and misleading names.
- A function name should describe what it does, not how it does it.
- Reference: Robert C. Martin, *Clean Code* (2008), Chapter 2 ("Meaningful Names"), Chapter 3 ("Functions").

## 2. Functions Must Do One Thing

- A function should do one thing, do it well, and do it only.
- If a function does more than one thing, extract the additional responsibilities into separate functions.
- Keep functions short: aim for fewer than 20 lines; anything longer is a sign of mixed responsibilities.
- Avoid flag arguments (boolean parameters that alter function behavior); split into two functions instead.
- Reference: Robert C. Martin, *Clean Code* (2008), Chapter 3.

## 3. Apply SOLID Principles

- **S — Single Responsibility Principle (SRP):** A class should have only one reason to change.
- **O — Open/Closed Principle (OCP):** Classes should be open for extension but closed for modification. Use interfaces and polymorphism.
- **L — Liskov Substitution Principle (LSP):** Subtypes must be substitutable for their base types without altering the correctness of the program.
- **I — Interface Segregation Principle (ISP):** Clients should not be forced to depend on interfaces they do not use. Split fat interfaces.
- **D — Dependency Inversion Principle (DIP):** High-level modules should not depend on low-level modules. Both should depend on abstractions.
- Reference: Robert C. Martin, *Agile Software Development, Principles, Patterns, and Practices* (2002); *Clean Architecture* (2017), Part III.

## 4. Test-Driven Development (TDD) Cycle

- Write a failing test before writing any production code (Red).
- Write the minimum production code to make the test pass (Green).
- Refactor the code to improve its design without changing behavior (Refactor).
- Tests must be fast, independent, repeatable, self-validating, and timely (F.I.R.S.T. principles).
- Reference: Kent Beck, *Test-Driven Development: By Example* (2002).

## 5. Refactor Continuously

- Refactoring is not a separate phase — it is part of the daily development workflow.
- Never refactor and add features in the same commit; keep changes separated for clarity and traceability.
- Use automated refactoring tools (IDE support) to reduce the risk of introducing defects.
- Always have a passing test suite before refactoring; the tests are the safety net.
- Reference: Martin Fowler, *Refactoring: Improving the Design of Existing Code* (2nd ed., 2018).

## 6. Eliminate Code Smells

- Common smells to watch for: Long Method, Large Class, Duplicate Code, Feature Envy, Data Clumps, Primitive Obsession, Switch Statements, Parallel Inheritance Hierarchies, Dead Code, Speculative Generality.
- Each smell has one or more refactoring techniques as a remedy (Extract Method, Extract Class, Replace Conditional with Polymorphism, etc.).
- Reference: Martin Fowler, *Refactoring* (2018), Chapter 3 ("Bad Smells in Code").

## 7. The Boy Scout Rule

- Leave the code cleaner than you found it.
- Small incremental improvements compound over time; they prevent the accumulation of technical debt.
- Reference: Robert C. Martin, *Clean Code* (2008), Chapter 1.

## 8. Comments Are a Last Resort

- Good code should be self-explanatory. When a comment seems necessary, first ask whether the code can be rewritten to make the comment unnecessary.
- Legal comments, TODO markers, and amplification of non-obvious intent are acceptable.
- Never leave commented-out code in the repository; delete it and rely on version control.
- Reference: Robert C. Martin, *Clean Code* (2008), Chapter 4 ("Comments").

## 9. Error Handling is Not an Afterthought

- Use exceptions rather than return codes for signaling errors.
- Do not return or pass null; use the Null Object pattern or Optional types.
- Provide context in exception messages: what was being attempted, what failed, and why.
- Reference: Robert C. Martin, *Clean Code* (2008), Chapter 7 ("Error Handling").

## 10. Version Control Hygiene

- Commit small, focused changes. One commit = one logical change.
- Write commit messages in the imperative mood: "Add user authentication" not "Added user authentication."
- Never commit broken code to a shared branch.
- Use feature branches and pull requests with code review before merging to main.
- Reference: The Pragmatic Programmer, Andrew Hunt & David Thomas (2019), Chapter 5 ("Bend or Break").

## 11. DRY — Don't Repeat Yourself

- Every piece of knowledge must have a single, unambiguous, authoritative representation in the system.
- Duplication leads to divergence; when one copy is updated, the other is forgotten.
- DRY applies not just to code but to data schemas, build scripts, and documentation.
- Reference: Andrew Hunt & David Thomas, *The Pragmatic Programmer* (1999/2019), Tip 11.

## 12. Code Review Standards

- Every change to production code must be reviewed by at least one other developer.
- Reviews should check: correctness, test coverage, naming clarity, SOLID compliance, security, and performance.
- Use static analysis tools (SonarQube, ESLint, Checkstyle) to automate the mechanical checks, freeing reviewers to focus on design.
- Reference: Best practices documented by Google (google.github.io/eng-practices).

---

*All references are indexed in SOURCE_INDEX.md.*
