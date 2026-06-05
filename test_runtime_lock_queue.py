"""
test_runtime_lock_queue.py — Anti-regressão do Runtime Real + Fila Operacional.

Valida fila (QUEUED→RUNNING→COMPLETED), tick, trava de concorrência e audit_logs.
Sem mocks. Sobe servidor real em porta isolada.
"""
import os
import sys
import time
import json
import socket
import sqlite3
import subprocess
import urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent
DB_PATH = ROOT / "nexus.db"
PORT = 8023
BASE = f"http://127.0.0.1:{PORT}"


def _get(path):
    req = urllib.request.Request(BASE + path, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.status, json.loads(r.read())


def _post(path):
    req = urllib.request.Request(BASE + path, method="POST", data=b"",
                                 headers={"Accept": "application/json"})
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


def _seed_queued(title):
    conn = sqlite3.connect(str(DB_PATH))
    row = conn.execute("SELECT id FROM missions WHERE title=?", (title,)).fetchone()
    now = datetime.utcnow().isoformat()
    if row:
        mid = row[0]
        conn.execute("UPDATE missions SET status='QUEUED', updated_at=? WHERE id=?", (now, mid))
    else:
        cur = conn.execute(
            "INSERT INTO missions (title, description, status, created_at, updated_at) "
            "VALUES (?,?,?,?,?)", (title, "Teste de fila/tick.", "QUEUED", now, now))
        mid = cur.lastrowid
    conn.commit()
    conn.close()
    return mid


def run_tests():
    results = []
    def check(n, c, d=""): results.append((n, bool(c), d))

    import provider_router as pr
    import agent_runtime as ar

    # 1. router sem secret
    st = {p: pr.provider_status(p) for p in pr.PREFERRED_ORDER}
    check("router_no_secret", all(v in ("CONFIGURADO", "AUSENTE", "DESCONHECIDO") for v in st.values()), str(st))

    # 2. seed QUEUED + queue mostra
    mid = _seed_queued("[SEED][TEST] Fila operacional tick")
    code, q = _get("/api/runtime/queue")
    check("queue_endpoint_200", code == 200 and "counts" in q, f"counts={q.get('counts')}")
    check("queue_has_queued", q["counts"].get("QUEUED", 0) >= 1, f"QUEUED={q['counts'].get('QUEUED')}")

    # 3. trava de concorrência (in-process): simula missão já em execução
    with ar._LOCK:
        ar._RUNNING_IDS.add(mid)
    locked = ar.run_mission(mid)
    with ar._LOCK:
        ar._RUNNING_IDS.discard(mid)
    check("lock_prevents_double_run", locked["ok"] is False and "lock" in (locked.get("error") or ""),
          f"error={locked.get('error')}")

    # 4. tick executa próxima QUEUED
    code, t = _post("/api/runtime/tick")
    check("tick_200", code == 200, f"status={code}")
    check("tick_executed", t.get("executed") is True and t.get("ok") is True, f"executed={t.get('executed')}")
    check("tick_completed", t.get("status") == "COMPLETED", f"status={t.get('status')}")
    check("tick_real_provider", bool(t.get("provider")), f"provider={t.get('provider')}")

    # 5. audit_logs tem QUEUE_TICK_CLAIM
    conn = sqlite3.connect(str(DB_PATH))
    claims = conn.execute(
        "SELECT COUNT(*) FROM audit_logs WHERE event_type='QUEUE_TICK_CLAIM'").fetchone()[0]
    transitions = conn.execute(
        "SELECT COUNT(*) FROM audit_logs WHERE event_type IN "
        "('MISSION_RUNNING','MISSION_COMPLETED')").fetchone()[0]
    conn.close()
    check("audit_queue_claim", claims >= 1, f"QUEUE_TICK_CLAIM={claims}")
    check("audit_transitions", transitions >= 2, f"transitions={transitions}")

    # 6. tick em fila vazia: drena e retorna executed=false eventualmente
    for _ in range(10):
        code, t = _post("/api/runtime/tick")
        if not t.get("executed"):
            break
    check("tick_empty_queue_safe", t.get("ok") is True and t.get("executed") is False,
          f"executed={t.get('executed')} reason={t.get('reason')}")

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
