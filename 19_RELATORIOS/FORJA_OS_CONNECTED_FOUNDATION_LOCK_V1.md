# FORJA_OS_CONNECTED_FOUNDATION_LOCK_V1
**Data:** 2026-06-05  
**Status:** FOUNDATION LOCKED 🔒  
**Autoridade:** Fábrica de Sistemas

---

## OBJETIVO

Congelar e proteger o estado do FORJA OS após a ligação real do painel oficial ao backend FastAPI e ao banco `nexus.db`.

> A partir deste lock, evolução deve ocorrer **sobre** os artefatos oficiais — nunca criando paralelos.

---

## ARTEFATOS OFICIAIS (CONGELADOS)

### Frontend oficial
```
Caminho:    D:\FABRICA_DE_SISTEMAS\16_SISTEMAS\FORJA_OS_PLATFORM\
Framework:  React 18.3.1 + esbuild 0.27.1 (bundle IIFE) — sem Vite
Fonte:      js/data.js, js/api.js, js/shared.jsx, js/shell.jsx,
            js/explorer.jsx, js/copilot.jsx, js/centers_a/b/c.jsx, js/app.jsx
Build:      dist/index.html + dist/assets/app.js (262.1kb)
Camada API: js/api.js → window.ForjaAPI.hydrate()
```

### Backend oficial
```
Caminho:    D:\FABRICA_DE_SISTEMAS\forja_os_server.py
Framework:  FastAPI + uvicorn
Shims:      _compat_db.py, _compat_models.py
```

### Banco oficial
```
Caminho:    D:\FABRICA_DE_SISTEMAS\nexus.db
Driver:     SQLite (sqlite:///nexus.db)
Tabelas em uso: missions, agents, audit_logs, evidences, knowledge_queries
```

---

## ENDPOINTS ATIVOS

| Endpoint | Fonte | Validado |
|----------|-------|----------|
| `/api/health` | sistema | ✅ 200, status=ok |
| `/api/status` | DB + Ollama | ✅ 200 |
| `/api/missions` | nexus.db | ✅ 200, total=5, real_database |
| `/api/missions/{id}` | nexus.db | ✅ |
| `/api/agents` | nexus.db | ✅ 200, total=11, real_database |
| `/api/llm/providers` | provider_registry.json | ✅ 200, 9 providers |
| `/api/llm/health` | Ollama local | ✅ active_real |
| `/api/audit` | nexus.db | ✅ 200, real_database, sem WARNING SQL |
| `/` (SPA) | dist/index.html | ✅ |

---

## DADOS REAIS CARREGADOS

| Entidade | Quantidade real | source |
|----------|----------------|--------|
| Agentes | 11 | backend_real |
| Missões | 5 ([SEED] operacional) | backend_real |
| Auditoria | 3 | backend_real |
| Providers LLM | 9 | backend_real |
| Serviços/status | health + Ollama | backend_real |

---

## FALLBACK `window.FORJA` — APENAS CONTINGÊNCIA

```
window.FORJA permanece definido em js/data.js.
É usado SOMENTE quando o backend falha ou retorna lista vazia.
Marcação de origem em window.FORJA._live.sources:
  - backend_real          → dado veio do nexus.db
  - fallback_window_forja → backend indisponível/vazio
```

Comportamento provado:
- Backend OK → `sources.{agentes,missoes,llms,auditoria,services} = backend_real`
- Backend falha → mantém `window.FORJA` estático sem quebrar o painel

---

## COMMITS DA FUNDAÇÃO

| Hash | Descrição |
|------|-----------|
| `24da25b` | Conecta painel oficial ao backend real via api.js + fix bug audit |
| `1063288` | Seed de 5 missões reais + validação do painel |

---

## TESTE DE FUNDAÇÃO

```
Arquivo: test_forja_os_foundation.py
RESULT: 17 passed, 0 failed

  [OK] health_200 / health_ok
  [OK] agents_200 / agents_total_ge_11 (11) / agents_source_real
  [OK] missions_200 / missions_total_ge_5 (5) / missions_source_real
  [OK] audit_200 / audit_source_real / audit_no_sql_error_note
  [OK] bundle_has_/api/{agents,missions,llm/providers,audit,health,status}
```

---

## REGRA DE PROTEÇÃO

Ver: `00_GOVERNANCA/FORJA_OS_PROTECTION_RULE.md`

```
PROIBIDO sem autorização explícita da Diretoria:
- Criar novo painel para FORJA OS
- Criar novo backend para FORJA OS
- Duplicar o banco nexus.db
- Trocar o framework (React/esbuild → outro)

Evolução PERMITIDA somente sobre:
- D:\FABRICA_DE_SISTEMAS\16_SISTEMAS\FORJA_OS_PLATFORM\
- D:\FABRICA_DE_SISTEMAS\forja_os_server.py
- D:\FABRICA_DE_SISTEMAS\nexus.db
```

---

_Fábrica de Sistemas · FORJA OS Connected Foundation Lock V1 · 2026-06-05_
