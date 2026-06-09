# FORJA — MATRIZ DE CONECTIVIDADE (Frontend ↔ API ↔ Banco ↔ Runtime ↔ Providers)
**Data:** 2026-06-09 · validado por teste real

## 1. FLUXO DO CHAT (ponta a ponta) — ✅ CONECTADO

```
home.jsx (POST /api/chat/message)
   ↓
forja_os_server.chat_message
   ↓  persiste USER em chat_messages  (✅ nexus.db)
   ↓  monta histórico (memória)        (✅ recuperou "Hernando")
   ↓  provider_router.execute_for_group("conversation")
        → claude_sub (CLI, stdin)       (✅ resposta real)
        → openrouter (fallback)         (✅ resposta real)
   ↓  persiste resposta + AuditLog      (✅ chat_messages / audit_logs)
   ↓
home.jsx exibe message + via <provider> (✅)
```

## 2. MATRIZ POR FLUXO

| Fluxo | Frontend | API | Banco | Runtime/Provider | Veredito |
|---|---|---|---|---|---|
| Chat | home.jsx | `/api/chat/message` | chat_messages/sessions | provider_router → claude_sub/openrouter | **✅ CONECTADO (real)** |
| Status do chat | home.jsx | `/api/chat/status` | (registry.json) | — | **✅ CONECTADO** |
| Missões (listar) | *(estático)* | `/api/missions` ✅ | missions ✅ | — | **⚠️ API+banco OK; painel não consome ao vivo** |
| Agentes | *(estático)* | `/api/agents` ✅ | agents ✅ | — | **⚠️ API+banco OK; painel estático** |
| Providers/LLMs | *(estático)* | `/api/llm/providers` ✅ | llm_providers ✅ | health real ✅ | **⚠️ API+banco OK; painel estático** |
| Auditoria | *(estático)* | `/api/audit` ✅ | audit_logs ✅ | — | **⚠️ API+banco OK; painel estático** |
| Executar missão | *(centers_b órfão)* | `/api/missions/{id}/run` ✅ | missions/evidences ✅ | agent_runtime + provider real ✅ | **✅ backend OK; gatilho UI órfão** |
| Health-check provider | *(painel features)* | `/api/providers/health-check` ✅ | provider_health_checks ✅ | provider_router real ✅ | **✅ CONECTADO (backend)** |
| Agentic Core | — | `/api/agentic-core/*` ✅ | agent_actions/mission_events ✅ | tools reais ✅ | **✅ backend OK** |
| Home `/api/home/*` | centers_a órfão | **❌ inexistente** | — | — | **❌ DESCONECTADO (órfão, não bundlado)** |

Legenda: ✅ conectado e real · ⚠️ backend pronto, painel ainda estático · ❌ desconectado

## 3. CONCLUSÃO

- **O chat está 100% conectado** Frontend→API→Banco→Provider, com evidência real.
- **API e Banco estão prontos e corretos** para missões/agentes/providers/auditoria, mas o **painel
  servido** ainda lê esses blocos de `data.js` (estático honesto), porque a camada `api.js/hydrate`
  está órfã e com shapes incompatíveis (ver FRONTEND_AUDIT / REPAIR_REPORT).
- **Nenhuma conexão finge funcionar** — onde não está ao vivo, o painel mostra estado honesto.
