"""
knowledge_manifest_loader.py
Fabrica de Sistemas - Knowledge Engine
Loads and validates agent YAML manifests from 07_KNOWLEDGE_ENGINE/manifests/.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

try:
    import yaml
    YAML_AVAILABLE = True
except ImportError:
    YAML_AVAILABLE = False

MANIFESTS_DIR = Path(__file__).parent / "manifests"

REQUIRED_FIELDS = [
    "agent_name", "description", "masters", "books",
    "frameworks", "patterns", "tools", "domains",
    "priority", "version", "last_review", "source_count",
    "validation_status",
]


@dataclass
class ManifestLoadResult:
    agent_name: str
    path: Path
    data: dict[str, Any]
    missing_fields: list[str] = field(default_factory=list)
    valid: bool = True


def _parse_yaml(path: Path) -> dict[str, Any]:
    if not YAML_AVAILABLE:
        # Minimal fallback: parse key: value lines
        data: dict[str, Any] = {}
        for line in path.read_text(encoding="utf-8").splitlines():
            if ":" in line and not line.strip().startswith("#"):
                k, _, v = line.partition(":")
                data[k.strip()] = v.strip()
        return data
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


def load_manifest(agent_name: str) -> ManifestLoadResult | None:
    """Load a single agent manifest by agent name (e.g. 'ARCHITECT')."""
    path = MANIFESTS_DIR / f"{agent_name.upper()}_manifest.yaml"
    if not path.exists():
        return None
    data = _parse_yaml(path)
    missing = [f for f in REQUIRED_FIELDS if f not in data]
    return ManifestLoadResult(
        agent_name=agent_name.upper(),
        path=path,
        data=data,
        missing_fields=missing,
        valid=len(missing) == 0,
    )


def load_all_manifests() -> list[ManifestLoadResult]:
    """Load all manifests found in the manifests/ directory."""
    if not MANIFESTS_DIR.exists():
        return []
    results = []
    for yaml_path in sorted(MANIFESTS_DIR.glob("*_manifest.yaml")):
        agent_name = yaml_path.stem.replace("_manifest", "")
        data = _parse_yaml(yaml_path)
        missing = [f for f in REQUIRED_FIELDS if f not in data]
        results.append(ManifestLoadResult(
            agent_name=agent_name.upper(),
            path=yaml_path,
            data=data,
            missing_fields=missing,
            valid=len(missing) == 0,
        ))
    return results


if __name__ == "__main__":
    all_m = load_all_manifests()
    print(f"Manifests found: {len(all_m)}")
    for m in all_m:
        status = "OK" if m.valid else f"MISSING: {m.missing_fields}"
        print(f"  {m.agent_name}: {status}")
