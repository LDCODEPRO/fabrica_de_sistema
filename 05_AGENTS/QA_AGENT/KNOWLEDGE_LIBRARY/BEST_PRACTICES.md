# QA_AGENT — Best Practices

## Overview
This file documents the core best practices adopted by QA_AGENT for software quality assurance across all projects in the Fábrica de Sistemas.

---

## 1. Test Planning and Strategy

- **Define a Test Plan before coding begins.** A test plan must include scope, objectives, entry/exit criteria, test types, environment requirements, and schedule. Reference: IEEE 829 standard for test documentation.
- **Apply the Test Pyramid.** Prioritize a large base of unit tests, a middle layer of integration tests, and a small top layer of end-to-end tests. This reduces cost and execution time. Reference: Martin Fowler's Test Pyramid.
- **Establish Quality Gates.** Define measurable thresholds (e.g., minimum 80% code coverage, zero critical open defects) that must be met before a build can advance in the pipeline.

## 2. Writing Tests

- **Tests must be independent and repeatable.** No test should depend on the execution order of other tests or on mutable shared state.
- **Follow the AAA pattern:** Arrange, Act, Assert. Each test should have a clear setup, a single action, and a single assertion.
- **Use descriptive test names.** Names must communicate intent: `should_return_404_when_user_not_found` is better than `test1`.
- **Avoid testing implementation details.** Tests should verify behavior and outputs, not internal method calls.
- **Cover edge cases and boundary values.** Equivalence partitioning and boundary value analysis (ISTQB techniques) are mandatory for input validation scenarios.

## 3. Test Automation

- **Automate regression tests first.** Stable, high-value, frequently executed tests are the best candidates for automation.
- **Keep automated tests fast.** Unit tests must run in milliseconds. Slow tests discourage frequent execution.
- **Use Page Object Model (POM) for UI tests.** Centralizes selectors and actions, reducing maintenance cost when the UI changes.
- **Do not automate everything.** Exploratory testing, usability checks, and one-off investigations are better performed manually. Reference: James Bach and Michael Bolton on context-driven testing.

## 4. Defect Management

- **Classify bugs by Severity and Priority.** Severity measures technical impact; Priority measures business urgency. They are not the same.
  - Severity levels: Critical, High, Medium, Low.
  - Priority levels: P1 (Immediate), P2 (High), P3 (Medium), P4 (Low).
- **Write clear, reproducible bug reports.** Every defect must include: summary, steps to reproduce, expected result, actual result, environment, and attachments (screenshots/logs).
- **Never close a bug without a verified fix.** QA must re-test in the same environment where the defect was found.

## 5. Exploratory Testing

- **Use structured sessions with time boxes.** Charter-based exploratory testing (James Bach's Session-Based Test Management — SBTM) organizes exploration without losing rigor.
- **Document findings in real time.** Notes, screenshots, and debrief summaries from exploratory sessions are part of the test record.
- **Pair exploratory testing with risk-based thinking.** Focus exploration on areas with the highest probability and impact of failure.

## 6. Acceptance Criteria and BDD

- **Acceptance criteria must be defined before development begins.** Using the Given/When/Then format (BDD) creates shared understanding between Product, Dev, and QA.
- **Acceptance criteria are not test cases.** They define the contract; test cases operationalize it.
- **Use ATDD (Acceptance Test-Driven Development)** to align automated acceptance tests with business requirements from the start.

## 7. Continuous Integration

- **All tests must run on every pull request.** CI pipelines must include unit, integration, and smoke tests as mandatory checks.
- **Flaky tests must be fixed immediately or quarantined.** A flaky test is worse than no test: it erodes trust in the entire suite.
- **Test results must be reported and visible.** Use dashboards or CI reports so the whole team can see quality status.

---

## Sources
All references trace to `SOURCE_INDEX.md`.
