"""
knowledge_cache.py
Fabrica de Sistemas - Knowledge Engine
Simple file-mtime-based cache for search results. No external dependencies.
"""

from __future__ import annotations

import hashlib
import json
import time
from pathlib import Path
from typing import Any, Optional

CACHE_DIR = Path(__file__).parent / ".knowledge_cache"
TTL_SECONDS = 300  # 5 minutes


def _cache_key(query: str, agent_filter: Optional[str]) -> str:
    raw = f"{query}|{agent_filter or ''}"
    return hashlib.md5(raw.encode()).hexdigest()


def get(query: str, agent_filter: Optional[str] = None) -> Optional[Any]:
    """Return cached result or None if expired/missing."""
    CACHE_DIR.mkdir(exist_ok=True)
    key  = _cache_key(query, agent_filter)
    path = CACHE_DIR / f"{key}.json"
    if not path.exists():
        return None
    entry = json.loads(path.read_text(encoding="utf-8"))
    if time.time() - entry["timestamp"] > TTL_SECONDS:
        path.unlink(missing_ok=True)
        return None
    return entry["data"]


def put(query: str, data: Any, agent_filter: Optional[str] = None) -> None:
    """Store data in cache."""
    CACHE_DIR.mkdir(exist_ok=True)
    key  = _cache_key(query, agent_filter)
    path = CACHE_DIR / f"{key}.json"
    path.write_text(
        json.dumps({"timestamp": time.time(), "data": data}, ensure_ascii=False),
        encoding="utf-8",
    )


def invalidate(query: str, agent_filter: Optional[str] = None) -> None:
    key  = _cache_key(query, agent_filter)
    path = CACHE_DIR / f"{key}.json"
    path.unlink(missing_ok=True)


def clear_all() -> int:
    """Remove all cached entries. Returns count removed."""
    if not CACHE_DIR.exists():
        return 0
    count = 0
    for f in CACHE_DIR.glob("*.json"):
        f.unlink()
        count += 1
    return count
