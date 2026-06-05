"""
knowledge_validator.py
Fabrica de Sistemas - Knowledge Engine
Validates knowledge library structure: missing files, broken references, empty content.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

FABRICA_ROOT = Path(__file__).parent.parent
AGENTS_DIR   = FABRICA_ROOT / "05_AGENTS"

REQUIRED_FILES = [
    "BEST_PRACTICES.md",
    "MASTERS_AND_REFERENCES.md",
    "BOOKS_AND_WORKS.md",
    "FRAMEWORKS_AND_METHODS.md",
    "TOOLS_AND_STANDARDS.md",
    "APPLIED_PATTERNS.md",
    "LEARNING_NOTES.md",
    "SOURCE_INDEX.md",
]

MIN_FILE_BYTES = 100  # files smaller than this are considered stubs


@dataclass
class ValidationIssue:
    severity: str   # CRITICAL | HIGH | MEDIUM | LOW
    code: str
    agent: str
    file: str
    message: str


@dataclass
class ValidationReport:
    agents_checked: list[str] = field(default_factory=list)
    issues: list[ValidationIssue] = field(default_factory=list)
    files_checked: int = 0

    @property
    def critical_count(self) -> int:
        return sum(1 for i in self.issues if i.severity == "CRITICAL")

    @property
    def score(self) -> int:
        deductions = self.critical_count * 20 + sum(
            8 if i.severity == "HIGH" else 4 if i.severity == "MEDIUM" else 2
            for i in self.issues if i.severity != "CRITICAL"
        )
        return max(0, 100 - deductions)

    def summary(self) -> str:
        return (
            f"Agents: {len(self.agents_checked)} | "
            f"Files: {self.files_checked} | "
            f"Issues: {len(self.issues)} | "
            f"Score: {self.score}/100"
        )


def validate_all() -> ValidationReport:
    report = ValidationReport()

    for agent_dir in sorted(AGENTS_DIR.iterdir()):
        if not agent_dir.is_dir() or not agent_dir.name.endswith("_AGENT"):
            continue

        agent = agent_dir.name
        report.agents_checked.append(agent)
        lib = agent_dir / "KNOWLEDGE_LIBRARY"

        if not lib.exists():
            report.issues.append(ValidationIssue(
                severity="CRITICAL", code="V001", agent=agent,
                file="KNOWLEDGE_LIBRARY/",
                message="KNOWLEDGE_LIBRARY directory missing",
            ))
            continue

        for fname in REQUIRED_FILES:
            fpath = lib / fname
            report.files_checked += 1

            if not fpath.exists():
                report.issues.append(ValidationIssue(
                    severity="HIGH", code="V002", agent=agent, file=fname,
                    message=f"Required file missing: {fname}",
                ))
                continue

            size = fpath.stat().st_size
            if size < MIN_FILE_BYTES:
                report.issues.append(ValidationIssue(
                    severity="MEDIUM", code="V003", agent=agent, file=fname,
                    message=f"File appears to be a stub ({size} bytes < {MIN_FILE_BYTES})",
                ))
                continue

            content = fpath.read_text(encoding="utf-8", errors="replace")
            if "[PENDENTE" in content or content.lower().count("placeholder") > 3:
                report.issues.append(ValidationIssue(
                    severity="MEDIUM", code="V004", agent=agent, file=fname,
                    message="File contains PENDENTE marker or placeholder text",
                ))

    return report


if __name__ == "__main__":
    report = validate_all()
    print(report.summary())
    for issue in report.issues:
        print(f"  [{issue.severity}] {issue.agent}/{issue.file}: {issue.message}")
