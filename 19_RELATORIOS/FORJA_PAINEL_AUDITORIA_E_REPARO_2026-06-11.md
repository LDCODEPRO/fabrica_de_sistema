# FORJA OS — Auditoria e Reparo do Painel Forja

**Data:** 2026-06-11
**Escopo:** Auditar o Painel Forja, tornar as funções reais e em funcionamento, e criar arquivo para abrir o painel direto.

## Causa-raiz do "sem funcionamento"

1. **Painel aberto sem backend.** O launcher antigo (`Fabricação/ABRIR_FORJA_OS.cmd`) abria apenas o `index.html` via `file://`, sem subir o FastAPI (`forja_os_server.py`). Sem backend, nenhuma chamada `/api/*` respondia → telas vazias/falsas.
2. **Home Executiva com dados fixos.** A tela inicial mostrava `0 missões`, "Nenhum provedor LLM configurado", "crie a primeira missão" — **ignorando** o backend real (9 missões, 14 agentes, 18 evidências, 2 provedores online). Cards de LLM ficavam em branco quando o backend estava no ar (campos incompatíveis com o shape real).
3. **Tela de Missões roteada era um stub** (kanban vazio) que ignorava as missões reais do `nexus.db`.
4. **Botões sem handler** em vários módulos (Nova missão, Configurar no cofre, Health check, Exportar, Adicionar conhecimento, etc.).
5. **Dependência de CDN.** O `index.html` carregava React + ReactDOM + Babel do `unpkg.com` — exigia internet e Babel era desnecessário (o `app.js` já vem compilado).

> Observação: os componentes ricos em `js/centers_a|b|c.jsx` **não estão roteados** em `app.jsx` (código morto neste build). A UI viva é `home_exec + home + modules_a + modules_b + equipes`. Os endpoints `/api/home/*` (404) são consumidos só por componente não roteado — não afetam a UI atual.

## Correções aplicadas (reais, sem fantasma — Lei Zero Fantasma)

### Launcher (pedido explícito)
- **`ABRIR_PAINEL_FORJA.cmd`** + **`ABRIR_PAINEL_FORJA.ps1`** (raiz do repo): sobem o backend FastAPI (se já não estiver no ar), aguardam o `/api/health` e abrem o painel em `http://127.0.0.1:8000/painel`. Clique duplo no `.cmd`.

### Backend (`forja_os_server.py`)
- Novo endpoint **`GET /api/knowledge`**: contagem **real** de itens de conhecimento varrendo os diretórios do repositório (01_RULES, 02_WORKFLOWS, 03_SKILLS, 07_TEMPLATES, 14_DOCUMENTACAO, 09_MEMORY, 14_AGENT_MEMORY). Resultado: **224 itens reais**.

### Frontend (`16_SISTEMAS/FORJA_OS_PLATFORM/js/*`)
- **api.js**: hidrata e expõe dados reais (`dashboard`, `chatStatus`, `knowledge`); novos métodos `createMission`, `getKnowledge`, `getConfigKeys`, `setConfigKey`, `healthCheckServices`.
- **home_exec.jsx (Home Executiva)**: resumo, bloco de Missões, LLM Command Center e Alertas agora vêm do backend real.
- **modules_a.jsx (Missões)**: lista missões reais do banco em kanban por status; **Nova missão** (POST `/api/missions`), **Executar/Reexecutar** (POST `/api/missions/{id}/run`) e **Atualizar** reais.
- **modules_b.jsx (Configurações)**: **Cofre de chaves real** (`KeyVault`) lê/grava via `/api/config/keys` (nunca exibe o valor). **Operações**: "Health check" real (`/api/services`). **Auditoria**: "Exportar" gera CSV real.
- **modules_a.jsx (Conhecimento)**: contagens reais via `/api/knowledge` + botão "Atualizar".
- Botões de módulos sem backend (Clientes, Projetos, Inteligência, Equipes) agora dão aviso honesto; Ferramentas/Integrações levam ao cofre de configuração.
- **build.mjs**: dist de produção self-contained — React vendorizado localmente (`assets/vendor/`), Babel e `unpkg.com` removidos.

## Validação (executada)
- `GET /api/health` → ok; `GET /api/dashboard` → 9 missões / 14 agentes / 18 evidências.
- `GET /api/knowledge` → 224 itens reais.
- `POST /api/missions` → cria no banco (testado e removido após validação).
- `GET /api/config/keys`, `GET /api/services` → ok.
- `npm run build` (esbuild) → ok; dist servido em `/painel`; React local servido em `/assets/vendor/`.
- dist de produção sem `unpkg.com`/`babel`/`react.development.js`/`text/babel`.

## Como usar
1. Dê duplo clique em **`ABRIR_PAINEL_FORJA.cmd`** na raiz do repositório.
2. O backend sobe sozinho e o navegador abre o painel real.
3. Para reconstruir o frontend após editar `js/*`: `cd 16_SISTEMAS/FORJA_OS_PLATFORM && node scripts/build.mjs`.

## CAUSA RAIZ DEFINITIVA — "nada funcionava no painel"

O `js/api.js` (camada que busca os dados reais e expõe `window.ForjaAPI`) **não estava no `sourceOrder` do `build.mjs`** nem era carregado no HTML. Resultado: no navegador `window.ForjaAPI` era **undefined**, o `hydrate()` **nunca rodava**, e o painel ficava 100% no fallback estático (sem missões, sem providers reais, todos os botões caindo em "backend offline"). O backend estava OK o tempo todo; o **frontend nunca falava com ele**.

**Correção:**
- `build.mjs`: incluído `js/api.js` no bundle; adicionado **cache-busting** (`app.js?v=<tamanho>`) para o navegador não servir build antigo.
- `app.jsx`: `bootForja()` chama `window.ForjaAPI.hydrate()` **antes** de renderizar, então os componentes montam já com o estado real do `nexus.db`.

**Validação (render headless real, perfil limpo do Chrome):** `#root` populado, status "Operacional", KPIs reais e os 6 provedores (Claude, Gemini, DeepSeek, Ollama…) renderizados — sem erros, sem fallback.

## Diagnóstico dos LLMs (teste real ao vivo · execute_llm)

| Provedor | Tipo | Resultado real | Motivo |
|---|---|---|---|
| Claude | Assinatura (CLI `claude`) | ✅ funciona (~4-5s) | login da assinatura ativo |
| Gemini | Assinatura (automação navegador) | ✅ funciona (~24s, lento) | sessão Google One ativa |
| OpenRouter / DeepSeek-router | API (chave configurada) | ✅ funciona (~1.5s) | `OPENROUTER_API_KEY` presente |
| ChatGPT/Codex | Assinatura (automação navegador) | ❌ falha | automação não acha `#prompt-textarea` (Timeout 10s) → **sessão do ChatGPT no navegador deslogada/expirada** |
| Ollama | Local | ❌ falha | **não instalado** (porta 11434 recusa conexão) |
| OpenAI / Gemini-API / Claude-API / DeepSeek-API | API direta | ❌ ausente | sem chave no `.env` (só OpenRouter); APIs pagas bloqueadas por política |

**Por que o painel parecia "sem LLM":** (1) a tela de LLMs roteada (`LLMsCenter`) lia campos do formato estático (`sel.conexao.map`) inexistentes nos dados reais → **quebrava (tela branca)** quando o backend estava no ar; (2) sem backend, nada carregava; (3) status vinha de registry desatualizado.

**Correções nos LLMs:**
- `LLMsCenter` reescrita para o shape real (corrige o crash) + botão **"Testar provedor (execução real)"** e **"Testar todos"** via `POST /api/providers/health-check` (executa o LLM de verdade e persiste o status no banco).
- `provider_registry.json`: `claude_pro` → `active_real` (verificado); `chatgpt_plus` → `unavailable` (evita o roteador perder ~14s tentando a automação quebrada do ChatGPT).
- Conversação roteia `claude_sub → openrouter → gemini_sub` — todos funcionais, então **o chat do painel funciona** (testado: respondeu via Claude).

**Para ativar os que faltam (ação do operador):**
- ChatGPT/Codex: re-logar a sessão do ChatGPT no navegador usado pela automação (`...\\.gemini\\config\\plugins\\openai-integration`).
- Ollama: instalar e iniciar o Ollama (serviço em `127.0.0.1:11434`); depois definir `OLLAMA_MODEL` no cofre.
- APIs diretas: opcional — adicionar as chaves no cofre (Configurações → Cofre de chaves). Não é necessário, pois Claude+Gemini+OpenRouter já cobrem a operação.

## Agentes: especialistas + agênticos + auto-aprendizado (sem fine-tuning)

Não é possível treinar (fine-tune) modelos via assinatura/OpenRouter. Entregue o efeito equivalente usando os LLMs reais:
- **Perfis de elite por papel** (`AGENTIC_CORE/agent_profiles.py`): 12 personas (Arquiteto, Desenvolvedor, QA, DevOps, Eng. IA, Analista, Segurança, Eng. Dados, Docs, Orquestrador, Designer, Comunicação) + doutrina (autonomia Hermes, rigor de código, qualidade Claude, Verdade Real).
- **Memória persistente por agente** (`AGENTIC_CORE/agent_memory.py` + tabela `agent_memory`): grava aprendizados de cada execução e injeta no prompt seguinte (auto-aprendizado por recuperação). Verificado: ARCHITECT e QA acumulam aprendizados.
- **Loop ReAct corrigido** (`reasoning_engine.py`): mantém transcrito completo entre passos.
- **Ferramentas reais e seguras** (`tools_registry.py`): `ler_arquivo`, `listar_pasta`, `buscar_no_repo`, `consultar_banco` (somente SELECT), `status_sistema`, `escrever_arquivo` (somente sandbox `09_AGENT_WORKSPACE`), `rodar_comando` (allowlist não destrutiva). Travas validadas: `rm -rf /` e `DROP TABLE` bloqueados.
- **Endpoints**: `/api/agents/{id}/run` (resposta especialista 1-shot, grava aprendizado) e `/api/agents/{id}/act` (execução AGÊNTICA ReAct com ferramentas). Verificado: ARCHITECT usou `status_sistema` e relatou dados reais (9 missões/14 agentes) em 2 passos.

## Multi-cliente + integrações por cliente (plataforma de agência)

Base para gerenciar vários clientes ao mesmo tempo, cada um com suas próprias contas:
- **Banco**: modelos `Client` e `ClientConnection`; `client_id` em `projects` (migração idempotente). Hierarquia: Cliente → Projetos → Missões → Execução → Entregas.
- **`connectors.py`**: catálogo de integrações (telegram, github, instagram, facebook, canva, google_drive, openrouter) com **validação real via API oficial** (sem scraping). Ex.: token Instagram é validado no Meta Graph; token inválido retorna ERROR de verdade.
- **Endpoints**: `/api/connectors`, `/api/clients` (CRUD), `/api/clients/{id}/connections` (conectar/testar/remover). **Credenciais nunca são retornadas** — só status (cofre por cliente).
- **Tela de Clientes** reescrita (era NIMPL): lista clientes → abre cliente → conecta as contas dele (cada conector com instrução de como obter o token) → cria projetos do cliente.
- **Verificado**: cliente CLI-001 criado, Instagram com token falso → ERROR (validação real Meta), projeto PRJ-002 vinculado ao cliente, token não exposto.
- **Pendente do lado do usuário** (não é código): para Instagram, criar conta Business + Página + app Meta com `instagram_content_publish`; para Canva, app Connect API. Depois é só colar o token na tela do cliente.

## Fatia vertical COMPLETA: Projeto → Missão → execução agêntica → entrega

Primeiro fluxo real ponta a ponta da plataforma:
- **Banco**: novo modelo `Project` + coluna `project_id` em `missions` (migração idempotente).
- **Endpoints**: `GET/POST /api/projects`, `GET /api/projects/{id}`, `POST /api/projects/{id}/missions`, `GET /api/projects/{id}/deliverables`.
- **Tela de Projetos** reescrita (antes era kanban vazio): lista projetos reais → abre projeto → cria missão → **Executar** (roda o agente de verdade) → mostra **Entregas/Evidências** reais.
- **Verificado ponta a ponta**: criou PRJ-001 "Site institucional" → missão MIS-010 → execução pelo ORCHESTRATOR via `AGENTIC_CORE_REACT` → status COMPLETED → 1 evidência real gerada e listada como entrega.

## Modo Agêntico + Chat cordial
- Chat tem botão **Agir** (execução ReAct com ferramentas, mostra os passos) além de **Conversar**.
- `/api/agents/{id}/act` aceita ids de equipe (não só agentes do banco).

## Chat: real e funcional
- Corrigido `GOOGLE_API_KEY ausente`: o painel mandava `provider='gemini'` (API direta) — agora o backend mapeia o id do painel para a chave do roteador e cai no grupo automático se falhar; padrão do chat = **Automático**.
- **Memória de conversa** (session_id persistente) — verificado recall ("Hernando").
- Sem seed fake; botão **Nova conversa**; aba **Arquivos** lista arquivos reais (`/api/files`); aba **Terminal** com status ao vivo; rodapé com contagens reais.
- Cada agente no chat usa o **perfil de elite + memória**.

## Pendências honestas (não fabricadas)
- Módulos Clientes, Projetos, Inteligência, Financeiro, Academia, Testes/Validação seguem como estrutura (sem tabela/serviço real) — botões dão aviso honesto em vez de simular.
- `tests/static-audit.mjs` ainda acusa `unpkg.com` porque escaneia também o HTML-fonte de **dev** (`Factory OS - Monitor 1.html`), que usa CDN+Babel para JSX inline em desenvolvimento. O **dist de produção** está limpo.
