"""
knowledge_router.py
Fabrica de Sistemas - Knowledge Engine
Routes a query to the correct agent knowledge library.
No LLM required: rule-based keyword routing.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# Domain routing table — keywords mapped to agent names
# ---------------------------------------------------------------------------
DOMAIN_ROUTES: dict[str, list[str]] = {
    "ARCHITECT": [
        "arquitetura", "architecture", "system design", "microservices",
        "ddd", "domain", "hexagonal", "clean architecture", "c4", "adr",
        "scalability", "distributed", "event sourcing", "cqrs", "api design",
    ],
    "DEVELOPER": [
        "clean code", "codigo", "code", "refactor", "pattern", "padrao",
        "solid", "tdd", "unit test", "design pattern", "git", "ci", "cd",
        "programming", "implementacao", "implementation", "debug",
    ],
    "QA": [
        "teste", "test", "quality", "qualidade", "qa", "bug", "regression",
        "cypress", "selenium", "jest", "bdd", "acceptance", "exploratory",
        "istqb", "coverage", "test plan",
    ],
    "DOCS": [
        "documentacao", "documentation", "readme", "api docs", "changelog",
        "openapi", "swagger", "markdown", "diataxis", "onboarding", "wiki",
    ],
    "ORCHESTRATOR": [
        "kanban", "scrum", "agile", "sprint", "backlog", "wip", "workflow",
        "coordenacao", "coordination", "planning", "task", "tarefa",
    ],
    "ANALYST": [
        "requisitos", "requirements", "user story", "use case", "scope",
        "discovery", "stakeholder", "business rule", "regra de negocio",
        "babok", "event storming", "acceptance criteria",
    ],
    "DESIGNER": [
        "ui", "ux", "design", "figma", "wireframe", "prototype", "acessibilidade",
        "accessibility", "wcag", "layout", "typography", "color", "atomic design",
    ],
    "SECURITY": [
        "security", "seguranca", "owasp", "vulnerability", "authentication",
        "authorization", "jwt", "rbac", "threat", "zero trust", "penetration",
    ],
    "DEVOPS": [
        "devops", "docker", "kubernetes", "ci/cd", "pipeline", "deploy",
        "infra", "infrastructure", "monitoring", "observability", "sre",
        "gitops", "terraform", "helm",
    ],
    "DATA_ENGINEER": [
        "database", "dados", "data", "sql", "postgresql", "sqlite", "etl",
        "vector", "embedding", "indexing", "query", "schema", "migration",
    ],
    "AI_ENGINEER": [
        "llm", "rag", "prompt", "agent", "langchain", "embedding", "memory",
        "react", "tool calling", "guardrail", "evaluation", "fine tuning",
    ],
}

FABRICA_ROOT = Path(__file__).parent.parent


@dataclass
class RouteResult:
    agent: str
    score: int
    library_path: Path
    matched_keywords: list[str]


def route_query(query: str) -> list[RouteResult]:
    """
    Route a query to one or more agent knowledge libraries.
    Returns results sorted by match score (descending).
    """
    query_lower = query.lower()
    results: list[RouteResult] = []

    for agent, keywords in DOMAIN_ROUTES.items():
        matched = [kw for kw in keywords if kw in query_lower]
        if matched:
            lib_path = FABRICA_ROOT / "05_AGENTS" / f"{agent}_AGENT" / "KNOWLEDGE_LIBRARY"
            results.append(RouteResult(
                agent=agent,
                score=len(matched),
                library_path=lib_path,
                matched_keywords=matched,
            ))

    results.sort(key=lambda r: r.score, reverse=True)
    return results


def route_primary(query: str) -> Optional[RouteResult]:
    """Return the single best matching agent, or None if no match."""
    results = route_query(query)
    return results[0] if results else None


if __name__ == "__main__":
    # Quick smoke test
    tests = [
        "Como aplicar DDD em microservices?",
        "Como escrever clean code com SOLID?",
        "Como fazer testes de regressao com Cypress?",
        "Como documentar uma API com OpenAPI?",
        "Como usar JWT para autenticacao?",
        "Como configurar um pipeline CI/CD com Docker?",
    ]
    for q in tests:
        result = route_primary(q)
        if result:
            print(f"Query: {q!r}")
            print(f"  -> {result.agent} (score={result.score}, keywords={result.matched_keywords})")
        else:
            print(f"Query: {q!r} -> NO ROUTE FOUND")
