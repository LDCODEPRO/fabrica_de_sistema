"""
knowledge_search.py
Fabrica de Sistemas - Knowledge Engine
File-based search over agent knowledge libraries. No LLM required.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Generator

FABRICA_ROOT = Path(__file__).parent.parent
AGENTS_DIR   = FABRICA_ROOT / "05_AGENTS"

SEARCHABLE_FILES = [
    "BEST_PRACTICES.md",
    "MASTERS_AND_REFERENCES.md",
    "BOOKS_AND_WORKS.md",
    "FRAMEWORKS_AND_METHODS.md",
    "TOOLS_AND_STANDARDS.md",
    "APPLIED_PATTERNS.md",
    "LEARNING_NOTES.md",
    "SOURCE_INDEX.md",
]


@dataclass
class SearchHit:
    agent: str
    file: str
    line_number: int
    line: str
    context: str  # surrounding lines for context


@dataclass
class SearchResult:
    query: str
    hits: list[SearchHit] = field(default_factory=list)
    agents_searched: list[str] = field(default_factory=list)
    files_searched: int = 0

    @property
    def total_hits(self) -> int:
        return len(self.hits)


def _iter_library_files(agent_filter: str | None = None) -> Generator[tuple[str, Path], None, None]:
    """Yield (agent_name, file_path) for all searchable knowledge library files."""
    for agent_dir in sorted(AGENTS_DIR.iterdir()):
        if not agent_dir.is_dir() or not agent_dir.name.endswith("_AGENT"):
            continue
        if agent_filter and agent_filter.upper() not in agent_dir.name:
            continue
        lib = agent_dir / "KNOWLEDGE_LIBRARY"
        if not lib.exists():
            continue
        for fname in SEARCHABLE_FILES:
            fpath = lib / fname
            if fpath.exists():
                yield agent_dir.name, fpath


def search(
    query: str,
    agent_filter: str | None = None,
    case_sensitive: bool = False,
    max_hits: int = 50,
) -> SearchResult:
    """
    Search all knowledge library files for query string.
    Returns a SearchResult with matching lines and context.
    """
    result = SearchResult(query=query)
    flags = 0 if case_sensitive else re.IGNORECASE
    pattern = re.compile(re.escape(query), flags)

    for agent_name, fpath in _iter_library_files(agent_filter):
        result.files_searched += 1
        if agent_name not in result.agents_searched:
            result.agents_searched.append(agent_name)

        lines = fpath.read_text(encoding="utf-8", errors="replace").splitlines()
        for i, line in enumerate(lines):
            if pattern.search(line):
                context_start = max(0, i - 1)
                context_end   = min(len(lines), i + 2)
                context = "\n".join(lines[context_start:context_end])
                result.hits.append(SearchHit(
                    agent=agent_name,
                    file=fpath.name,
                    line_number=i + 1,
                    line=line.strip(),
                    context=context,
                ))
                if len(result.hits) >= max_hits:
                    return result

    return result


def search_author(name: str) -> SearchResult:
    """Convenience: search for a specific author across all libraries."""
    return search(name)


def search_framework(name: str) -> SearchResult:
    """Convenience: search for a framework across all libraries."""
    return search(name)


if __name__ == "__main__":
    result = search("Martin Fowler")
    print(f"Search: 'Martin Fowler' -> {result.total_hits} hits in {result.files_searched} files")
    for hit in result.hits[:3]:
        print(f"  [{hit.agent}/{hit.file}:{hit.line_number}] {hit.line[:80]}")
