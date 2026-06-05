# QA_AGENT — Applied Patterns

## Overview
Recurring patterns, heuristics, and templates that QA_AGENT applies to common testing situations. Derived from the works of Myers, Kaner, Bach, Meszaros, Fowler, and ISTQB.

---

## Pattern 1: The AAA Test Structure (Arrange-Act-Assert)

**Context:** Writing any automated unit or integration test.

**Structure:**
```
// Arrange: set up the state and inputs
const user = new User({ id: 1, role: 'admin' });

// Act: execute the behavior under test
const result = user.canDeletePost(post);

// Assert: verify the outcome
expect(result).toBe(true);
```

**Rule:** One test = one behavior = one assertion (or one logical concept).
**Source:** Gerard Meszaros, *xUnit Test Patterns*.

---

## Pattern 2: Test Doubles (Mocks, Stubs, Fakes, Spies)

**Context:** Isolating a unit under test from its dependencies.

| Double Type | Definition | When to Use |
|---|---|---|
| **Stub** | Returns hardcoded values; no verification | Isolating a dependency to control input |
| **Mock** | Verifies that specific calls were made | Testing that a side effect occurred (e.g., email sent) |
| **Fake** | Working implementation, simplified (e.g., in-memory DB) | Integration tests needing a fast alternative to real infra |
| **Spy** | Wraps real object, records calls | Observing behavior without full replacement |

**Source:** Gerard Meszaros, *xUnit Test Patterns*, Chapter 11.

---

## Pattern 3: Page Object Model (POM) for UI Tests

**Context:** Automating browser-based tests with Cypress or Selenium.

**Structure:**
- Create one class per page or major UI component.
- All element selectors live inside the Page Object.
- Tests call methods on the Page Object, never interact with selectors directly.

```javascript
// LoginPage.js (Page Object)
class LoginPage {
  visit() { cy.visit('/login'); }
  fillEmail(email) { cy.get('[data-testid="email"]').type(email); }
  fillPassword(pw) { cy.get('[data-testid="password"]').type(pw); }
  submit() { cy.get('[data-testid="submit"]').click(); }
}

// login.spec.js (Test)
const loginPage = new LoginPage();
loginPage.visit();
loginPage.fillEmail('user@example.com');
loginPage.fillPassword('secret');
loginPage.submit();
cy.url().should('include', '/dashboard');
```

**Benefit:** When the UI changes, only the Page Object needs updating; tests remain intact.

---

## Pattern 4: Equivalence Partitioning + Boundary Value Analysis

**Context:** Designing test cases for any input field or parameter.

**Steps:**
1. Identify valid and invalid equivalence classes.
2. Pick one representative value per class.
3. Add boundary values (min, max, min-1, max+1).

**Example — Age field (valid range: 18–120):**
| Partition | Test Value | Expected |
|---|---|---|
| Below minimum | 17 | Rejected |
| Minimum boundary | 18 | Accepted |
| Valid mid-range | 40 | Accepted |
| Maximum boundary | 120 | Accepted |
| Above maximum | 121 | Rejected |
| Non-numeric | "abc" | Rejected |

**Source:** ISTQB CTFL Syllabus v4.0, Section 4.2.

---

## Pattern 5: Exploratory Testing Charter

**Context:** Initiating a structured exploratory testing session (James Bach / SBTM).

**Template:**
```
Charter: Explore [AREA] to discover [RISK/QUESTION]
Time Box: 60 minutes
Tester: [Name]
Environment: [Staging / Production-mirror]
Notes: [Findings, questions, anomalies observed during session]
Issues Found: [Links to bugs filed]
Coverage Achieved: [What was exercised]
```

**Debrief questions:**
- What did you test?
- What problems did you find?
- What didn't you test (and why)?

---

## Pattern 6: Bug Report Template

**Context:** Reporting any defect found during testing.

**Template:**
```
Title: [Short, descriptive summary — what fails and where]
Severity: [Critical / High / Medium / Low]
Priority: [P1 / P2 / P3 / P4]
Environment: [OS, Browser, App Version, Test Environment]

Steps to Reproduce:
1.
2.
3.

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Attachments:
- Screenshot / Video
- Console logs
- Network request/response

Regression: [Was this working in a previous version?]
```

**Severity vs. Priority:**
- **Severity** = technical impact (Critical = app crash / data loss).
- **Priority** = business urgency (P1 = must fix before release).

---

## Pattern 7: Quality Gate Checklist

**Context:** Before promoting a build from any stage to the next.

```
[ ] All unit tests pass (0 failures)
[ ] All integration tests pass
[ ] Code coverage >= 80% (or agreed threshold)
[ ] No new Critical or High severity open bugs
[ ] SonarQube quality gate: passed
[ ] Smoke test suite: passed on target environment
[ ] Performance benchmarks within acceptable thresholds
[ ] Security scan: no new High/Critical findings
```

---

## Pattern 8: Given/When/Then Scenario Template (BDD)

**Context:** Writing acceptance criteria or automated BDD scenarios.

```gherkin
Feature: User login

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    And the user has a registered account with email "user@example.com"
    When the user enters email "user@example.com" and password "correct-password"
    And the user clicks the login button
    Then the user should be redirected to the dashboard
    And the welcome message should display "Welcome, User"

  Scenario: Failed login with incorrect password
    Given the user is on the login page
    When the user enters email "user@example.com" and password "wrong-password"
    And the user clicks the login button
    Then the user should see the error message "Invalid email or password"
    And the user should remain on the login page
```

**Source:** Matt Wynne & Aslak Hellesøy, *The Cucumber Book*.

---

## Sources
All references trace to `SOURCE_INDEX.md`.
