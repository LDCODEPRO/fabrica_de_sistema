# QA_AGENT — Frameworks and Methods

## Overview
Methodologies, frameworks, and process models that QA_AGENT uses to structure testing activities.

---

## 1. Test-Driven Development (TDD)

- **Origin:** Kent Beck, popularized through Extreme Programming (XP).
- **Cycle:** Red → Green → Refactor.
  1. **Red:** Write a failing test that describes desired behavior.
  2. **Green:** Write the minimum code to make the test pass.
  3. **Refactor:** Improve the code without changing behavior; tests must still pass.
- **Benefits:** Forces testable design, creates a regression suite automatically, documents intended behavior in executable form.
- **Scope:** Unit-level tests; most effective at the class/function level.

## 2. Behavior-Driven Development (BDD)

- **Origin:** Dan North, evolved from TDD.
- **Syntax:** Given/When/Then (Gherkin language, used by Cucumber and SpecFlow).
  - **Given:** precondition / initial context.
  - **When:** the action or event.
  - **Then:** the expected outcome.
- **Purpose:** Creates shared understanding between Product Owners, Developers, and QA through executable specifications written in natural language.
- **Key tools:** Cucumber (Java, Ruby, JavaScript), SpecFlow (.NET), Behave (Python).

## 3. Acceptance Test-Driven Development (ATDD)

- **Origin:** Evolved from BDD and XP; closely associated with Gojko Adzic's *Specification by Example*.
- **Process:** Acceptance criteria are agreed upon and written as automated tests *before* development starts. Development is complete only when all acceptance tests pass.
- **Relation to BDD:** ATDD focuses on the process (agreeing on tests first); BDD focuses on the language and collaboration style.

## 4. Exploratory Testing and Session-Based Test Management (SBTM)

- **Origin:** James Bach.
- **Structure:**
  - **Charter:** A short mission statement defining what to explore and what to look for (e.g., "Explore the checkout flow to find data validation failures").
  - **Session:** A time-boxed testing period (typically 60–90 minutes) with no interruptions.
  - **Debrief:** Post-session review covering coverage, issues found, and remaining risks.
- **Metrics:** Session coverage (charters completed), defect density per session, areas not yet explored.
- **Reference:** James Bach, *Exploratory Testing Explained* (article); Elisabeth Hendrickson, *Explore It!*

## 5. Risk-Based Testing

- **Concept:** Prioritize testing effort based on the probability and impact of failure for each feature or component.
- **Process:**
  1. Identify risk items (features, modules, integrations).
  2. Assess probability of failure and impact if it fails.
  3. Assign a risk level (High / Medium / Low).
  4. Allocate test depth proportional to risk level.
- **Standard:** ISTQB Foundation Level syllabus defines risk-based testing as a core test management technique.

## 6. The Test Pyramid (Martin Fowler)

- **Model:** Three layers of automated tests, ordered by quantity and execution speed.
  - **Unit Tests (base):** Many, fast, isolated. Test individual functions/classes.
  - **Integration Tests (middle):** Fewer, test interactions between components (e.g., service + database).
  - **End-to-End Tests (top):** Few, slow, test full user workflows through the UI.
- **Anti-pattern to avoid:** The Ice Cream Cone (many slow E2E tests, few unit tests).
- **Reference:** Martin Fowler, "TestPyramid" article, martinfowler.com.

## 7. Agile Testing Quadrants (Lisa Crispin & Janet Gregory)

- **Model:** A 2×2 matrix mapping testing types to two axes:
  - Axis 1: Business-facing vs. Technology-facing.
  - Axis 2: Supporting the team (guiding development) vs. Critiquing the product (finding problems).
- **Four Quadrants:**
  - Q1 (Technology-facing, supporting team): Unit tests, component tests (TDD).
  - Q2 (Business-facing, supporting team): Functional tests, story tests, BDD scenarios.
  - Q3 (Business-facing, critiquing product): Exploratory testing, usability, UAT.
  - Q4 (Technology-facing, critiquing product): Performance, security, load testing.
- **Reference:** *Agile Testing*, Crispin & Gregory, Chapter 6.

## 8. IEEE 829 — Standard for Test Documentation

- **Standard:** IEEE 829-2008 (also known as ANSI/IEEE 829).
- **Documents defined:**
  - Test Plan
  - Test Design Specification
  - Test Case Specification
  - Test Procedure Specification
  - Test Item Transmittal Report
  - Test Log
  - Test Incident Report
  - Test Summary Report
- **Usage:** QA_AGENT uses IEEE 829 as the structural baseline for test artifacts, adapting formality to project context.

## 9. Equivalence Partitioning and Boundary Value Analysis

- **Origin:** Classic black-box test design techniques; documented by Myers and formalized in the ISTQB syllabus.
- **Equivalence Partitioning:** Divide input data into partitions where all values in a partition are expected to behave the same. Test one value per partition.
- **Boundary Value Analysis:** Test at the edges of partitions (minimum, maximum, just inside, just outside). Most defects occur at boundaries.

## 10. ISTQB Testing Levels

- **Unit Testing:** Isolated component testing, typically by developers.
- **Integration Testing:** Testing interfaces and interactions between components.
- **System Testing:** Testing the complete, integrated system against requirements.
- **Acceptance Testing:** User Acceptance Testing (UAT); confirms the system meets business needs.

---

## Sources
All references trace to `SOURCE_INDEX.md`.
