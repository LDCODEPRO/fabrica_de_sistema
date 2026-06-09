# FORJA — AUDITORIA DO FRONTEND
**Data:** 2026-06-09 · `16_SISTEMAS/FORJA_OS_PLATFORM` · React 18 + Babel standalone, bundle via esbuild

## 1. COMO O PAINEL É SERVIDO

- `/painel` e `/` servem `dist/index.html`, que carrega **um único** `dist/assets/app.js` (bundle).
- O bundle é gerado por `scripts/build.mjs`, que concatena **apenas** estes fontes (`sourceOrder`):
  `data.js, shared.jsx, shell.jsx, explorer.jsx, copilot.jsx, home.jsx, home_exec.jsx, equipes.jsx, modules_a.jsx, modules_b.jsx, app.jsx`.
- **NÃO entram no bundle:** `api.js`, `centers_a.jsx`, `centers_b.jsx`, `centers_c.jsx`.

## 2. ZERO GHOST — VARREDURA

`tests/forensic_audit.py` (FASE 7) e auditoria dedicada: **`home.jsx` e `data.js` LIMPOS**.
Os componentes não-implementados estão **honestamente rotulados** (`NIMPL`, `NTEST`, `DEV`,
`PARCIAL`, `CONFIG`, `OFFLINE`, `BLOCK`) e estados vazios dizem explicitamente `"SEM DADOS REAIS"`
/ `"Nada inventado é exibido"`.

### Ghost eliminado no artefato servido
O bundle servido (build de 01:51) estava **defasado** em relação ao `data.js` (edição 02:03) e
ainda continha **latência fake `"120ms"`** e o `chatSeed` fantasma
(`"Provedores LLM operacionais... Pronto para execução real"`). Após `npm run build`:
- `grep "120ms" app.js` → **0**
- `grep "Pronto para execução real" app.js` → **0**
- `grep "chat/message" app.js` → **1** (chat preservado)

## 3. CHAT (componente visual)

`home.jsx::HomeWorkspace`:
- `POST /api/chat/message` com `{message, agent_key, agent_name, provider}`.
- Lê `data.message` e `data.provider_used`; mostra `via <provider>` na bolha.
- Erros: usa `data.detail`/HTTP status (não suprime).
- `GET /api/chat/status` a cada 60s; cor/texto do indicador refletem estado **real** (sem "online" fake).

## 4. BOTÕES

Auditados todos os `onClick`/`<button>`: os botões sem ação real estão **desabilitados com feedback
visual** (opacity + StatusPill explicando o motivo: NIMPL/CONFIG). Ex.: "Rodar testes" (disabled),
"Conectar" ferramenta (disabled), "Consultor" (disabled). O único `onAction={()=>{}}` é o botão de
estado vazio de Clientes (NIMPL). **Nenhum botão finge função.**

## 5. DADOS: BACKEND vs ESTÁTICO

- **Live (backend real):** somente o **chat** (`/api/chat/message`, `/api/chat/status`).
- **Estático (`window.FORJA` de `data.js`):** módulos, equipes, LLMs, ferramentas, integrações,
  conhecimento, operações, roadmap, auditoria. São **honestos** (status conservadores), porém **não
  refletem os dados ao vivo** do `nexus.db` (9 missões, 14 agentes, etc.).
- **`api.js` (`ForjaAPI.hydrate`)** existe para hidratar `window.FORJA` com dados reais, **mas:**
  1. não está no bundle; 2. `app.jsx` nunca chama `hydrate()`; 3. os **shapes** dos mappers
  (`mapLLMs`, etc.) **divergem** dos componentes bundlados (ex.: `LLMsCenter` lê `l.nome/l.modelo/
  l.conexao`; `mapLLMs` produz `provider/modelos/—`). Wirá-lo **como está quebraria o painel**
  (`sel.conexao.map` → crash). Por isso **não** foi ativado; ver REPAIR_REPORT (caminho seguro proposto).

## 6. ARQUIVOS ÓRFÃOS

`centers_a.jsx` (chama `/api/home/*` inexistentes), `centers_b.jsx`, `centers_c.jsx` e `api.js`
não são usados pelo painel servido. Contêm logs de exemplo com timestamps fixos (potenciais ghosts
**se** fossem bundlados). Recomenda-se **remover** ou refatorar (fora do escopo de reparo seguro sem
verificação visual).

## 7. STATUS

**OK (Zero Ghost) / PARCIAL (conectividade live)** — painel honesto e sem fantasmas; apenas o chat
é ao vivo. Hidratação dos demais blocos depende de refatoração de shapes (documentada, não forçada).
