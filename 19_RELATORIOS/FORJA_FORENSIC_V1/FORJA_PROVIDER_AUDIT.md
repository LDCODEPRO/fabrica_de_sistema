# FORJA — AUDITORIA DE PROVIDERS (LLMs)
**Data:** 2026-06-09 · **Zero Ghost — só status com evidência real**

## 1. TESTE REAL INDIVIDUAL (`provider_router.execute_llm`)

| Provider (exec) | Configurado | Teste real | Latência | Evidência |
|---|---|---|---|---|
| `claude_sub` (Claude assinatura/CLI) | CONFIGURADO | **SUCESSO** | ~4.3s | resposta `"OK"` / `"PONG"` |
| `gemini_sub` (Google One, automação) | CONFIGURADO | **SUCESSO** | ~26s | resposta `"O Gemini disse\n\nOK"` |
| `codex_sub` (ChatGPT, automação) | CONFIGURADO | **FALHOU** | ~19s | `ERRO: Não foi possível encontrar o campo de texto do ChatGPT` |
| `openrouter` (gateway autorizado) | CONFIGURADO | **SUCESSO** | ~1s | resposta `"OK"`, modelo `deepseek/deepseek-chat` |
| `ollama` (local) | CONFIGURADO | **SKIP/FALHA** | — | daemon offline (WinError 10061) |

**Providers ativos reais: 3/5** (claude_sub, gemini_sub, openrouter).

## 2. STATUS PERSISTIDO (tabela `llm_providers`, após health-check real)

| provider_key | health_status | allowed_for_agents | Observação |
|---|---|---|---|
| claude_subscription | **active_real** | True | Verificado por chamada real |
| openai_subscription | **ENVIRONMENT_PENDING** | False | ⬅ era `CERTIFIED` (ghost). Codex falha: login/automação |
| gemini_subscription | **active_real** | True | Automação de navegador responde (lenta) |
| deepseek_v4_router | **ROUTER_LIMITED** | True | Via OpenRouter (chave ativa) |
| kimi_k26_router | **ENVIRONMENT_PENDING** | False | Modelo `moonshotai/kimi-k2.6` não habilitado na conta |
| ollama_local | **ENVIRONMENT_PENDING** | False | Daemon local desligado |

## 3. POR PROVIDER (checklist da missão)

### Claude — **OK / active_real**
existe? sim · configurado? sim (CLI no PATH) · health real? **sim, responde** · conectado ao painel? sim (chat usa como primário).

### OpenAI/ChatGPT (codex) — **ENVIRONMENT_PENDING**
existe? sim (script) · configurado? sim · health real? **não responde** (automação não acha o campo de texto / sessão). Não mascarado: marcado pendente, `allowed=False`. Depende de **login/sessão** do ChatGPT.

### Gemini — **OK / active_real**
existe? sim · health real? **sim, responde** (via automação Google One, ~26s). CLI `gemini` não está no PATH, mas o `python_script` de automação funciona.

### DeepSeek — **ROUTER_LIMITED (via OpenRouter)** / API direta **BLOCK**
`deepseek_api` direta: sem chave (`DEEPSEEK_API_KEY` ausente) → bloqueada honestamente. Via `deepseek_v4_router` (OpenRouter): **funciona**.

### Kimi (Moonshot) — **ENVIRONMENT_PENDING**
Via OpenRouter, modelo `moonshotai/kimi-k2.6` retorna "sem modelo disponível" → não habilitado. Honesto.

### Ollama — **ENVIRONMENT_PENDING**
Daemon `http://127.0.0.1:11434` recusou conexão. Health real em tempo real em `/api/llm/health`.

## 4. CORREÇÕES APLICADAS (Zero Ghost)

1. **Detector de erro de automação** em `provider_router._gemini_cli`/`_codex_cli`: saída de erro
   nunca mais vira "resposta".
2. **Health-checks reais** re-sincronizaram a tabela `llm_providers` → eliminou o
   `openai_subscription=CERTIFIED` fantasma.
3. **Classificação refinada** em `provider_governance.status_from_result`: conexão recusada (PT/Windows,
   `10061`/`recusou`) e modelo de router não habilitado → `ENVIRONMENT_PENDING` (em vez de `ERROR`),
   mais preciso e honesto.

## 5. SEGURANÇA

Nenhuma chave é exposta: `provider_status` retorna apenas `CONFIGURADO/AUSENTE`; erros HTTP não
incluem corpo; `/api/config/keys` retorna apenas nome+bool. Verificado no código.
