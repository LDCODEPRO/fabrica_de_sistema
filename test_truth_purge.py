"""
test_truth_purge.py — Garante que o painel não exibe dados falsos.

Verifica o bundle buildado + endpoints reais. Sem mocks.
"""
import os
import sys
import time
import json
import socket
import subprocess
import urllib.request
from pathlib import Path

ROOT = Path(__file__).parent
BUNDLE = ROOT / "16_SISTEMAS" / "FORJA_OS_PLATFORM" / "dist" / "assets" / "app.js"
PORT = 8025
BASE = f"http://127.0.0.1:{PORT}"


def _get(path):
    req = urllib.request.Request(BASE + path, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.status, json.loads(r.read())


def _wait_port(port, timeout=20):
    start = time.time()
    while time.time() - start < timeout:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", port)) == 0:
                return True
        time.sleep(0.4)
    return False


# Literais fabricados que NÃO podem mais existir no bundle
FORBIDDEN = [
    "99.99%", "99.97%", "99.82%",          # uptime fake
    "1.284", "1284 pacotes",               # eventos fake
    "94% cobertura",                        # cobertura fake
    "Portal Fábrica", "ERP Forja", "CRM Comercial",  # projetos fake
    "A. Ramos", "M. Costa", "L. Dias",     # owners fake
    "DPL-2207", "DPL-2206",                # deploys fake
    "Feito. Gerei os artefatos",           # chat fake
    "24ms", "482ms",                        # pings fake
    "$150", "R$ 150",                       # limite antigo
]

REQUIRED = [
    "SEM DADOS REAIS",
    "MONITORADO",
    "CALCULADA",
    "VINCULADA",          # "SEM EXECUÇÃO REAL VINCULADA"
    "/api/billing/status",
    "/api/dashboard",
]


def run_tests():
    results = []
    def check(n, c, d=""): results.append((n, bool(c), d))

    txt = BUNDLE.read_text(encoding="utf-8", errors="ignore") if BUNDLE.exists() else ""

    # 1-8. nenhum literal fake permanece
    for lit in FORBIDDEN:
        check(f"no_fake::{lit}", lit not in txt, "ausente" if lit not in txt else "AINDA PRESENTE")

    # 9. strings honestas presentes
    for lit in REQUIRED:
        check(f"has_honest::{lit}", lit in txt, "presente" if lit in txt else "AUSENTE")

    # 10. billing real $1/$30
    code, b = _get("/api/billing/status")
    check("billing_daily_1", b.get("daily_budget_usd") == 1.0, f"={b.get('daily_budget_usd')}")
    check("billing_monthly_30", b.get("monthly_budget_usd") == 30.0, f"={b.get('monthly_budget_usd')}")
    check("billing_source_valid", b.get("source") in ("real_usage", "sem_dados_reais"), f"={b.get('source')}")

    # 11. truth-status lista origem de cada bloco
    code, ts = _get("/api/panel/truth-status")
    check("truth_status_200", code == 200, f"status={code}")
    cards = {c["card"]: c for c in ts.get("cards", [])}
    check("truth_has_cards", len(cards) >= 10, f"n={len(cards)}")
    check("truth_uptime_honest", cards.get("uptime", {}).get("source") == "sem_dados_reais",
          f"{cards.get('uptime')}")
    check("truth_missions_real", cards.get("missions", {}).get("source") == "real_database",
          f"{cards.get('missions')}")
    check("truth_projects_honest", cards.get("projects", {}).get("source") == "sem_dados_reais",
          f"{cards.get('projects')}")

    # 12. ordem do provider router: só assinaturas via CLI + ollama
    import provider_router as pr
    check("router_order", pr.PREFERRED_ORDER == ["claude_sub", "codex_sub", "ollama"],
          f"={pr.PREFERRED_ORDER}")

    return results


def main():
    if _wait_port(PORT, timeout=1):
        print(f"AVISO: porta {PORT} ja em uso.")
        return 1
    env = dict(os.environ, PYTHONIOENCODING="utf-8")
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "forja_os_server:app",
         "--host", "127.0.0.1", "--port", str(PORT), "--log-level", "error"],
        cwd=str(ROOT), env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        if not _wait_port(PORT, timeout=20):
            print("FAIL: servidor nao subiu")
            return 1
        time.sleep(1)
        results = run_tests()
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except Exception:
            proc.kill()

    passed = sum(1 for _, ok, _ in results if ok)
    failed = len(results) - passed
    for name, ok, detail in results:
        mark = "OK" if ok else "FAIL"
        print(f"  [{mark}] {name}  {detail}")
    print(f"\nRESULT: {passed} passed, {failed} failed")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
