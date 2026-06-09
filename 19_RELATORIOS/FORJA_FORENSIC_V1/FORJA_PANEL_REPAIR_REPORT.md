# FORJA — RELATÓRIO DE REPARO DO PAINEL
**Data:** 2026-06-09 · Executor: Claude Code

## 1. CORREÇÕES APLICADAS (com evidência)

| # | Arquivo | Mudança | Evidência de validação |
|---|---|---|---|
| R1 | `forja_os_server.py` | `chat_message` reroteado de `llm_router` (registry) → `provider_router` (assinaturas reais), ordem `conversation`, persistência de erro honesta + `fallback_trail` | `POST /api/chat/message` → **200** real; antes **503** |
| R2 | `provider_router.py` | Claude CLI: prompt via **stdin** + `--print` (system longo quebrava o parser) | `claude_sub` com system longo → **ok=True** `"No aguardo da instrução."` |
| R3 | `provider_router.py` | `_looks_like_cli_error()` + checagem em `_gemini_cli`/`_codex_cli`: erro de automação não vira "resposta" | chat 3/3 sem vazamento de erro |
| R4 | `provider_router.py` | `conversation` reordenado: `claude_sub → openrouter → gemini_sub → codex_sub → ollama`; `timeout=90s` no Claude | fallback confiável; chat estável |
| R5 | `provider_governance.py` | `status_from_result`: conexão recusada PT/Windows (`10061`,`recusou`) e modelo router ausente → `ENVIRONMENT_PENDING` | ollama/kimi reclassificados honestamente |
| R6 | `tests/forensic_audit.py` | stdout/stderr utf-8 (não quebra no console cp1252) | script roda até o fim (EXIT=0) |
| R7 | **Health-checks reais** (DB) | re-sincronização de `llm_providers` com a realidade | `openai_subscription`: `CERTIFIED → ENVIRONMENT_PENDING` (ghost removido) |
| R8 | **Rebuild do bundle** (`npm run build`) | `dist/assets/app.js` regenerado do fonte honesto | ghost `"120ms"` removido; chat preservado |

## 2. BOTÕES / CARDS / TABELAS

Auditoria confirmou: **nenhum botão sem função ativa** no painel servido — itens não
implementados estão **desabilitados com motivo visível**. Cards/tabelas estáticos usam `window.FORJA`
honesto. Endpoint `/api/panel/features` já documenta o que é OK / SEM FUNÇÃO / SEM BACKEND.

## 3. PENDÊNCIA ARQUITETURAL (NÃO mascarada)

**Hidratação live do painel não-chat.** A camada `js/api.js` existe mas:
1. não está no `sourceOrder` do build; 2. `app.jsx` não chama `hydrate()`;
3. os mappers produzem **shapes diferentes** dos componentes bundlados.

Ativá-la "como está" **quebraria o painel** (ex.: `LLMsCenter` faz `sel.conexao.map` e `mapLLMs`
não produz `conexao`). Para não violar a missão (introduzir telas quebradas/ghosts) **isto foi
documentado, não forçado**.

### Caminho seguro recomendado (próxima iteração, requer verificação visual)
1. Alinhar `mapLLMs/mapMissoes/mapAgentes/mapAuditoria` ao **shape do `data.js`**
   (`nome, modelo, ultimoTeste, latencia, custo, conexao, uso`, etc.).
2. Adicionar `js/api.js` ao `sourceOrder` (após `data.js`).
3. Em `app.jsx`, trocar o render síncrono por **hydrate-then-render com guarda**:
   ```js
   const boot = () => ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
   (window.ForjaAPI?.hydrate?.() ?? Promise.resolve()).catch(()=>{}).finally(boot);
   ```
   (garante render mesmo se a hidratação falhar — sem tela branca).
4. `npm run build` + **validação visual no navegador** (não disponível neste ambiente headless).
5. Remover `centers_*.jsx` órfãos e endpoints `/api/home/*` mortos.

## 4. STATUS DO REPARO

**Concluído e validado:** chat, providers, status honesto, bundle limpo, testes.
**Documentado p/ próxima iteração (com verificação visual):** hidratação live dos blocos não-chat.
