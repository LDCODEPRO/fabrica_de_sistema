# DOCS_AGENT — Best Practices

## Overview
Core principles and practices adopted by DOCS_AGENT for producing, maintaining, and publishing technical documentation across all Fábrica de Sistemas projects.

---

## 1. Docs-as-Code

- **Treat documentation like source code.** Store docs in the same repository as the code they describe, under version control (Git). Use pull requests for doc reviews. Source: Anne Gentle, *Docs Like Code*.
- **Write in plain text formats.** Markdown (CommonMark spec) or reStructuredText are the standard formats. They are diff-friendly, human-readable, and renderable by all major platforms.
- **Automate doc publishing.** Use CI/CD pipelines to build and deploy documentation automatically on every merge to main. Tools: MkDocs, Sphinx, GitBook.
- **Review docs in the same PR as the code change.** Documentation that ships after the feature is documentation that ships wrong or late.

## 2. The Diátaxis Framework (Daniele Procida)

Every piece of documentation belongs to one of four types. Never mix them in the same page:

| Type | Purpose | Answers |
|---|---|---|
| **Tutorial** | Learning-oriented | "How do I get started?" |
| **How-to Guide** | Task-oriented | "How do I accomplish X?" |
| **Reference** | Information-oriented | "What does X do?" |
| **Explanation** | Understanding-oriented | "Why does X work this way?" |

- Source: Daniele Procida, diátaxis.fr
- **Rule:** If a page is hard to write, it is usually because you are mixing types. Separate them.

## 3. API Documentation

- **Use OpenAPI/Swagger specification for all REST APIs.** The spec file (`openapi.yaml` or `openapi.json`) is the source of truth. Generate reference docs from it automatically; do not hand-write parameter tables.
- **Every API endpoint must have:** description, parameters (type, required/optional, example), request body (with example), response codes (with example payloads for success and each error type).
- **Provide runnable examples.** Code snippets in at least two languages (e.g., cURL + JavaScript) for every endpoint.
- **Source:** OpenAPI Initiative, openapis.org.

## 4. README Standards

Every project repository must have a README.md with:
1. **Project name and one-sentence description.**
2. **Badges** (build status, coverage, license).
3. **Prerequisites** (language version, runtime, dependencies).
4. **Quick Start** — working in under 5 minutes (install → configure → run).
5. **Configuration reference** — all environment variables and their defaults.
6. **How to run tests.**
7. **Contributing guidelines link** or inline section.
8. **License.**

- Source: GitHub documentation standards; Write the Docs community guides.

## 5. Changelog

- **Maintain a `CHANGELOG.md` in every project root.**
- **Format:** Follow Keep a Changelog (keepachangelog.com).
  - Sections: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
  - Most recent version at the top.
  - Unreleased changes tracked under `[Unreleased]`.
- **Version numbers:** Follow Semantic Versioning (semver.org): `MAJOR.MINOR.PATCH`.
  - MAJOR: breaking changes.
  - MINOR: new backward-compatible features.
  - PATCH: backward-compatible bug fixes.

## 6. Writing Style

- **Use active voice.** "The function returns a list" not "A list is returned by the function."
- **Use second person for instructions.** "Run `npm install`" not "The developer should run `npm install`."
- **One sentence per line in Markdown source.** This makes diffs readable and enables per-sentence commenting in reviews.
- **Be consistent with terminology.** Define terms once; use them consistently throughout. Do not alternate between "user", "customer", and "account holder" for the same concept.
- **Sources:** Google Developer Documentation Style Guide; Microsoft Writing Style Guide.

## 7. Onboarding Documentation

- **Onboarding docs must be validated by a new team member.** If a newcomer cannot follow the guide and reach a working state, the doc has failed.
- **Separate onboarding from reference.** Onboarding is a Tutorial (Diátaxis); reference is Reference. Do not mix them.
- **Include the "why," not just the "what."** Architectural decisions and technology choices that are not self-evident must be explained. Use Architecture Decision Records (ADRs).

## 8. Knowledge Base Maintenance

- **Documentation has a TTL (time to live).** Every doc page should have an owner and a review cadence. Stale documentation is harmful: it wastes time and erodes trust.
- **Mark uncertain or outdated sections explicitly.** Use `> **Note:** This section may be outdated as of vX.Y.` rather than leaving incorrect content silently.
- **Link, don't duplicate.** When content is the same across two pages, link to the canonical source. Duplication creates divergence.

---

## Sources
All references trace to `SOURCE_INDEX.md`.
