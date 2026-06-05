# DOCS_AGENT — Frameworks and Methods

## Overview
Documentation frameworks, methodologies, and process models that DOCS_AGENT uses to structure, plan, and produce technical content.

---

## 1. Diátaxis Framework (Daniele Procida)

The primary structural framework for all documentation produced by DOCS_AGENT.

**Core principle:** Documentation serves different user needs. Content written to serve multiple needs simultaneously serves none of them well. Separate them.

**Four documentation types:**

| Type | Oriented toward | Answers | Analogy |
|---|---|---|---|
| **Tutorial** | Learning | "Help me learn by doing" | Teaching a child to cook |
| **How-to Guide** | Tasks | "How do I accomplish X?" | A recipe |
| **Reference** | Information | "What does X do?" | Encyclopedia entry |
| **Explanation** | Understanding | "Why does X work this way?" | An essay |

**Application rules:**
- A tutorial walks through a complete, meaningful task from start to finish. It must always work. It is not a how-to guide.
- A how-to guide assumes competence. It solves a specific problem. It does not explain why.
- Reference is accurate, complete, and neutral. It does not advise; it describes.
- Explanation provides context, history, tradeoffs, and reasoning. It does not instruct.

**Source:** Daniele Procida, diataxis.fr.

---

## 2. Docs-as-Code (Anne Gentle)

**Philosophy:** Apply software development tools and practices to documentation:
- **Version control:** Docs live in Git, alongside the code.
- **Pull requests:** Doc changes are reviewed like code changes.
- **CI/CD:** Documentation is built and published automatically on merge.
- **Issue tracking:** Documentation bugs and feature requests are tracked in the same system as software issues.
- **Testing:** Links are checked, code samples are validated, spelling is linted.

**Workflow:**
1. Writer creates a branch.
2. Writer writes/edits in Markdown.
3. PR opened; reviewers (ideally including a subject matter expert and an editor) comment.
4. Changes merged.
5. CI pipeline builds and publishes the docs site.

**Source:** Anne Gentle, *Docs Like Code* (2nd ed., 2019).

---

## 3. Minimalism (John Carroll)

**Origin:** John Carroll's research at IBM in the 1980s, documented in *The Nurnberg Funnel* (1990).
**Core principle:** Users do not read documentation; they scan it looking for the minimum information needed to act. Documentation should support this behavior, not fight it.

**Minimalism principles applied by DOCS_AGENT:**
1. **Support action.** Every page should enable the user to do something, not just know something.
2. **Let the user make errors.** Don't try to prevent every possible mistake with exhaustive warnings. Trust the user.
3. **Focus on real tasks.** Document what users actually do, not what the system can theoretically do.
4. **Omit unnecessary preamble.** Start with the action, not the background.

---

## 4. Information Architecture for Documentation

**Hierarchy principles:**
- Structure reflects user tasks, not product features.
- Navigation should allow a user to find any page in three clicks or fewer.
- Use progressive disclosure: overview → concept → details → reference.

**Naming conventions:**
- Use gerunds for how-to guides: "Installing the CLI", "Configuring Authentication".
- Use noun phrases for reference: "Authentication API", "Configuration Options".
- Use descriptive titles for tutorials: "Build Your First Integration in 10 Minutes".

---

## 5. OpenAPI-First API Documentation

**Method:** The API specification file is written (or generated) first. Documentation is derived from it, not written separately.

**Workflow:**
1. Backend developer writes or updates `openapi.yaml`.
2. DOCS_AGENT reviews the spec for completeness (descriptions, examples, error responses).
3. Reference docs are generated automatically (Swagger UI / Redoc / Stoplight).
4. DOCS_AGENT adds conceptual guides and tutorials around the reference.

**Required fields per endpoint (DOCS_AGENT standard):**
- `summary` (one line)
- `description` (full explanation)
- `parameters`: `description`, `required`, `example` for each
- `requestBody`: `description` + example
- `responses`: description + example for 2xx and all 4xx/5xx codes

**Source:** OpenAPI Specification v3.1.0; Tom Johnson, *Documenting APIs*.

---

## 6. Semantic Versioning + Keep a Changelog

**Versioning method:** SemVer (semver.org) — MAJOR.MINOR.PATCH.
**Changelog method:** Keep a Changelog format (keepachangelog.com).

**Release documentation process:**
1. All changes since the last release are tracked under `[Unreleased]` in `CHANGELOG.md`.
2. At release time, `[Unreleased]` is renamed to the new version number with a date.
3. Version number is bumped according to SemVer rules:
   - Breaking change → bump MAJOR, reset MINOR and PATCH to 0.
   - New feature (backward-compatible) → bump MINOR, reset PATCH to 0.
   - Bug fix (backward-compatible) → bump PATCH.
4. Git tag is created matching the version number (`v1.4.2`).

---

## 7. Architecture Decision Records (ADRs)

**Purpose:** Record the context, decision, and consequences of significant architectural choices. Prevents "why did we do it this way?" confusion months later.

**Format (Michael Nygard's original format):**
```markdown
# ADR-001: Use PostgreSQL for primary data storage

## Status
Accepted

## Context
We need a relational database. The team has experience with PostgreSQL. MySQL was considered.

## Decision
We will use PostgreSQL 15.

## Consequences
- We gain JSONB support, excellent full-text search, and strong community tooling.
- Deployments require a PostgreSQL instance; this adds infrastructure complexity.
```

**Storage:** ADRs are stored in `docs/decisions/` or `adr/` in the repository root.

---

## Sources
All references trace to `SOURCE_INDEX.md`.
