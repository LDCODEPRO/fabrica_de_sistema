# QA_AGENT — Tools and Standards

## Overview
The tools, platforms, and standards that QA_AGENT uses or recommends for testing activities across projects.

---

## Test Automation Frameworks

### Jest
- **Type:** JavaScript unit and integration testing framework.
- **Developed by:** Meta (Facebook).
- **Website:** jestjs.io
- **Use cases:** Unit tests for Node.js and React applications. Built-in mocking, code coverage, and snapshot testing.
- **Key features:** Zero-config setup, parallel test execution, `describe`/`it`/`expect` API, `jest.mock()` for module mocking.
- **In the stack:** Primary unit testing tool for JavaScript/TypeScript projects.

### Cypress
- **Type:** End-to-end testing framework for web applications.
- **Website:** cypress.io
- **Use cases:** Browser-based functional and E2E tests. Integration and component testing.
- **Key features:** Real-time browser execution, time-travel debugging, automatic waiting (no explicit `sleep` calls), network request interception via `cy.intercept()`.
- **In the stack:** Primary E2E testing tool for web frontends.

### Selenium WebDriver
- **Type:** Browser automation library.
- **Standard:** W3C WebDriver specification.
- **Website:** selenium.dev
- **Use cases:** Cross-browser automated UI testing. Supports Java, Python, C#, JavaScript, and more.
- **Key features:** Wide browser support (Chrome, Firefox, Safari, Edge), integration with TestNG, JUnit, and PyTest.
- **Note:** More setup-intensive than Cypress; preferred when cross-browser coverage or non-Chromium browsers are required.

### Playwright
- **Type:** End-to-end browser automation framework.
- **Developed by:** Microsoft.
- **Website:** playwright.dev
- **Use cases:** Cross-browser E2E testing (Chromium, Firefox, WebKit). Faster and more reliable than Selenium for modern web apps.
- **Key features:** Auto-waiting, network interception, parallel execution, browser context isolation.

---

## API Testing

### Postman
- **Type:** API development and testing platform.
- **Website:** postman.com
- **Use cases:** Manual and automated REST and GraphQL API testing. Collections can be run in CI via Newman (Postman's CLI runner).
- **Key features:** Collection Runner, Environment variables, Pre-request scripts, Test scripts (JavaScript), Newman CLI.

### REST-assured (Java)
- **Type:** Java DSL for testing REST services.
- **Website:** rest-assured.io
- **Use cases:** Integration and contract testing of REST APIs in Java projects.

---

## Performance Testing

### Apache JMeter
- **Type:** Open-source load testing and performance measurement tool.
- **Developed by:** Apache Software Foundation.
- **Website:** jmeter.apache.org
- **Use cases:** Load testing HTTP/HTTPS APIs, web applications, databases, FTP servers.
- **Key features:** Thread groups to simulate concurrent users, listeners for real-time reporting, integration with CI pipelines via CLI (`jmeter -n -t plan.jmx`).

### k6
- **Type:** Modern open-source load testing tool.
- **Developed by:** Grafana Labs.
- **Website:** k6.io
- **Use cases:** Performance and stress testing of APIs and microservices. Script in JavaScript.
- **Key features:** Developer-friendly, CI-native, outputs to InfluxDB/Grafana for dashboards.

---

## Coverage and Static Analysis

### Istanbul / nyc
- **Type:** JavaScript code coverage tool (Istanbul is the library; nyc is its CLI).
- **Website:** github.com/istanbuljs/nyc
- **Use cases:** Measures statement, branch, function, and line coverage for JavaScript/TypeScript projects. Integrated with Jest.

### SonarQube
- **Type:** Continuous code quality and security inspection platform.
- **Website:** sonarqube.org
- **Use cases:** Static analysis for code smells, bugs, security vulnerabilities, and coverage enforcement. Supports quality gates (build fails if thresholds not met).

---

## Bug Tracking

### Jira (Atlassian)
- **Type:** Issue and project tracking platform.
- **Website:** atlassian.com/software/jira
- **Use cases:** Defect lifecycle management, sprint planning, test cycle tracking (via Zephyr or Xray plugins).

### GitHub Issues
- **Type:** Lightweight issue tracker integrated with GitHub.
- **Use cases:** Bug reporting and tracking for projects hosted on GitHub. Linked directly to pull requests and commits.

---

## Standards

### ISTQB Syllabus (v4.0, 2023)
- Defines standard testing terminology, processes, and techniques.
- **Source:** istqb.org

### IEEE 829-2008
- Standard for software and system test documentation.
- **Source:** IEEE Standards Association.

### W3C WebDriver Specification
- Defines the protocol implemented by Selenium WebDriver and Playwright.
- **Source:** w3.org/TR/webdriver/

---

## Sources
All references trace to `SOURCE_INDEX.md`.
