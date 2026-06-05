# DOCS_AGENT — Applied Patterns

## Overview
Recurring patterns, templates, and structures that DOCS_AGENT applies to common documentation tasks. All patterns are grounded in established frameworks and style guides.

---

## Pattern 1: README Template

**Context:** Every project repository must have a README.md.

```markdown
# Project Name

One-sentence description of what this project does and who it's for.

![Build Status](badge-url) ![Coverage](badge-url) ![License](badge-url)

## Prerequisites

- Node.js >= 18
- PostgreSQL 15
- [Other dependencies]

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/org/project.git
cd project

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your local values

# 4. Run database migrations
npm run db:migrate

# 5. Start the development server
npm run dev
```

The app is now running at http://localhost:3000.

## Configuration

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `PORT` | No | 3000 | HTTP server port |
| `LOG_LEVEL` | No | `info` | Logging verbosity |

## Running Tests

```bash
npm test          # Unit tests
npm run test:e2e  # End-to-end tests
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
```

**Source:** GitHub documentation standards; Google Developer Documentation Style Guide.

---

## Pattern 2: CHANGELOG.md Template (Keep a Changelog)

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- [Description of new feature]

### Fixed
- [Description of bug fix]

## [1.2.0] - 2025-11-14

### Added
- User authentication via OAuth 2.0.
- Rate limiting on all public API endpoints.

### Changed
- Upgraded database driver to pg 8.12.

### Fixed
- Incorrect HTTP 200 response returned on failed payment validation (now returns 422).

## [1.1.0] - 2025-09-01

### Added
- Initial public release.

[Unreleased]: https://github.com/org/project/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/org/project/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/org/project/releases/tag/v1.1.0
```

**Source:** keepachangelog.com; semver.org.

---

## Pattern 3: OpenAPI Endpoint Documentation (DOCS_AGENT Standard)

Every endpoint in `openapi.yaml` must meet this standard:

```yaml
/users/{id}:
  get:
    summary: Get a user by ID
    description: |
      Returns the full user object for the specified user ID.
      Requires the `read:users` scope.
    operationId: getUserById
    tags:
      - Users
    parameters:
      - name: id
        in: path
        required: true
        description: The unique identifier of the user.
        schema:
          type: string
          format: uuid
        example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    responses:
      '200':
        description: User found.
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
            example:
              id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
              email: "user@example.com"
              name: "Alice"
              createdAt: "2025-01-15T10:30:00Z"
      '404':
        description: User not found.
        content:
          application/json:
            example:
              error: "USER_NOT_FOUND"
              message: "No user found with the provided ID."
      '401':
        description: Unauthorized. Missing or invalid authentication token.
```

**Source:** OpenAPI Specification 3.1.0; Tom Johnson, *Documenting APIs*.

---

## Pattern 4: How-to Guide Structure (Diátaxis)

**Context:** Writing a task-oriented guide.

```markdown
# How to [accomplish specific task]

## Overview
One or two sentences: what this guide helps you do and when you need it.
Prerequisites: what the user must already have set up.

## Steps

### 1. [First action]
[Instruction in imperative voice. "Run the following command."]

```bash
command --flag value
```

[Expected output or result of this step.]

### 2. [Second action]
...

## Verify the result
[How to confirm the task succeeded.]

## Troubleshooting
[The two or three most common failure modes and their solutions.]
```

**Rules:**
- Use imperative voice: "Run", "Open", "Enter" — not "You should run", "You need to open".
- Each step = one action.
- Do not explain concepts in a how-to guide. Link to the Explanation page instead.

**Source:** Diátaxis framework, diataxis.fr.

---

## Pattern 5: Architecture Decision Record (ADR)

```markdown
# ADR-NNN: [Short title of the decision]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-NNN]

## Context
[What situation led to this decision? What forces are at play?
Be factual. Do not justify the decision here.]

## Decision
[The decision that was made. State it clearly and actively:
"We will use X." not "X was decided upon."]

## Consequences
[What happens as a result? Include both positive and negative consequences.
What becomes easier? What becomes harder? What is now out of scope?]
```

**Storage:** `docs/decisions/ADR-NNN-short-title.md`

---

## Pattern 6: Tutorial Structure (Diátaxis)

**Context:** Writing a learning-oriented guide for a new user.

```markdown
# [Outcome]: Build Your First [X] in [Time]

## What you'll build
[One paragraph describing the end result. Include a screenshot or diagram if possible.]

## What you'll learn
- [Concrete skill 1]
- [Concrete skill 2]
- [Concrete skill 3]

## Prerequisites
- [What the user must have installed/configured]

## Step 1: [Title]
[Instruction. Keep explanations minimal — this is about doing, not understanding.
If the user needs to understand something, add a brief note and link to the Explanation page.]

## Step 2: [Title]
...

## Summary
Briefly recap what was built and what skills were practiced.

## Next steps
- [Link to the next tutorial or how-to guide]
- [Link to the reference page for the core concept introduced]
```

**Rules:**
- The tutorial must always work. Every command must produce the documented result.
- Do not give the user choices ("you can also do X"). One path only.
- Validate the tutorial end-to-end before publishing.

**Source:** Diátaxis framework, diataxis.fr.

---

## Sources
All references trace to `SOURCE_INDEX.md`.
