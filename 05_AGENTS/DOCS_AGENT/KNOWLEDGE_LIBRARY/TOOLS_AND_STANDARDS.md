# DOCS_AGENT — Tools and Standards

## Overview
Tools, platforms, and standards that DOCS_AGENT uses or recommends for creating, publishing, and maintaining technical documentation.

---

## Static Site Generators

### MkDocs
- **Type:** Python-based static site generator for project documentation.
- **Website:** mkdocs.org
- **Configuration:** `mkdocs.yml` in the project root.
- **Theme:** Material for MkDocs (squidfunk.github.io/mkdocs-material) is the recommended theme — feature-rich, responsive, search-enabled.
- **Use cases:** Project documentation sites, knowledge bases, internal developer portals.
- **Key features:** Markdown-based, live preview (`mkdocs serve`), automatic navigation from file structure, search, versioning via mike plugin.

### Sphinx
- **Type:** Python-based documentation generator; originated with Python's own documentation.
- **Website:** sphinx-doc.org
- **Format:** reStructuredText (primary) and Markdown (via MyST parser extension).
- **Use cases:** Python library documentation; projects requiring complex cross-references, autogeneration from docstrings, and PDF output.
- **Key features:** autodoc (generate reference from Python docstrings), intersphinx (link between Sphinx projects), multiple output formats (HTML, PDF, ePub).

### GitBook
- **Type:** Cloud-based documentation platform with Git sync.
- **Website:** gitbook.com
- **Use cases:** Product documentation, developer guides, internal knowledge bases. Good choice for non-technical teams who need to contribute to docs via a visual editor.
- **Key features:** WYSIWYG + Markdown editing, GitHub/GitLab sync, versioning, team collaboration, custom domains.

---

## API Documentation Tools

### Swagger UI
- **Type:** Interactive API documentation renderer for OpenAPI specifications.
- **Website:** swagger.io/tools/swagger-ui
- **Use cases:** Rendering OpenAPI 2.0/3.x specs as an interactive web console where users can make live API calls.
- **Key features:** Zero-config if served with a valid `openapi.yaml`, try-it-out functionality, authentication support.

### Redoc
- **Type:** OpenAPI-powered reference documentation renderer.
- **Website:** redocly.com/redoc
- **Use cases:** Generating clean, three-panel API reference docs (navigation / description / code samples) from an OpenAPI spec.
- **Advantage over Swagger UI:** Better suited for public-facing, read-only API documentation pages.

### Stoplight Studio
- **Type:** GUI editor for OpenAPI specifications.
- **Website:** stoplight.io/studio
- **Use cases:** Writing and validating OpenAPI specs without hand-editing YAML. Visual form-based editing with live preview.

---

## Collaboration and Knowledge Base Platforms

### Confluence (Atlassian)
- **Type:** Team wiki and knowledge management platform.
- **Website:** atlassian.com/software/confluence
- **Use cases:** Internal documentation, meeting notes, onboarding guides, architecture decisions for organizations already in the Atlassian ecosystem.
- **Integration:** Links with Jira for documentation-to-issue traceability.

### Notion
- **Type:** All-in-one workspace (notes, docs, databases).
- **Website:** notion.so
- **Use cases:** Flexible internal documentation, project wikis, lightweight knowledge bases for smaller teams.

---

## Writing and Linting Tools

### Vale
- **Type:** Command-line prose linter.
- **Website:** vale.sh
- **Use cases:** Enforcing style guide rules (Google, Microsoft, or custom) automatically in CI pipelines. Flags passive voice, overly long sentences, banned terminology, and inconsistent usage.
- **Configuration:** `.vale.ini` + style packages in `.vale/styles/`.

### markdownlint
- **Type:** Markdown style and syntax linter.
- **Website:** github.com/DavidAnson/markdownlint
- **Use cases:** Enforcing consistent Markdown formatting (heading levels, list styles, line length, blank lines around headings).
- **CLI:** markdownlint-cli2 or markdownlint-cli.

---

## Version Control and Publishing

### Git + GitHub / GitLab
- **Use cases:** Source of truth for all documentation files. Pull request workflow for doc reviews. GitHub Actions / GitLab CI for automated publishing.

### GitHub Actions (for docs CI)
- **Use cases:** On merge to main: run markdownlint, Vale, build MkDocs site, deploy to GitHub Pages or a CDN.

---

## Standards

### OpenAPI Specification 3.1.0
- **Organization:** OpenAPI Initiative.
- **URL:** spec.openapis.org/oas/v3.1.0
- **Usage:** Mandatory format for all REST API documentation in the Fábrica de Sistemas.

### CommonMark Specification
- **URL:** commonmark.org/spec/
- **Usage:** Baseline Markdown standard for all documentation files.

### Semantic Versioning 2.0.0
- **URL:** semver.org
- **Usage:** Version numbering standard for all projects.

### Keep a Changelog
- **URL:** keepachangelog.com
- **Usage:** Changelog format standard for all projects.

### Google Developer Documentation Style Guide
- **URL:** developers.google.com/style
- **Usage:** Primary style authority for word choice, formatting, and code samples.

---

## Sources
All references trace to `SOURCE_INDEX.md`.
