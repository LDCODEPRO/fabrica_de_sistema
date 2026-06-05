# DOCS_AGENT — Learning Notes

## Overview
Observations, lessons learned, synthesis notes, and evolving insights from real projects, reading, and community discussion. This is a living document.

---

## On Documentation Philosophy

**Note 1 — "Every page is page one" changes everything.**
Mark Baker's insight is foundational: in the age of search engines, users do not read documentation sequentially. They land on any page via Google, a Stack Overflow link, or an internal search. Every page must therefore be self-contained: it must tell the user where they are, what prerequisite knowledge they need, and where to go next. A tutorial that assumes the user read the previous three pages will always fail most readers.

**Note 2 — The four Diátaxis types are genuinely different cognitive tasks for the writer.**
Writing a tutorial requires thinking like a teacher. Writing a how-to guide requires thinking like a process designer. Writing reference requires thinking like a compiler (complete, consistent, neutral). Writing explanation requires thinking like an essayist. When a page is hard to write, it is almost always because you are trying to do two of these simultaneously. Separate them first.

**Note 3 — Docs-as-code is not just a tool choice — it's a cultural choice.**
The tools (Git, Markdown, CI) are easy. The hard part is convincing engineers to review documentation pull requests with the same care they give code reviews, and convincing writers to file issues for documentation bugs. Anne Gentle's *Docs Like Code* is partly a book about organizational change.

---

## On Writing Quality

**Note 4 — Active voice is not about style; it's about clarity of responsibility.**
"The system will throw an error" leaves the reader wondering: which system? what kind of error? when? "If authentication fails, the API returns a 401 Unauthorized response with an `error` field describing the failure" is concrete, active, and actionable. This is the difference between documentation that informs and documentation that instructs.

**Note 5 — The hardest sentence to write is the first one.**
Tom Johnson notes this frequently on I'd Rather Be Writing: the introductory sentence of a page determines whether the reader stays or leaves. It must answer: what is this? who is it for? why does it matter? Get this right before worrying about anything else.

**Note 6 — Warnings and notes should be rare.**
If every third paragraph has a warning box, readers learn to skip warning boxes. Reserve callouts (`> **Warning:**`, `> **Note:**`) for genuinely critical information that would cause data loss, security exposure, or irreversible actions if missed.

---

## On API Documentation

**Note 7 — The spec and the docs must stay synchronized — and they won't by accident.**
The most common failure mode in API documentation is a spec that documents the intended behavior while the code implements something different, and documentation that was written once and never updated. The only sustainable solution is: (1) generate reference docs from the OpenAPI spec, (2) run contract tests against the spec in CI, and (3) make updating the spec a required step in the PR process for any API change.

**Note 8 — Examples are more valuable than descriptions.**
Tom Johnson's research and experience show that developers read the code sample first, then the description (if at all). A response example showing a real payload with real field values teaches more than three paragraphs of parameter descriptions. Invest in good examples; they are the highest-leverage content in API documentation.

**Note 9 — Error documentation is the most neglected and most valuable part of API docs.**
Developers spend a significant amount of their time debugging API errors. Documenting every possible error code, its meaning, its likely cause, and its resolution turns hours of debugging into minutes. Every 4xx and 5xx response must be documented with an example payload and a troubleshooting note.

---

## On Changelogs and Versioning

**Note 10 — A git log is not a changelog.**
"Merge PR #482", "fix stuff", "wip", "refactor" are useless to the developer upgrading their dependency. A changelog is a curated, human-written record of what changed, why it matters, and what action (if any) the reader needs to take. Source: keepachangelog.com's core principle.

**Note 11 — Breaking changes must be the loudest thing in the changelog.**
A MAJOR version bump communicates "something broke"; the changelog must explain exactly what broke, what the migration path is, and link to a migration guide. Burying a breaking change under five "Added" items is a trust-destroying move.

---

## On Onboarding Documentation

**Note 12 — The fastest way to improve onboarding docs is to watch a new hire use them.**
Write with them in the room. Note where they hesitate, where they ask questions, and where they give up. These are your documentation failures, not their failures. The Diátaxis tutorial rules apply here most strictly: a tutorial that breaks for a new user must be fixed before it is published.

**Note 13 — Onboarding documentation has two audiences: the newcomer and their future self.**
A new developer who succeeds with the onboarding guide will return to it six months later when they onboard someone else. Write for both: the first-time reader needs hand-holding; the returning reader needs scannable headers and quick-reference sections.

---

## On Maintenance

**Note 14 — Stale documentation is an active liability, not just a gap.**
Incorrect documentation wastes developer time, breaks trust in the knowledge base, and sometimes causes real damage (e.g., a deprecated API endpoint documented as current, or a security configuration that has since been changed). Assign ownership. Set review cycles. Use CI to catch dead links. Source: Write the Docs community guides on documentation maintenance.

**Note 15 — "Docs debt" compounds like technical debt.**
A project that ships features without updating documentation accumulates a debt that grows with every release. The interest payment is the time developers spend answering questions that the documentation should have answered. Pay it incrementally with every PR.

---

## Sources
All references trace to `SOURCE_INDEX.md`.
