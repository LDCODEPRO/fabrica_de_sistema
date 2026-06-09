# FORJA — AUDITORIA DO CHAT
**Data:** 2026-06-09 · **Zero Ghost**

## 1. DIAGNÓSTICO (causa raiz)

O chat (`POST /api/chat/message`) roteava através do **`llm_router.py`** (baseado no
`provider_registry.json`), com `task_type="coding"`. A cadeia "coding" começa em
`deepseek_v4_pro`, que é uma **assinatura `assisted`**. O método `LLMRouter.route()`
**retornava falha imediatamente** ao encontrar uma assinatura assistida:

```
return LLMRouterResult(success=False, reason="ASSISTED_SUBSCRIPTION_REQUIRES_HUMAN_INTERFACE")
```

Além disso, o `llm_router` **não possui adapter** para os providers de assinatura
(`deepseek_v4_pro`, `claude_pro`, `chatgpt_plus`, `gemini_advanced`) — só para APIs
(`openai_api`, `claude_api`, `gemini_api`, `ollama_local`, `openrouter_api`). Ou seja,
mesmo sem o `return`, ele nunca conseguiria executar uma assinatura.

**Evidência (antes):**
```
POST /api/chat/message {"message":"Olá","agent_key":"chat"}
→ HTTP 503 {"detail":"Agent indisponível: ASSISTED_SUBSCRIPTION_REQUIRES_HUMAN_INTERFACE"}
```

Os providers que **de fato funcionam** (`claude_sub`, `gemini_sub`, `openrouter`) vivem no
**outro** roteador: `provider_router.py`. Havia **dois roteadores desconectados**.

## 2. CORREÇÃO

`forja_os_server.py::chat_message` reescrito para usar **`provider_router`** com a ordem
oficial de conversação (assinaturas reais + gateway autorizado + local):

```python
result = provider_router.execute_for_group("conversation", full_prompt, system=system_prompt, max_tokens=1024)
# conversation = ["claude_sub", "openrouter", "gemini_sub", "codex_sub", "ollama"]
```

Correções de suporte em `provider_router.py`:
- **stdin para o Claude CLI**: system-prompt longo/multilinha quebrava o parser
  (`Input must be provided ... when using --print`). Agora `system+prompt` vão por **stdin**.
- **Detector de erro de CLI** (`_looks_like_cli_error`): saída de automação de navegador
  (ex.: `"ERRO ao localizar o campo de texto"`, `Locator.`, `Timeout ... exceeded`) **não**
  é mais devolvida como resposta — levanta exceção e segue para o fallback (Zero Ghost).
- **Ordem**: `openrouter` (active_real) posto antes das automações de navegador (gemini/codex),
  que são intermitentes.
- **timeout=90s** no Claude CLI (antes: sem timeout → risco de travar a requisição).

## 3. VALIDAÇÃO (testes reais)

| Teste | Resultado |
|---|---|
| `POST /api/chat/message {"message":"Oi"}` | **200** · provider `claude_sub` · `"No aguardo da instrução."` |
| `2+2?` | **200** · `"4"` |
| Memória multi-turno ("Meu nome é Hernando" → "Qual é meu nome?") | **200** · `"Hernando"` (memória OK) |
| Persistência | `GET /api/chat/session/{id}` → **4 mensagens** persistidas, status OPEN |
| Anti-ghost | 3/3 respostas sem vazamento de texto de erro |
| `provider_router.execute_for_group("conversation")` | OK · `claude_sub` · `"PONG"` (4.8s) |

Banco (`chat_messages`) após os testes:
```
ID=107 sender=chat provider=claude_sub  conteudo='Hernando'
ID=105 sender=chat provider=claude_sub  conteudo='OK'
```

## 4. COMPONENTE VISUAL (frontend)

`js/home.jsx` (`HomeWorkspace`): faz `POST /api/chat/message`, lê `data.message`/`data.provider_used`,
exibe `via <provider>` na bolha, trata erro com `data.detail` e checa `/api/chat/status` a cada 60s
(sem "online" fake). Conforme Zero Ghost. (Confirmado em auditoria do frontend.)

## 5. STATUS

**OK — CHAT FUNCIONAL com LLM real, memória e persistência.** Fallback honesto quando o provider
primário falha; nunca apresenta erro como resposta.
