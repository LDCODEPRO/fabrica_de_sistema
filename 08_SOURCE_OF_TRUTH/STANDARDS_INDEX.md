# STANDARDS INDEX — Fábrica de Sistemas Source of Truth

> Consolidated unique list of all real standards, specifications, and official guidelines cited across the 7 agent knowledge libraries.
> Generated: 2026-06-05
> Agents covered: ARCHITECT, DEVELOPER, QA, DOCS, ORCHESTRATOR, ANALYST, DESIGNER

---

| ID | Standard / Specification | Organization | Version / Year | Category | Description | Agent(s) |
|----|--------------------------|--------------|----------------|----------|-------------|---------|
| S-001 | WCAG 2.1 — Web Content Accessibility Guidelines | W3C Web Accessibility Initiative | 2018 | Accessibility | Four POUR principles (Perceivable, Operable, Understandable, Robust); conformance levels A, AA, AAA. Most jurisdictions require AA compliance. | DESIGNER, QA |
| S-002 | WCAG 2.2 — Web Content Accessibility Guidelines | W3C Web Accessibility Initiative | 2023 | Accessibility | Extension of WCAG 2.1; adds new success criteria including focus appearance, dragging movements, and target size | DESIGNER |
| S-003 | OWASP Top 10 | OWASP Foundation | 2021 | Security | Top ten web application security risks: Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable Components, Auth Failures, Integrity Failures, Logging Failures, SSRF | DEVELOPER, QA |
| S-004 | OWASP Secure Coding Practices | OWASP Foundation | Ongoing | Security | Quick reference guide for secure coding: input validation, output encoding, authentication, session management, access control, cryptography, error handling | DEVELOPER |
| S-005 | ISO/IEC/IEEE 29148:2018 — Systems and Software Engineering: Life Cycle Processes — Requirements Engineering | ISO/IEC/IEEE | 2018 | Requirements Engineering | International standard for requirements processes; defines SRS content, quality attributes (correct, unambiguous, complete, consistent, ranked, verifiable, modifiable, traceable) | ANALYST |
| S-006 | IEEE 830-1998 — Recommended Practice for Software Requirements Specifications | IEEE | 1998 (superseded by 29148) | Requirements Engineering | Foundational SRS structure standard; defines format, quality attributes, and functional/non-functional requirements sections | ANALYST |
| S-007 | BABOK Guide v3 — Business Analysis Body of Knowledge | IIBA | 2015 | Business Analysis | Global standard for business analysis; 6 knowledge areas, 50 techniques, basis for CBAP certification | ANALYST |
| S-008 | ISTQB CTFL Syllabus — Certified Tester Foundation Level | ISTQB | v4.0, 2023 | Software Testing | Global body of knowledge for software testing; defines standard terminology, test design techniques, and processes | QA |
| S-009 | IEEE 829-2008 — Standard for Software and System Test Documentation | IEEE | 2008 | Software Testing | Defines structure and content of test plans, test design specs, test case specs, and test reports | QA |
| S-010 | Semantic Versioning 2.0.0 (SemVer) | Tom Preston-Werner | 2013 | Versioning | MAJOR.MINOR.PATCH versioning standard; MAJOR = breaking change, MINOR = new feature, PATCH = bug fix | DEVELOPER, DOCS |
| S-011 | Keep a Changelog | Olivier Lacan | Ongoing | Changelog | Standard format for human-readable changelogs; sections: Added, Changed, Deprecated, Removed, Fixed, Security | DOCS |
| S-012 | OpenAPI Specification 3.1.0 | OpenAPI Initiative | 2021 | API Description | Industry standard for describing REST APIs in YAML/JSON; enables automated doc generation, client SDKs, interactive consoles | DOCS, ARCHITECT |
| S-013 | CommonMark Specification | John MacFarlane et al. | Ongoing | Markup Language | Formally specified, unambiguous Markdown standard; avoids cross-platform rendering inconsistencies | DOCS |
| S-014 | Conventional Commits | Community Standard | v1.0.0, 2019 | Version Control | Commit message specification: feat:, fix:, refactor:, test:, chore:, docs:, BREAKING CHANGE | DEVELOPER |
| S-015 | Google Developer Documentation Style Guide | Google | Ongoing | Documentation | Style guide for developer-facing docs: voice, tone, formatting, code samples, UI elements, inclusive language | DOCS |
| S-016 | Microsoft Writing Style Guide | Microsoft | Ongoing | Documentation | Documentation style guide: warm/relaxed tone, accessibility, inclusive language; successor to Manual of Style for Technical Publications | DOCS |
| S-017 | The Scrum Guide | Ken Schwaber, Jeff Sutherland | 2020 | Agile Framework | Official Scrum reference: roles, events, artifacts, and rules | ORCHESTRATOR |
| S-018 | PMI Agile Practice Guide | PMI / Agile Alliance | 2017 | Agile | PMI guide for applying agile practices; complements PMBOK for hybrid projects | ORCHESTRATOR |
| S-019 | Kanban Method — Kanban University | David J. Anderson / Kanban University | Ongoing | Lean / Flow | Formal Kanban Method specification: six core practices, cadences, metrics | ORCHESTRATOR |
| S-020 | 12-Factor App | Heroku / Adam Wiggins | 2012 | Cloud / DevOps | 12 principles for building cloud-native applications: codebase, dependencies, config, backing services, build/release/run, processes, port binding, concurrency, disposability, dev/prod parity, logs, admin processes | ARCHITECT |
| S-021 | W3C WebDriver Specification | W3C | 2018 | Test Automation | Standard protocol for browser automation; basis for Selenium WebDriver API | QA |
| S-022 | ISO/IEC 25010 — Systems and Software Quality Models | ISO/IEC | 2011 | Software Quality | Software quality attribute taxonomy: functional suitability, reliability, performance efficiency, usability, security, maintainability, compatibility, portability | ANALYST, QA |
| S-023 | Gherkin Language Specification | Cucumber Ltd. | Ongoing | BDD / Testing | Structured natural language format for BDD scenarios: Feature, Scenario, Given/When/Then, And, But, Background, Scenario Outline | QA, ANALYST |
| S-024 | Material Design 3 Specification | Google | 2021+ | Design System | Google's open-source design system: dynamic color, typography scale, elevation model, component specs | DESIGNER |
| S-025 | Apple Human Interface Guidelines (HIG) | Apple | Ongoing | Design System | Design principles for Apple platforms; idioms, interaction patterns, accessibility guidelines per platform | DESIGNER |
| S-026 | ADR Format (Nygard Template) | Michael Nygard | 2011 | Architecture Documentation | Lightweight Architecture Decision Record: Title, Status, Context, Decision, Consequences | ARCHITECT |
| S-027 | Agile Manifesto | 17 Signatories | 2001 | Agile | Four values and twelve principles of agile software development | ORCHESTRATOR, DEVELOPER |

---

*Total unique standards/specifications: 27*
*Cross-reference: FRAMEWORKS_INDEX.md, METHODS_INDEX.md, MASTER_INDEX.md*
