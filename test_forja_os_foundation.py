"""
test_forja_os_foundation.py — Teste de fundação do FORJA OS conectado.

Valida que o painel oficial está ligado ao backend e ao nexus.db.
Sobe o servidor real em porta isolada, testa endpoints e o bundle.

Uso: python test_forja_os_foundation.py
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
PORT = 8021
BASE = f"http://127.0.0.1:{PORT}"


def _get(path):
    req = urllib.request.Request(BASE + path, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.status, json.loads(resp.read())


def _wait_port(port, timeout=20):
    start = time.time()
    while time.time() - start < timeout:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", port)) == 0:
                return True
        time.sleep(0.4)
    return False


def run_tests():
    results = []

    def check(name, cond, detail=""):
        results.append((name, bool(cond), detail))

    # 1. /api/health
    code, data = _get("/api/health")
    check("health_200", code == 200, f"status={code}")
    check("health_ok", data.get("status") == "ok", f"status={data.get('status')}")

    # 2. /api/agents total >= 11
    code, data = _get("/api/agents")
    check("agents_200", code == 200, f"status={code}")
    check("agents_total_ge_11", data.get("total", 0) >= 11, f"total={data.get('total')}")
    check("agents_source_real", data.get("source") == "real_database", f"source={data.get('source')}")

    # 3. /api/missions total >= 5
    code, data = _get("/api/missions")
    check("missions_200", code == 200, f"status={code}")
    check("missions_total_ge_5", data.get("total", 0) >= 5, f"total={data.get('total')}")
    check("missions_source_real", data.get("source") == "real_database", f"source={data.get('source')}")

    # 4. /api/audit sem erro SQL (200 + source real + lista coerente)
    code, data = _get("/api/audit")
    check("audit_200", code == 200, f"status={code}")
    check("audit_source_real", data.get("source") == "real_database", f"source={data.get('source')}")
    check("audit_no_sql_error_note", "note" not in data or "Sem registros" not in data.get("note", ""),
          "endpoint nao mascara erro SQL")

    # 5. bundle contém chamadas /api/*
    bundle_txt = BUNDLE.read_text(encoding="utf-8", errors="ignore") if BUNDLE.exists() else ""
    for ep in ["/api/agents", "/api/missions", "/api/llm/providers", "/api/audit", "/api/health", "/api/status"]:
        check(f"bundle_has_{ep}", ep in bundle_txt, "presente" if ep in bundle_txt else "AUSENTE")

    return results


def main():
    if _wait_port(PORT, timeout=1):
        print(f"AVISO: porta {PORT} ja em uso. Encerre processos antigos.")
        return 1

    env = dict(os.environ, PYTHONIOENCODING="utf-8")
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "forja_os_server:app",
         "--host", "127.0.0.1", "--port", str(PORT), "--log-level", "error"],
        cwd=str(ROOT), env=env,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
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
        print(f"  [{'OK' if ok else 'FAIL'}] {name}  {detail}")
    print(f"\nRESULT: {passed} passed, {failed} failed")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
