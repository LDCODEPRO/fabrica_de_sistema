# MASTER INDEX — Fábrica de Sistemas Source of Truth

> Central navigation index for all Source of Truth knowledge assets.
> Generated: 2026-06-05
> Agents covered: ARCHITECT, DEVELOPER, QA, DOCS, ORCHESTRATOR, ANALYST, DESIGNER

---

## Overview

The **08_SOURCE_OF_TRUTH** directory is the single authoritative reference for all knowledge assets that underpin the Fábrica de Sistemas agent ecosystem. All content is extracted and consolidated from the KNOWLEDGE_LIBRARY files of the 7 agents (located in `05_AGENTS/`).

These indexes serve as the Source of Truth for:
- Agent manifest validation (`07_KNOWLEDGE_ENGINE/manifests/`)
- Cross-agent knowledge consistency checks
- Knowledge engine routing and ranking (`07_KNOWLEDGE_ENGINE/`)
- Onboarding new agents or extending existing libraries

---

## Index Files

| File | Count | Description |
|------|-------|-------------|
| [AUTHORS_INDEX.md](./AUTHORS_INDEX.md) | 73 authors/organizations | All unique real authors and organizations cited across agents |
| [BOOKS_INDEX.md](./BOOKS_INDEX.md) | 72 books/works | All unique real books, manuals, and major published works |
| [FRAMEWORKS_INDEX.md](./FRAMEWORKS_INDEX.md) | 33 frameworks | All unique frameworks, design systems, and formal methodologies |
| [TOOLS_INDEX.md](./TOOLS_INDEX.md) | 49 tools | All unique real software tools referenced by agents |
| [PATTERNS_INDEX.md](./PATTERNS_INDEX.md) | 66 patterns | All unique architectural, OOP, testing, and UI/UX patterns |
| [STANDARDS_INDEX.md](./STANDARDS_INDEX.md) | 27 standards | All unique ISO, IEEE, W3C, OWASP, and industry standards |
| [METHODS_INDEX.md](./METHODS_INDEX.md) | 40 methods | All unique methods, methodologies, and structured techniques |

**Total catalogued knowledge assets: 360**

---

## Coverage by Agent

| Agent | Masters | Books | Frameworks | Tools | Patterns | Standards | Methods |
|-------|---------|-------|------------|-------|----------|-----------|---------|
| ARCHITECT | 9 | 18 | 9 | 8 | 25 | 5 | 5 |
| DEVELOPER | 8 | 14 | 7 | 12 | 27 | 5 | 8 |
| QA | 10 | 13 | 10 | 11 | 12 | 4 | 10 |
| DOCS | 9 | 12 | 5 | 12 | 3 | 7 | 5 |
| ORCHESTRATOR | 6 | 10 | 6 | 8 | 6 | 4 | 10 |
| ANALYST | 7 | 8 | 8 | 6 | 6 | 5 | 12 |
| DESIGNER | 8 | 10 | 8 | 9 | 8 | 5 | 10 |

*Note: Many entries are shared across multiple agents. Counts above reflect per-agent citations, not unique totals.*

---

## Agent Manifests

Agent YAML manifests are located at:
```
07_KNOWLEDGE_ENGINE/manifests/
├── ARCHITECT.yaml
├── DEVELOPER.yaml
├── QA.yaml
├── DOCS.yaml
├── ORCHESTRATOR.yaml
├── ANALYST.yaml
└── DESIGNER.yaml
```

Each manifest declares: `agent_name`, `description`, `masters`, `books`, `frameworks`, `patterns`, `tools`, `domains`, `priority`, `version`, `last_review`, `source_count`, `validation_status`.

---

## Source Libraries

The knowledge content indexed here is sourced from:

```
05_AGENTS/
├── ARCHITECT_AGENT/KNOWLEDGE_LIBRARY/
│   ├── MASTERS_AND_REFERENCES.md   (9 masters)
│   ├── BOOKS_AND_WORKS.md          (18 books across 3 tiers)
│   ├── FRAMEWORKS_AND_METHODS.md
│   ├── TOOLS_AND_STANDARDS.md
│   ├── APPLIED_PATTERNS.md
│   ├── BEST_PRACTICES.md
│   ├── LEARNING_NOTES.md
│   └── SOURCE_INDEX.md
├── DEVELOPER_AGENT/KNOWLEDGE_LIBRARY/  (same structure)
├── QA_AGENT/KNOWLEDGE_LIBRARY/         (same structure)
├── DOCS_AGENT/KNOWLEDGE_LIBRARY/       (same structure)
├── ORCHESTRATOR_AGENT/KNOWLEDGE_LIBRARY/ (same structure)
├── ANALYST_AGENT/KNOWLEDGE_LIBRARY/    (same structure)
└── DESIGNER_AGENT/KNOWLEDGE_LIBRARY/   (same structure)
```

---

## Key Cross-References

| Knowledge Asset | Primary Agents | Index File |
|----------------|----------------|------------|
| DDD (Domain-Driven Design) | ARCHITECT, ANALYST | FRAMEWORKS_INDEX.md F-001 |
| Clean Architecture | ARCHITECT, DEVELOPER | FRAMEWORKS_INDEX.md F-002 |
| TDD | DEVELOPER, QA | FRAMEWORKS_INDEX.md F-007 |
| BDD / Gherkin | QA, ANALYST | FRAMEWORKS_INDEX.md F-008 |
| Diataxis | DOCS | FRAMEWORKS_INDEX.md F-015 |
| WCAG 2.1 | DESIGNER, QA | STANDARDS_INDEX.md S-001 |
| OWASP Top 10 | DEVELOPER, QA | STANDARDS_INDEX.md S-003 |
| Scrum | ORCHESTRATOR | METHODS_INDEX.md M-002 |
| Kanban | ORCHESTRATOR | METHODS_INDEX.md M-003 |
| Atomic Design | DESIGNER | FRAMEWORKS_INDEX.md F-023 |
| Event Storming | ANALYST | METHODS_INDEX.md M-015 |
| OpenAPI 3.1 | DOCS, ARCHITECT | STANDARDS_INDEX.md S-012 |
| BABOK v3 | ANALYST | STANDARDS_INDEX.md S-007 |
| ISTQB CTFL | QA | STANDARDS_INDEX.md S-008 |

---

## Maintenance

- **Update policy:** Any new source added to an agent KNOWLEDGE_LIBRARY must be reflected in the corresponding index file here.
- **Validation:** `07_KNOWLEDGE_ENGINE/knowledge_validator.py` cross-checks manifests against this Source of Truth.
- **Review frequency:** Quarterly or upon major agent updates.
- **Owner:** ORCHESTRATOR_AGENT coordinates updates; individual agents own their respective source libraries.

---

*Last updated: 2026-06-05*
*Version: 1.0.0*
