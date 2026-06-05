"""
test_real_agent_runtime.py — Testes do runtime real de agentes da FORJA OS.

Sobe o servidor real em porta isolada e valida execução real ponta a ponta.
Sem mocks. Requer ao menos 1 provider configurado.

Uso: python test_real_agent_runtime.py
"""
import os
import sys
import time
import json
import socket
import sqlite3
import subprocess
import urllib.request
from pathlib import Path

ROOT = Path(__file__).parent
DB_PATH = ROOT / "nexus.db"
PORT = 8022
BASE = f"http://127.0.0.1:{PORT}"


def _get(path):
    req = urllib.request.Request(BASE + path, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.status, json.loads(r.read())


def _post(path):
    req = urllib.request.Request(BASE + path, method="POST",
                                 headers={"Accept": "application/json"}, data=b"")
    with urllib.request.urlopen(req, timeout=180) as r:
        return r.status, json.loads(r.read())


def _wait_port(port, timeout=20):
    start = time.time()
    while time.time() - start < timeout:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", port)) == 0:
                return True
        time.sleep(0.4)
    return False


def _seed_executable_mission():
    """Garante uma missão executável (status QUEUED) para o teste. Idempotente."""
    conn = sqlite3.connect(str(DB_PATH))
    title = "[SEED][TEST] Missão de teste de runtime real"
    row = conn.execute("SELECT id, status FROM missions WHERE title=?", (title,)).fetchone()
    if row:
        mid = row[0]
        conn.execute("UPDATE missions SET status='QUEUED' WHERE id=?", (mid,))
    else:
        from datetime import datetime
        now = datetime.utcnow().isoformat()
        cur = conn.execute(
            "INSERT INTO missions (title, description, status, created_at, updated_at) "
            "VALUES (?,?,?,?,?)",
            (title, "Validar execução real do runtime de agentes.", "QUEUED", now, now))
        mid = cur.lastrowid
    conn.commit()
    conn.close()
    return mid


def run_tests():
    results = []

    def check(name, cond, detail=""):
        results.append((name, bool(cond), detail))

    # 1. provider router carrega sem expor secrets
    import provider_router as pr
    statuses = {p: pr.provider_status(p) for p in pr.PREFERRED_ORDER}
    check("router_loads_no_secret", all(v in ("CONFIGURADO", "AUSENTE", "DESCONHECIDO")
                                         for v in statuses.values()), str(statuses))

    # 2. ao menos 1 provider real responde OK
    available = [p for p, s in statuses.items() if s == "CONFIGURADO"]
    real_ok = None
    for p in available:
        r = pr.execute_llm(p, "Responda apenas: FORJA_PROVIDER_OK", max_tokens=256)
        if r["ok"]:
            real_ok = p
            break
    check("at_least_one_provider_ok", real_ok is not None, f"provider_ok={real_ok}")

    # prepara missão executável
    mid = _seed_executable_mission()
    before = _get(f"/api/missions/MIS-{mid:03d}")[1].get("status")

    # 3. POST run executa missão real
    code, run = _post(f"/api/missions/MIS-{mid:03d}/run")
    check("run_endpoint_200", code == 200, f"status={code}")
    check("run_ok", run.get("ok") is True, f"ok={run.get('ok')} err={run.get('error')}")

    # 4. status RUNNING/QUEUED -> COMPLETED
    after = _get(f"/api/missions/MIS-{mid:03d}")[1].get("status")
    check("status_changed_to_completed", after == "COMPLETED", f"antes={before} depois={after}")

    # 5. evidence criada no banco
    check("evidence_id_present", bool(run.get("evidence_id")), f"evidence_id={run.get('evidence_id')}")

    # 6. arquivo .md de evidência criado
    art = run.get("artifact_path") or ""
    check("evidence_md_file_exists", bool(art) and Path(art).exists(), art)

    # 7. /evidences retorna evidência
    code, ev = _get(f"/api/missions/MIS-{mid:03d}/evidences")
    check("evidences_endpoint_real", code == 200 and ev.get("total", 0) >= 1 and
          ev.get("source") == "real_database", f"total={ev.get('total')}")

    # 8. /api/runtime/status operacional
    code, rs = _get("/api/runtime/status")
    check("runtime_status_operational", code == 200 and rs.get("operational") is True,
          f"operational={rs.get('operational')}")

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
        print(f"  [{'OK' if ok else 'FAIL'}] {name}  {detail}")
    print(f"\nRESULT: {passed} passed, {failed} failed")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
