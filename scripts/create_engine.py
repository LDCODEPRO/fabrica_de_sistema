import os

base_dir = "17_RUNTIME/reality_engine"
os.makedirs(base_dir, exist_ok=True)

collectors = [
    "project_collector.py",
    "mission_collector.py",
    "provider_collector.py",
    "database_collector.py",
    "github_collector.py",
    "filesystem_collector.py",
    "timeline_collector.py",
    "alert_collector.py",
    "evidence_collector.py",
    "deployment_collector.py",
]

content = '''def collect():
    """Coletor isolado para garantir o Reality First."""
    return {
        "status": "not_configured",
        "items": [],
        "source": "reality_engine"
    }
'''

for file_name in collectors:
    with open(os.path.join(base_dir, file_name), "w", encoding="utf-8") as f:
        f.write(content)

with open(os.path.join(base_dir, "__init__.py"), "w", encoding="utf-8") as f:
    f.write("# Reality Engine Module\n")
