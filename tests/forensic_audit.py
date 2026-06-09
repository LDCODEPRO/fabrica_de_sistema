"""Auditoria forense completa da FORJA OS."""
import urllib.request
import urllib.error
import json
import time
import sqlite3
import subprocess
import sys
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "nexus.db"

# Console Windows (cp1252) não suporta alguns caracteres das respostas LLM.
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

def http_get(path, timeout=5):
    try:
        r = urllib.request.urlopen(f"http://127.0.0.1:8000{path}", timeout=timeout)
        return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, {"error": str(e)}
    except Exception as e:
        return 0, {"error": str(e)}

def http_post(path, body, timeout=30):
    try:
        data = json.dumps(body).encode("utf-8")
        req = urllib.request.Request(f"http://127.0.0.1:8000{path}", data=data,
                                     headers={"Content-Type": "application/json"}, method="POST")
        r = urllib.request.urlopen(req, timeout=timeout)
        return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        try:
            body = json.loads(e.read())
        except:
            body = {"error": str(e)}
        return e.code, body
    except Exception as e:
        return 0, {"error": str(e)}

print("=" * 70)
print("FASE 1 — AUDITORIA FORENSE DE ENDPOINTS")
print("=" * 70)

endpoints = [
    "/api/health", "/api/status", "/api/chat/status",
    "/api/agents", "/api/missions", "/api/llm/providers",
    "/api/llm/health", "/api/audit", "/api/services",
    "/api/dashboard", "/api/billing/status", "/api/runtime/status",
]
ep_results = {}
for ep in endpoints:
    code, data = http_get(ep)
    status = "OK" if code == 200 else "FAIL"
    print(f"  {status:4s} [{code}] {ep}")
    ep_results[ep] = {"code": code, "status": status}

print()
print("=" * 70)
print("FASE 2 — AUDITORIA DO CHAT (FLUXO COMPLETO)")
print("=" * 70)

t0 = time.time()
code, chat_data = http_post("/api/chat/message", {
    "message": "Olá",
    "agent_key": "chat",
    "provider": "openrouter"
})
t1 = time.time()
elapsed = round((t1 - t0) * 1000)

print(f"  Status HTTP: {code}")
if code == 200:
    print(f"  Provider: {chat_data.get('provider_used', 'N/A')}")
    print(f"  Modelo: {chat_data.get('model', 'N/A')}")
    print(f"  Resposta: {repr(chat_data.get('message', '')[:200])}")
    print(f"  Session ID: {chat_data.get('session_id', 'N/A')}")
    print(f"  Tempo: {elapsed}ms")
    print(f"  Trail: {chat_data.get('fallback_trail', [])}")
    print(f"  RESULTADO: CHAT_FUNCIONAL")
else:
    print(f"  Erro: {chat_data}")
    print(f"  RESULTADO: CHAT_FALHOU")

print()
print("=" * 70)
print("FASE 3 — AUDITORIA DOS PROVIDERS (TESTE REAL INDIVIDUAL)")
print("=" * 70)

sys.path.insert(0, str(ROOT))
os.chdir(str(ROOT))  # necessario para .env ser encontrado
import provider_router as pr

provider_audit = {}
for prov in pr.PREFERRED_ORDER:
    cfg_status = pr.provider_status(prov)
    healthy = pr._is_provider_healthy(prov)
    print(f"\n  [{prov}]")
    print(f"    Configurado: {cfg_status}")
    print(f"    Health Registry: {'Saudavel' if healthy else 'Indisponivel'}")
    
    if cfg_status == "CONFIGURADO" and healthy:
        t0 = time.time()
        result = pr.execute_llm(prov, "Responda apenas: OK", max_tokens=10)
        t1 = time.time()
        elapsed_p = round((t1 - t0) * 1000)
        print(f"    Teste Real: {'SUCESSO' if result['ok'] else 'FALHOU'}")
        if result['ok']:
            print(f"    Resposta: {repr(result['response'][:100])}")
        else:
            print(f"    Erro: {result['error']}")
        print(f"    Tempo: {elapsed_p}ms")
        provider_audit[prov] = {
            "status": "ACTIVE_REAL" if result["ok"] else "FAILED_REAL",
            "response_time_ms": elapsed_p,
            "error": result.get("error")
        }
    else:
        reason = "NAO_CONFIGURADO" if cfg_status != "CONFIGURADO" else "HEALTH_INDISPONIVEL"
        print(f"    Teste Real: SKIP ({reason})")
        provider_audit[prov] = {"status": reason}

print()
print("=" * 70)
print("FASE 4 — AUDITORIA DO ROUTER (TRACE)")
print("=" * 70)

router_result = pr.execute_with_fallback("Teste de roteamento. Responda: ROTEADO.", max_tokens=20)
print(f"  OK: {router_result['ok']}")
print(f"  Provider Selecionado: {router_result.get('provider')}")
print(f"  Modelo: {router_result.get('model')}")
print(f"  Resposta: {repr(router_result.get('response', '')[:100])}")
print(f"  Trail de Fallback:")
for entry in router_result.get("fallback_trail", []):
    print(f"    - {entry}")

print()
print("=" * 70)
print("FASE 5 — AUDITORIA DO BANCO DE DADOS")
print("=" * 70)

if DB_PATH.exists():
    conn = sqlite3.connect(str(DB_PATH))
    cur = conn.cursor()
    
    # Listar tabelas
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = [r[0] for r in cur.fetchall()]
    print(f"  Banco: {DB_PATH}")
    print(f"  Tabelas encontradas: {len(tables)}")
    for t in tables:
        cur.execute(f"SELECT COUNT(*) FROM [{t}]")
        count = cur.fetchone()[0]
        print(f"    {t}: {count} registros")
    
    # Verificar chat_messages com dados reais
    print("\n  Ultimas 5 mensagens de chat:")
    try:
        cur.execute("SELECT id, session_key, sender, substr(content,1,80), provider_key, created_at FROM chat_messages ORDER BY id DESC LIMIT 5")
        rows = cur.fetchall()
        for row in rows:
            print(f"    ID={row[0]} sender={row[2]} provider={row[4]} conteudo={repr(row[3])}")
        if not rows:
            print("    NENHUMA mensagem encontrada")
    except Exception as e:
        print(f"    ERRO ao consultar chat_messages: {e}")
    
    # Verificar missions
    print("\n  Ultimas 5 missoes:")
    try:
        cur.execute("SELECT id, title, status, created_at FROM missions ORDER BY id DESC LIMIT 5")
        rows = cur.fetchall()
        for row in rows:
            print(f"    ID={row[0]} status={row[2]} titulo={repr(row[1][:60])}")
        if not rows:
            print("    NENHUMA missao encontrada")
    except Exception as e:
        print(f"    ERRO ao consultar missions: {e}")
    
    # Verificar evidences
    print("\n  Evidencias:")
    try:
        cur.execute("SELECT COUNT(*) FROM evidence")
        ecount = cur.fetchone()[0]
        print(f"    Total: {ecount}")
    except Exception as e:
        print(f"    Tabela evidence: {e}")
    
    # Verificar audit_log
    print("\n  Audit Log:")
    try:
        cur.execute("SELECT COUNT(*) FROM audit_log")
        acount = cur.fetchone()[0]
        print(f"    Total: {acount}")
        cur.execute("SELECT id, event_type, substr(details,1,80), created_at FROM audit_log ORDER BY id DESC LIMIT 3")
        for row in cur.fetchall():
            print(f"    ID={row[0]} tipo={row[1]} detalhe={repr(row[2])}")
    except Exception as e:
        print(f"    Tabela audit_log: {e}")
    
    conn.close()
else:
    print(f"  ERRO: Banco nao encontrado em {DB_PATH}")

print()
print("=" * 70)
print("FASE 6 — AUDITORIA DE INTEGRACOES")
print("=" * 70)

# Verificar .env
env_path = ROOT / ".env"
print(f"  .env existe: {env_path.exists()}")
if env_path.exists():
    env_content = env_path.read_text(encoding="utf-8")
    keys_found = []
    keys_missing = []
    check_keys = ["OPENROUTER_API_KEY", "OPENAI_API_KEY", "ANTHROPIC_API_KEY", "GOOGLE_API_KEY", "DEEPSEEK_API_KEY"]
    for k in check_keys:
        if k in env_content and len(env_content.split(k+"=")[1].split("\n")[0].strip()) > 8:
            keys_found.append(k)
        else:
            keys_missing.append(k)
    print(f"  Chaves encontradas: {keys_found}")
    print(f"  Chaves ausentes: {keys_missing}")

# CLIs
print("\n  CLIs de Assinatura:")
for cli_name in ["claude", "gemini", "codex"]:
    import shutil
    found = shutil.which(cli_name) or shutil.which(cli_name + ".cmd")
    print(f"    {cli_name}: {'ENCONTRADO' if found else 'NAO ENCONTRADO'} -> {found or 'N/A'}")

# Ollama
print("\n  Ollama:")
try:
    r = urllib.request.urlopen("http://127.0.0.1:11434/api/tags", timeout=3)
    data = json.loads(r.read())
    models = [m["name"] for m in data.get("models", [])]
    print(f"    Status: ONLINE ({len(models)} modelos: {models})")
except Exception as e:
    print(f"    Status: OFFLINE ({e})")

print()
print("=" * 70)
print("FASE 7 — AUDITORIA ZERO GHOST DO FRONTEND")
print("=" * 70)

home_path = ROOT / "16_SISTEMAS" / "FORJA_OS_PLATFORM" / "js" / "home.jsx"
data_path = ROOT / "16_SISTEMAS" / "FORJA_OS_PLATFORM" / "js" / "data.js"

ghost_patterns = [
    "LLMs Online", "Online e pronto", "Claude ativa", 
    "Provedores operacionais", "Pronto para execução real",
    "mockData", "fakeMetrics", "fakeProviders", "demoData",
    "sampleData", "placeholderResponses", "setTimeout.*fake",
]

for fpath in [home_path, data_path]:
    if fpath.exists():
        content = fpath.read_text(encoding="utf-8")
        print(f"\n  [{fpath.name}]")
        found_ghost = False
        for pattern in ghost_patterns:
            if pattern in content:
                print(f"    GHOST DETECTADO: '{pattern}'")
                found_ghost = True
        if not found_ghost:
            print(f"    LIMPO - Nenhum texto fantasma encontrado")

# Verificar todos os JSX
js_dir = ROOT / "16_SISTEMAS" / "FORJA_OS_PLATFORM" / "js"
for jsx_file in js_dir.glob("*.jsx"):
    content = jsx_file.read_text(encoding="utf-8")
    ghosts_found = []
    for pattern in ghost_patterns:
        if pattern in content:
            ghosts_found.append(pattern)
    if ghosts_found:
        print(f"\n  [{jsx_file.name}] GHOSTS: {ghosts_found}")

print()
print("=" * 70)
print("RESUMO FINAL DA AUDITORIA FORENSE")
print("=" * 70)

# Contagem real de providers
active_count = sum(1 for v in provider_audit.values() if v["status"] == "ACTIVE_REAL")
total_count = len(provider_audit)
print(f"\n  PROVIDERS ATIVOS REAIS: {active_count}/{total_count}")
for k, v in provider_audit.items():
    print(f"    {k}: {v['status']}")

print(f"\n  ENDPOINTS OK: {sum(1 for v in ep_results.values() if v['status'] == 'OK')}/{len(ep_results)}")
print(f"  CHAT: {'FUNCIONAL' if code == 200 else 'FALHO'}")
print(f"  ROUTER: {'FUNCIONAL' if router_result['ok'] else 'FALHO'}")
print(f"  BANCO: {'EXISTE' if DB_PATH.exists() else 'AUSENTE'}")

overall = "OPERATIONAL_REAL" if (code == 200 and router_result["ok"] and active_count > 0) else "NOT_OPERATIONAL"
print(f"\n  >>> STATUS GERAL: {overall} <<<")
