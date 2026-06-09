# FORJA — AUDITORIA FORENSE COMPLETA (PAINEL)
**Missão:** FORJA_PANEL_FORENSIC_REPAIR_AND_CERTIFICATION_V1
**Data:** 2026-06-09
**Executor:** Claude Code (autorizado pelo proprietário)
**Lei suprema:** ZERO GHOST — nada de status/dados fake. Se não funciona, mostrar que não funciona.

---

## 1. RESUMO EXECUTIVO

A FORJA OS foi auditada de ponta a ponta com **testes reais** (sem suposições). O defeito
central — **o chat não respondia** — foi **diagnosticado, corrigido e validado** com LLMs reais.
Os status de providers foram **sincronizados com a realidade** via health-checks reais, eliminando
um status fantasma (`openai_subscription` aparecia `CERTIFIED` sem responder).

| Indicador | Antes | Depois |
|---|---|---|
| Chat `/api/chat/message` | **503** `ASSISTED_SUBSCRIPTION_REQUIRES_HUMAN_INTERFACE` | **200** resposta real (`claude_sub`) |
| Memória/persistência do chat | não verificada | **OK** (recuperou "Hernando"; 4 msgs persistidas) |
| Providers online sem evidência | `openai_subscription=CERTIFIED` (falha real) | `ENVIRONMENT_PENDING` (honesto) |
| Ghost de latência no bundle servido | `"120ms"` no `app.js` | **removido** (rebuild) |
| Endpoints HTTP | 12/12 OK | 12/12 OK |
| Testes unitários relevantes | — | **45 passed** |
| Status geral (script forense) | `CHAT_FALHOU` | **`OPERATIONAL_REAL`** |

---

## 2. MATRIZ DE COMPONENTES (forense)

| Componente | Arquivo | Endpoint | Banco | STATUS |
|---|---|---|---|---|
| Servidor / API | `forja_os_server.py` | 30+ rotas `/api/*` | nexus.db | **OK** |
| Chat (backend) | `forja_os_server.py::chat_message` | `POST /api/chat/message` | chat_sessions, chat_messages | **OK (corrigido)** |
| Roteador de assinaturas | `provider_router.py` | — | — | **OK (corrigido)** |
| Roteador por registry | `17_AUTOMACOES/LLM_ROUTER/llm_router.py` | (usado p/ missões) | — | **PARCIAL** (sem adapter p/ assinaturas; causou o bug do chat) |
| Governança de providers | `provider_governance.py` | `/api/providers/*` | llm_providers, provider_health_checks | **OK (refinado)** |
| Painel (build servido) | `dist/assets/app.js` (bundle) | `/painel` | — | **OK (rebuild)** |
| Camada de hidratação | `js/api.js` (`ForjaAPI.hydrate`) | vários `/api/*` | — | **DESCONECTADO** (não está no bundle; shapes incompatíveis) |
| Centros executivos legados | `js/centers_*.jsx` | `/api/home/*` (inexistentes) | — | **DESCONECTADO** (órfãos, não bundlados) |
| Banco de dados | `nexus.db` | — | 19 tabelas | **OK** |
| Agentic Core | `forja_os_server.py::/api/agentic-core/*` | `/api/agentic-core/*` | agent_actions, mission_events | **OK** |
| Runtime de missões | `agent_runtime.py` | `/api/missions/{id}/run`, `/api/runtime/*` | missions, evidences | **OK** |
| Ollama (local) | `_check_ollama_health` | `/api/llm/health` | — | **ENVIRONMENT_PENDING** (daemon desligado) |

Legenda: OK · PARCIAL · QUEBRADO · DESCONECTADO · NÃO IMPLEMENTADO

---

## 3. EVIDÊNCIA DE EXECUÇÃO (script forense `tests/forensic_audit.py`)

```
FASE 1 — ENDPOINTS:  12/12 OK [200]
FASE 2 — CHAT:       HTTP 200 · provider real · "No aguardo da instrução." · CHAT_FUNCIONAL
FASE 3 — PROVIDERS:  claude_sub=ACTIVE_REAL · gemini_sub=ACTIVE_REAL · openrouter=ACTIVE_REAL
                     codex_sub=FAILED_REAL · ollama=HEALTH_INDISPONIVEL
FASE 4 — ROUTER:     OK · provider=claude_sub · "ROTEADO."
FASE 5 — BANCO:      19 tabelas, dados reais (chat_messages=109, missions=9, agents=14, audit_logs=90)
FASE 7 — FRONTEND:   home.jsx LIMPO · data.js LIMPO
>>> STATUS GERAL: OPERATIONAL_REAL <<<
```

Saída completa: [forensic_run_FINAL.txt](../forensic_run_FINAL.txt)

---

## 4. DEFEITOS ENCONTRADOS E TRATAMENTO

| # | Defeito | Gravidade | Tratamento |
|---|---|---|---|
| D1 | Chat sempre 503 — router de registry retorna falha no 1º provider assistido | **CRÍTICA** | Reroteado para `provider_router` (assinaturas reais). Corrigido. |
| D2 | `claude` CLI falhava com system-prompt longo (`--system-prompt` multilinha) | **CRÍTICA** | Prompt enviado via **stdin** + `--print`. Corrigido. |
| D3 | Erro de automação (gemini/codex) retornado como "resposta" do modelo (ghost) | **ALTA (Zero Ghost)** | Detector de erro de CLI → levanta exceção e faz fallback. Corrigido. |
| D4 | `openai_subscription` = `CERTIFIED` sem responder | **ALTA (Zero Ghost)** | Health-check real → `ENVIRONMENT_PENDING`. Corrigido. |
| D5 | Bundle servido com latência fake `"120ms"` (build defasado) | **MÉDIA (Zero Ghost)** | `npm run build` (esbuild) regenerado. Corrigido. |
| D6 | `api.js` (hidratação backend) órfão e com shapes incompatíveis com componentes bundlados | **MÉDIA** | **Documentado** (não wirado: faria o painel quebrar). Ver REPAIR_REPORT. |
| D7 | `tests/forensic_audit.py` quebrava no console cp1252 (UnicodeEncodeError) | BAIXA | `stdout/stderr` reconfigurados p/ utf-8. Corrigido. |

---

## 5. VEREDITO

**FORJA_PARTIAL_WITH_EVIDENCE** — núcleo operacional (chat, providers, banco, API, honestidade do
painel) **CERTIFICADO com evidência real**; pendências restantes são de **ambiente** (codex/ollama/kimi)
e **arquiteturais** (hidratação live do painel não-chat), todas documentadas sem mascaramento.

Ver [FORJA_FINAL_CERTIFICATION_REPORT.md](FORJA_FINAL_CERTIFICATION_REPORT.md).
