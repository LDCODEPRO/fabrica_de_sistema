# QA_AGENT — Learning Notes

## Overview
Observations, lessons learned, synthesis notes, and evolving insights gathered from real projects, reading, and community discussions. This is a living document.

---

## On the Nature of Testing

**Note 1 — Testing is not the same as checking.**
James Bach and Michael Bolton draw a sharp distinction: *checking* is automated verification against known conditions (pass/fail). *Testing* is human investigation — asking questions the system hasn't been asked before. Both are valuable, but confusing them impoverishes the discipline. Automated suites check; skilled testers test.

**Note 2 — A passing test suite is not evidence that the software works.**
It is evidence that the software behaves as the tests expect. The tests themselves may be wrong, incomplete, or testing the wrong things. This is why exploratory testing remains essential even with high code coverage.

**Note 3 — The goal of testing is to find information, not to prove quality.**
Myers said it in 1979: testing is the process of *finding defects*. A test that finds no bugs is not necessarily a good test — it may simply be a test that doesn't look hard enough. Design tests with the explicit intent to break the system.

---

## On TDD

**Note 4 — TDD changes the design before it changes the tests.**
The most important benefit of TDD is not the test suite; it's the pressure it puts on design. Code that is hard to test under TDD is code that is too tightly coupled, has too many responsibilities, or has hidden dependencies. TDD surfaces these problems immediately. Source: Kent Beck, *TDD: By Example*, introduction.

**Note 5 — The refactor step is where TDD's value compounds.**
Most practitioners master Red and Green quickly. The Refactor step is harder and more important: eliminating duplication, clarifying naming, extracting responsibilities. Skipping it accumulates design debt even in TDD projects.

---

## On BDD and Collaboration

**Note 6 — Gherkin is a communication tool, not a test tool.**
The point of Given/When/Then is to create a shared language between Product, Dev, and QA. When only QA writes the scenarios, BDD fails. When all three collaborate on scenario writing (the "Three Amigos" practice), it succeeds. Source: Gojko Adzic, *Specification by Example*.

**Note 7 — Living documentation rots if not maintained.**
BDD scenarios that are not kept synchronized with evolving requirements quickly become misleading. Outdated passing tests are among the most dangerous artifacts in a test suite: they signal correctness where none exists.

---

## On Test Automation

**Note 8 — The test pyramid is a budget, not a dogma.**
Martin Fowler's pyramid is guidance for allocating testing effort: more unit tests because they're cheap; fewer E2E tests because they're expensive and fragile. Context matters. An integration-heavy system (microservices, third-party APIs) may need a relatively thicker middle layer. The principle: keep the bulk of tests at the layer where feedback is fastest and most reliable.

**Note 9 — Flaky tests are a quality signal, not just an inconvenience.**
A test that fails intermittently reveals a real problem: a race condition, environment dependency, timing assumption, or hidden shared state. Quarantining a flaky test is a temporary measure; understanding and fixing the root cause is the obligation.

**Note 10 — Selector stability is the primary challenge of UI test automation.**
CSS classes and element IDs change constantly during UI development. The most resilient selectors use purpose-built `data-testid` attributes that are stable across visual redesigns. Agree on this convention with the development team from day one.

---

## On Defects

**Note 11 — The cost of defects rises exponentially with time.**
IBM Systems Sciences Institute research (frequently cited in ISTQB materials) shows that a defect found in requirements costs 1x to fix; in design, ~6x; in testing, ~15x; in production, ~100x. Early testing and shift-left practices are not just good practice — they are economically rational.

**Note 12 — Severity and priority must be tracked separately.**
A low-severity cosmetic bug on the home page (a misspelled word) may be P1 — business priority — because the CMO sees it every day. A Critical-severity crash on a rarely-used admin screen may be P3. Conflating the two leads to poor resource allocation.

---

## On Risk

**Note 13 — Risk-based testing is the answer to "we don't have time to test everything."**
The answer to resource constraints is not to test less — it is to test smarter. Identify the highest-risk areas (high probability × high impact) and concentrate effort there. ISTQB Foundation Level, Chapter 5 (Test Management).

---

## On Exploratory Testing

**Note 14 — Charters focus exploration; they do not restrict it.**
A session charter ("Explore the payment flow to find data persistence failures") provides direction but should not prevent a tester from following an interesting anomaly. The charter is a starting point, not a cage. If the anomaly is outside scope, log it and return.

**Note 15 — The most productive exploratory testing happens when the tester knows the system well.**
Domain knowledge, user empathy, and understanding of system architecture all amplify a tester's ability to find meaningful defects. Onboarding testers to the product is an investment with direct quality returns.

---

## Sources
All references trace to `SOURCE_INDEX.md`.
