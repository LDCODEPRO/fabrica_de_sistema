# FORJA — AUDITORIA DO BACKEND / API
**Data:** 2026-06-09 · servidor: `forja_os_server.py` (FastAPI) · porta 8000

## 1. ENDPOINTS — TESTE REAL (12/12 OK [200])

| Endpoint | Método | Status | Fonte de dados |
|---|---|---|---|
| `/api/health` | GET | 200 | runtime |
| `/api/status` | GET | 200 | nexus.db + ollama real |
| `/api/chat/status` | GET | 200 | provider_registry.json |
| `/api/agents` | GET | 200 | tabela `agents` (real) |
| `/api/missions` | GET | 200 | tabela `missions` (real) |
| `/api/llm/providers` | GET | 200 | tabela `llm_providers` (real) |
| `/api/llm/health` | GET | 200 | Ollama real-time |
| `/api/audit` | GET | 200 | tabela `audit_logs` (real) |
| `/api/services` | GET | 200 | health real (FastAPI/DB/Ollama) |
| `/api/dashboard` | GET | 200 | nexus.db (KPIs reais) |
| `/api/billing/status` | GET | 200 | billing_config |
| `/api/runtime/status` | GET | 200 | agent_runtime |

Outros endpoints inventariados (todos com backend real): `POST /api/chat/message`,
`/api/chat/session/{id}`, `POST /api/chat/session/{id}/handoff`, `/api/missions/{id}`,
`POST /api/missions`, `POST /api/missions/{id}/run`, `/api/missions/{id}/evidences`,
`/api/agents/{id}`, `/api/agents/{id}/providers`, `POST /api/agents/{id}/run`,
`/api/providers/status`, `POST /api/providers/health-check`, `/api/providers/test`,
`/api/panel/status`, `/api/panel/features`, `/api/panel/truth-status`, `/api/projects`,
`POST /api/config/keys`, `/api/config/keys`, `/api/agentic-core/*`, `/api/runtime/tick|queue`.

## 2. MUDANÇAS APLICADAS NO BACKEND

`forja_os_server.py::chat_message` — **reescrito** para rotear via `provider_router`
(assinaturas reais), com persistência de erro honesta e `fallback_trail` no retorno.
(Detalhe em FORJA_CHAT_AUDIT.md.)

## 3. TRATAMENTO DE ERRO

- Chat: em falha total, persiste `ChatMessage(sender="system", provider_status="ERROR")` +
  `AuditLog` e retorna **503** com o erro real (não finge sucesso).
- Providers de API: `urllib.error.HTTPError` tratado sem vazar corpo/credencial.
- `/api/status`, `/api/panel/truth-status`, `/api/dashboard`: `try/except` por consulta;
  quando não há dado real, retornam rótulos honestos (`"SEM DADOS REAIS"`, `"NÃO MONITORADO"`).

## 4. ENDPOINTS FANTASMA / DESCONECTADOS

- `/api/home/overview|health|providers|missions|github|timeline|alerts|evidence` — **NÃO EXISTEM**
  no backend. São chamados apenas por `js/centers_a.jsx`, que **não está no bundle** (órfão). Sem
  impacto no painel servido; recomenda-se remover os arquivos `centers_*.jsx` legados.

## 5. OBSERVAÇÕES (não-bloqueantes)

- **Dois roteadores** coexistem: `provider_router.py` (assinaturas/CLI — usado por chat e
  `/api/agents/{id}/run`) e `17_AUTOMACOES/LLM_ROUTER/llm_router.py` (registry — usado por missões).
  O segundo não tem adapter para assinaturas (foi a causa do bug do chat). Recomenda-se unificar.
- `/api/auth/login` é bypass (retorna token fixo) — adequado para V005 lite local; **não usar em produção**.

## 6. STATUS

**OK** — 12/12 endpoints respondem; dados reais do `nexus.db`; tratamento de erro honesto.
45 testes unitários relevantes **passaram** após as mudanças.
