"""
test_billing_router.py — Valida billing real ($1/$30) e ordem do router de assinaturas.

Ordem oficial: claude -> openai -> gemini -> deepseek -> ollama.
Budgets: $1.00/dia, $30.00/mês. Sem expor secrets, sem seed/demo.
"""
import os
import sys
import time
import json
import socket
import subprocess
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
PORT = 8024
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


def run_tests():
    results = []
    def check(n, c, d=""): results.append((n, bool(c), d))

    import billing_config as bc
    import provider_router as pr

    # 1. budgets oficiais
    check("daily_budget_1", bc.DAILY_BUDGET_USD == 1.00, f"={bc.DAILY_BUDGET_USD}")
    check("monthly_budget_30", bc.MONTHLY_BUDGET_USD == 30.00, f"={bc.MONTHLY_BUDGET_USD}")
    check("no_old_150_limit", bc.MONTHLY_BUDGET_USD != 150, f"={bc.MONTHLY_BUDGET_USD}")

    # 2. ordem oficial: SÓ ASSINATURAS via CLI + ollama local
    expected = ["claude_sub", "gemini_sub", "codex_sub", "openrouter", "ollama"]
    check("router_order_subscriptions", pr.PREFERRED_ORDER == expected, f"={pr.PREFERRED_ORDER}")

    # 3. router não expõe secrets no status
    st = {p: pr.provider_status(p) for p in pr.PREFERRED_ORDER}
    check("router_no_secret", all(v in ("CONFIGURADO", "AUSENTE", "DESCONHECIDO") for v in st.values()), str(st))

    # 4. /api/billing/status real
    code, b = _get("/api/billing/status")
    check("billing_endpoint_200", code == 200, f"status={code}")
    check("billing_daily_1", b.get("daily_budget_usd") == 1.0, f"={b.get('daily_budget_usd')}")
    check("billing_monthly_30", b.get("monthly_budget_usd") == 30.0, f"={b.get('monthly_budget_usd')}")
    check("billing_source_valid", b.get("source") in ("real_usage", "sem_dados_reais"), f"source={b.get('source')}")
    check("billing_has_projection", "projection_usd" in b, f"keys={list(b.keys())}")

    # 5. execução real: usa uma assinatura (ou ollama local), respeitando a ordem
    r = pr.execute_with_fallback("Responda apenas: FORJA_PROVIDER_OK", max_tokens=256)
    check("real_exec_ok", r.get("ok") is True, f"err={r.get('error')}")
    check("real_exec_uses_order_provider", r.get("provider") in pr.PREFERRED_ORDER,
          f"usado={r.get('provider')}")
    # a trilha deve tentar as assinaturas ANTES do ollama
    trail_providers = [t.get("provider") for t in r.get("fallback_trail", [])]
    check("real_exec_tries_subs_first", trail_providers[0] in ("claude_sub", "codex_sub"),
          f"trilha={trail_providers}")

    # 6. ollama é o último da ordem (fallback local grátis)
    check("ollama_is_last", pr.PREFERRED_ORDER[-1] == "ollama", f"último={pr.PREFERRED_ORDER[-1]}")
    # 7. nenhuma API paga na ordem de execução (só assinaturas + local)
    paid = {"openai", "deepseek", "gemini", "claude"}
    check("no_paid_api_in_order", not (set(pr.PREFERRED_ORDER) & paid),
          f"order={pr.PREFERRED_ORDER}")

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
