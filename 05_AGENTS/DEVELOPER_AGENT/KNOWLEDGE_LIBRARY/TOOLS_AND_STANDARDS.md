# DEVELOPER_AGENT — Tools and Standards

> Domain: Clean Code, Refactoring, Design Patterns, TDD, SOLID, Code Quality
> Last updated: 2026-06-05

---

## 1. Version Control

### Git
- **Type:** Distributed version control system.
- **Author:** Linus Torvalds (initial release 2005).
- **Core workflows:** Feature Branch Workflow, Gitflow (Vincent Driessen, 2010), GitHub Flow (Scott Chacon, 2011), Trunk-Based Development.
- **Essential commands:** `git commit`, `git branch`, `git merge`, `git rebase`, `git cherry-pick`, `git bisect`, `git stash`.
- **Best practice:** Commit messages should follow the Conventional Commits specification (conventionalcommits.org): `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`.
- **Website:** git-scm.com

### GitHub
- **Type:** Git hosting platform with code review, CI/CD, and project management features.
- **Key features:** Pull Requests, GitHub Actions (CI/CD), GitHub Packages, Dependabot (dependency security updates).
- **Website:** github.com

### GitLab
- **Type:** Git hosting platform with integrated DevSecOps capabilities.
- **Key features:** Built-in CI/CD pipelines, Container Registry, Security scanning, GitLab Pages.
- **Website:** gitlab.com

---

## 2. Static Analysis and Linting

### ESLint
- **Type:** Pluggable JavaScript/TypeScript linter.
- **Use cases:** Enforce coding standards, catch common bugs (no-unused-vars, no-implicit-coercion), apply style rules, enforce SOLID-adjacent patterns.
- **Configuration:** `.eslintrc.json` or `eslint.config.js` (flat config, ESLint v9+).
- **Key plugins:** `eslint-plugin-unicorn`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-import`.
- **Website:** eslint.org

### SonarQube
- **Type:** Continuous code quality and security analysis platform.
- **Use cases:** Detect bugs, code smells, security vulnerabilities, and test coverage gaps across many languages (Java, JavaScript, TypeScript, Python, C#, etc.).
- **Metrics tracked:** Reliability Rating, Security Rating, Maintainability Rating, Code Coverage, Duplications, Technical Debt.
- **Integration:** GitHub Actions, Jenkins, GitLab CI.
- **Website:** sonarsource.com/products/sonarqube

### Checkstyle
- **Type:** Java static analysis tool for coding style.
- **Use cases:** Enforce Java naming conventions, Javadoc requirements, and formatting standards (e.g., Google Java Style Guide).
- **Website:** checkstyle.sourceforge.io

### Pylint / Flake8 / Ruff
- **Type:** Python static analysis and linting tools.
- **Ruff** — extremely fast Python linter written in Rust; replaces Flake8 and isort in modern Python projects.
- **Website:** astral.sh/ruff

---

## 3. Testing Frameworks

### Jest
- **Type:** JavaScript/TypeScript testing framework.
- **Author:** Facebook (Meta); now maintained by the open-source community.
- **Use cases:** Unit tests, integration tests, snapshot tests for React components.
- **Features:** Built-in mocking (`jest.fn()`, `jest.spyOn()`), code coverage reporting, parallel test execution.
- **Website:** jestjs.io

### JUnit 5 (JUnit Jupiter)
- **Type:** Java testing framework.
- **Use cases:** Unit and integration testing in Java; parameterized tests, test lifecycle extensions, nested test classes.
- **Website:** junit.org/junit5

### Pytest
- **Type:** Python testing framework.
- **Use cases:** Unit, integration, and functional testing; fixture-based setup; parameterization; plugins (pytest-cov, pytest-mock).
- **Website:** pytest.org

### Vitest
- **Type:** Vite-native testing framework for JavaScript/TypeScript.
- **Use cases:** Unit and component testing in Vite-based projects; API-compatible with Jest.
- **Website:** vitest.dev

### Testing Library (@testing-library)
- **Type:** Testing utilities for DOM-based UI frameworks (React, Vue, Angular).
- **Philosophy:** "The more your tests resemble the way your software is used, the more confidence they can give you." — Kent C. Dodds.
- **Website:** testing-library.com

---

## 4. Code Coverage

### Istanbul / nyc
- **Type:** JavaScript code coverage tool.
- **Use cases:** Measure statement, branch, function, and line coverage for JavaScript/TypeScript projects.
- **Integration:** Built into Jest; standalone via nyc for other test runners.

### JaCoCo
- **Type:** Java code coverage library.
- **Use cases:** Measure coverage in Java/Kotlin projects; integrates with Maven, Gradle, and SonarQube.
- **Website:** jacoco.org

---

## 5. Continuous Integration / Continuous Delivery

### GitHub Actions
- **Type:** YAML-based CI/CD platform integrated with GitHub.
- **Use cases:** Run tests on every pull request, enforce linting, generate code coverage reports, deploy to staging/production.
- **Key concepts:** Workflow files (`.github/workflows/`), triggers (`on: push`, `on: pull_request`), jobs, steps, actions (reusable units from the GitHub Marketplace).
- **Website:** docs.github.com/en/actions

### GitLab CI/CD
- **Type:** Built-in CI/CD engine for GitLab.
- **Key concepts:** `.gitlab-ci.yml`, stages, jobs, artifacts, environments.
- **Website:** docs.gitlab.com/ee/ci

---

## 6. Dependency Management and Security

### Dependabot
- **Type:** Automated dependency update tool built into GitHub.
- **Use cases:** Automatically open pull requests for outdated or vulnerable dependencies.
- **Website:** github.com/dependabot

### OWASP Dependency-Check
- **Type:** Software composition analysis tool.
- **Use cases:** Detect known vulnerabilities (CVEs) in project dependencies for Java, .NET, JavaScript, Python, and others.
- **Website:** owasp.org/www-project-dependency-check

### npm audit / yarn audit
- **Type:** Built-in vulnerability audit for Node.js package managers.
- **Use cases:** Scan `node_modules` for known vulnerabilities; integrate into CI pipelines.

---

## 7. Code Formatting

### Prettier
- **Type:** Opinionated code formatter for JavaScript, TypeScript, CSS, HTML, JSON, Markdown.
- **Philosophy:** Removes all formatting debates by enforcing a single, non-configurable style.
- **Website:** prettier.io

### Black
- **Type:** Opinionated Python code formatter.
- **Philosophy:** "The uncompromising code formatter" — zero configuration.
- **Website:** black.readthedocs.io

---

## 8. Standards

| Standard | Description | Authority |
|---|---|---|
| Semantic Versioning 2.0.0 | Versioning scheme for software releases. | Tom Preston-Werner / semver.org |
| Conventional Commits 1.0.0 | Specification for commit message format. | conventionalcommits.org |
| Google Java Style Guide | Coding standards for Java at Google. | Google |
| PEP 8 | Style guide for Python code. | Python Software Foundation |
| OWASP Top 10 | Top 10 web application security risks. | OWASP Foundation |
| OWASP Secure Coding Practices | Checklist of secure coding principles. | OWASP Foundation |
| Keep a Changelog | Convention for maintaining a CHANGELOG.md. | Olivier Lacan / keepachangelog.com |

---

*All references are indexed in SOURCE_INDEX.md.*
