# CORE_IMPORT_ROADMAP — Roteiro de Integração dos 11 Ativos Críticos

> **ZERO GHOST LAW ATIVA.** Documento de PLANEJAMENTO. Nenhum código foi copiado, importado ou modificado de `E:\`. Os 11 dossiês-fonte (`DOSSIE_01..11`) foram lidos em modo somente-leitura para fundamentar este roteiro. Detalhes não confirmáveis estão marcados **(a confirmar)**.
> **Data:** 2026-06-04
> **Local de gravação:** `D:\FABRICA_DE_SISTEMAS\17_RUNTIME\CORE_ASSETS\`
> **Base factual:** dossiês técnicos 01 a 11 em `D:\FABRICA_DE_SISTEMAS\17_RUNTIME\CORE_ASSETS\`.

---

## 0. Estado dos Ativos (Resumo Consolidado dos 11 Dossiês)

Todos os 11 ativos foram classificados como **ADAPTAR** nos dossiês. Nenhum é importação direta — todos exigem sanitização, parametrização de paths e/ou reconstrução limpa.

| ID | Ativo | Tipo | Classificação | Risco | Bloqueador principal confirmado |
|----|-------|------|---------------|-------|---------------------------------|
| 06 | API Vault SQLite | Engine Python | ADAPTAR | BAIXO | Chaves em texto plano (sem cripto em repouso); paths hardcoded; variante NIVEL 1 destrói `.env` |
| 04 | SAFE_GATE | Engine Python | ADAPTAR | BAIXO | Paths hardcoded (`D:\NEXUSPREMIUM`, `E:\...`); acoplamento a `realtime.event_bus`; blacklist shell incompleta |
| 01 | Zero Ghost Law | Doutrina + guard | ADAPTAR | BAIXO | Nomes próprios (AGENTE-X/COMPLEXO_ZEUS/Diretor); origem PHANDORA da doutrina **(a confirmar)** |
| 02 | RULES_000–013 | Template/Regra | ADAPTAR | BAIXO | Wikilinks Obsidian `[[...]]`; 12 das 14 severities **(a confirmar)**; regras 006/007 (Drive/GitHub) a decidir |
| 03 | Governance Engine | Engine Python | ADAPTAR | BAIXO | 3 paths absolutos `E:\SISTEMA_ONE`; imports planos; `except: pass` silencioso |
| 05 | HallucinationGuard | Engine Python | ADAPTAR | BAIXO | Import flat; thresholds hardcoded; cobertura morfológica (não semântica) |
| 09 | Router LLM Unificado | Engine Python (fusão) | ADAPTAR | BAIXO | 2 `.env` hardcoded; `sys.path.insert`; fusão de 2 `task_classifier`; endpoints Ollama divergentes |
| 07 | ReAct Engine | Engine Python | ADAPTAR | BAIXO | Acoplamento à topologia Agente-X; `sys.path.insert`; fail-closed depende de 05 |
| 08 | Pipeline 5 Fases | Workflow/JSON | ADAPTAR | BAIXO | Handlers das 25 sub-skills (risco "skill fantasma"); paths `D:\NEXUSPREMIUM` no orquestrador |
| 10 | Template Agente 12 arquivos | Template | ADAPTAR | BAIXO | Path `D:\NEXUSPREMIUM\data\nexus.db` em `06_tools.json`; cobertura incompleta (nem todos os 23 agentes têm 12/12) |
| 11 | Memória 3 Camadas | Padrão/Arquitetura | ADAPTAR | **MÉDIO** | Bancos contêm **dados pessoais reais** — importar SCHEMA, nunca os dados |

---

## 1. Princípios de Integração

Estes princípios são vinculantes para todas as fases. Derivam diretamente da Zero Ghost Law (Dossiê 01) e dos achados dos 11 dossiês.

### 1.1 Zero Ghost — Reconstruir, não copiar
- **Nenhum byte de `E:\` é copiado.** Cada ativo é **reescrito/reconstruído** na Fábrica a partir do padrão arquitetural confirmado no dossiê (regra explícita nos planos de extração dos Dossiês 04, 08, 10, 11).
- Fluxo obrigatório por ativo: **CRIAR > TESTAR > VALIDAR > REGISTRAR > SALVAR > REPORTAR** (Dossiê 01, seção 2).
- Proibido declarar um ativo "integrado" sem evidência de teste real. Resposta padrão na ausência de prova: *"NÃO VALIDADO AINDA. PRECISO VERIFICAR ANTES DE CONFIRMAR."*
- Cada fase encerra com declaração: `CONFORMIDADE ZERO GHOST: [APROVADA / PENDENTE / VIOLAÇÃO DETECTADA]`.
- `E:\` permanece **read-only**. Único local de gravação: `D:\FABRICA_DE_SISTEMAS\`.

### 1.2 Sanitização de credenciais e dados pessoais
- **Credenciais:** os dossiês confirmaram que nenhum ativo tem segredos hardcoded no código-fonte. Porém **chaves reais existem no ambiente de origem** (env/`.env`/`nexus_vault.db`). NUNCA trazer `.env`, `nexus_vault.db`, nem bancos `.db` reais para a Fábrica.
- **PII a remover/parametrizar:** nome "Luiz Cipolari"/"Diretor" em `SOUL.md` e `director_profile.py` (Dossiês 01, 07); `director_input` persistido pelo Governance Engine (Dossiê 03); dados reais em `agente_x.db`/`learning_memory.db`/`chroma.sqlite3` (Dossiê 11 — **risco MÉDIO**).
- **Nomes de marca** a neutralizar: AGENTE-X, COMPLEXO_ZEUS, NEXUSPREMIUM, PHANDORA, SISTEMA_ONE → tokens genéricos da Fábrica.
- Toda config sensível (cost map, blacklists, thresholds, providers) vai para `00_GOVERNANCA` como arquivo versionado — nunca hardcoded.

### 1.3 Testar-antes-de-relatar
- Cada ativo só é promovido a `17_RUNTIME` após suíte de testes **reconstruída** (não importada) passar com saída real registrada.
- O `HallucinationGuard` (05) é o enforcement executável deste princípio; deve operar **FAIL CLOSED** no consumidor (bloquear entrega quando `RESTRICTED_MODE`/`SAFE_MODE_ACTIVATED`) — comportamento confirmado no `react_engine` (Dossiê 05, seção 2), a re-implementar explicitamente na Fábrica (Dossiê 01, ajuste 2).
- Evidências de runtime registradas em `11_AUDITORIA`/`13_CERTIFICACOES` antes de marcar produção.

### 1.4 Parametrização universal
Achado transversal dos 11 dossiês: o bloqueador #1 é **paths absolutos hardcoded** e **imports por `sys.path`/flat**. Regra: toda raiz, path de DB, log, endpoint e threshold deve vir de config injetada (`00_GOVERNANCA`/`12_CONFIG`/ENV), e todo módulo Python deve ser reempacotado como package com imports relativos.

---

## 2. Diagrama de Ordem de Integração (com justificativa por dependência)

```
                          ┌─────────────────────────────────────────────┐
                          │  PRÉ-CONDIÇÃO CRÍTICA (bloqueia tudo):       │
                          │  ROTAÇÃO DAS CHAVES EXPOSTAS EM E:\          │
                          └───────────────────┬─────────────────────────┘
                                              │
   FASE 1 — Fundação de Segurança            ▼
   ┌──────────────────┐        ┌──────────────────────────┐
   │ [06] API Vault   │ ─────► │ [04] SAFE_GATE           │
   │ (cofre SQLite)   │        │ (paths + shell + E: RO)  │
   └──────────────────┘        └────────────┬─────────────┘
        cofre primeiro: SAFE_GATE protege   │ enforcement técnico
        paths do cofre; ambos são base de   │ exigido pelas regras
        toda credencial/escrita posterior   ▼
   FASE 2 — Constituição (Governança)
   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────────┐
   │ [01] Zero Ghost  │──►│ [02] RULES        │──►│ [03] Governance      │
   │ Law (doutrina)   │   │ 000–013 (políticas)│  │ Engine (gate 4 níveis)│
   └──────────────────┘   └──────────────────┘   └──────────┬───────────┘
     lei-mãe define o "porquê"; RULES a formalizam;          │ usa SAFE_GATE
     Governance Engine as executa como gate de risco         ▼
   FASE 3 — Guardas
   ┌──────────────────────────────────────────┐
   │ [05] HallucinationGuard (FAIL CLOSED)     │  implementação executável
   │ materializa a Zero Ghost Law              │  da doutrina da Fase 2
   └────────────────────┬─────────────────────┘
                        ▼
   FASE 4 — Roteamento
   ┌──────────────────────────────────────────┐
   │ [09] Router LLM Unificado                 │  porta única de inferência;
   │ (ONE Router + Multi-LLM cost-aware)       │  consome chaves do Vault (06)
   └────────────────────┬─────────────────────┘
                        ▼
   FASE 5 — Cognição
   ┌──────────────────┐        ┌──────────────────────────┐
   │ [07] ReAct Engine│ ─────► │ [08] Pipeline 5 Fases    │
   │ (loop cognitivo) │        │ (PLAN>DECIDE>EXEC>VAL>REP)│
   └──────────────────┘        └────────────┬─────────────┘
     ReAct depende de 09 (LLM), 05 (guard,  │ VALIDAR usa detectar_fantasma
     fail-closed), 04 (gate). Pipeline      │ → Zero Ghost gate
     orquestra a sequência cognitiva        ▼
   FASE 6 — Estrutura e Memória
   ┌──────────────────────────┐   ┌──────────────────────────────────┐
   │ [10] Template Agente     │──►│ [11] Memória 3 Camadas           │
   │ (12 arquivos de contexto)│   │ (SQLite + ChromaDB + Obsidian)   │
   └──────────────────────────┘   └──────────────────────────────────┘
     template define o agente;        memória dá continuidade/RAG.
     07_memory_policy.md (do template) governa o uso da camada 11
```

### Justificativa de dependências (confirmada nos dossiês)
1. **06 antes de 04:** o Vault é o repositório de credenciais; o SAFE_GATE (NEXUSPREMIUM) já protege a raiz do vault como `forbidden_root` (Dossiê 04, seção 4) — logo o cofre precisa existir e ter caminho conhecido para o gate protegê-lo.
2. **04 antes da governança:** SAFE_GATE é "o enforcement técnico da própria ZERO GHOST LAW" (Dossiê 04, seção 2) — a camada de regra precisa do enforcement de baixo nível disponível.
3. **01 → 02 → 03:** a doutrina (01) é a regra-mãe; as RULES (02) a formalizam em 13 políticas verificáveis; o Governance Engine (03) é o gate executável que classifica risco e exige validação. RULE_008_ANTI_HALLUCINATION e RULE_002_NO_PHANTOM mapeiam diretamente à doutrina (Dossiê 02, seção 5).
4. **05 depende de 01/02:** o HallucinationGuard é "a implementação executável da Zero Ghost Law" (Dossiê 05, seção 5) — só faz sentido após a doutrina estar formalizada.
5. **09 depende de 06:** o Router lê `DEEPSEEK_API_KEY`, `CLAUDE_API_KEY`/`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `OLLAMA_HOST` (Dossiê 09, seção 3) — credenciais que devem vir do Vault, não de `.env`.
6. **07 depende de 09 + 05 + 04:** o ReAct Engine importa `LLMRouter` (risco conhecido: "depende do LLM router", Dossiê 07) e levanta `RuntimeError` na importação se `HallucinationGuard` não carregar (fail-closed, Dossiê 07 seção 4). Logo 09 e 05 são pré-requisitos rígidos.
7. **08 depois de 07:** o Pipeline 5 Fases é o contrato declarativo; sua fase EXECUTAR aciona executor/agente e VALIDAR usa `detectar_fantasma` (Zero Ghost gate). Precisa do motor cognitivo (07) e do guard (05) prontos.
8. **10 → 11:** o template define `07_memory_policy.md` (Dossiê 10) que governa como o agente usa a memória (11). O template vem primeiro para definir o contrato; a memória implementa a política.

---

## 3. Fases de Integração

Cada fase declara **pré-condições**, **entregáveis** e **critérios de validação**. Nenhuma fase inicia sem as pré-condições satisfeitas.

### FASE 0 — Pré-condição CRÍTICA (ver Seção 5)
**Pré-condição:** rotação de TODAS as chaves expostas em `E:\` concluída e confirmada.
**Entregável:** registro de rotação assinado; lista de chaves antigas invalidadas.
**Validação:** chaves antigas comprovadamente revogadas no painel de cada provider. **Bloqueia o início da Fase 1.**

---

### FASE 1 — Fundação de Segurança  ·  Ativos [06] → [04]
**Pré-condições:**
- Fase 0 concluída (chaves rotacionadas).
- Diretório-destino definido: `17_RUNTIME/SECURITY/` (Vault) e `00_GOVERNANCA/` (policy do SAFE_GATE).

**Entregáveis:**
- [06] Engine de Vault reconstruída a partir da **variante NIVEL 2** (path relativo, sem auto-delete de `.env` — Dossiê 06, seção 7); `DB_PATH` parametrizado para a raiz da Fábrica; **sem** trazer `nexus_vault.db`; política de criptografia em repouso decidida e documentada em `00_GOVERNANCA`.
- [04] Engine SAFE_GATE reconstruída consolidando a base **Agente X** (stdlib pura) + classificação de risco LOW/MEDIUM/HIGH/PROIBIDO da NEXUSPREMIUM; `allowed_roots`/`forbidden_roots`/blacklists em arquivo de policy em `00_GOVERNANCA`; regra E:\ read-only preservada; desacoplado de `realtime.event_bus` (logger/callback injetado); blacklist shell endurecida (`diskpart`, `format`, `Remove-Item -Recurse`, `Invoke-Expression`, fork bombs).

**Critérios de validação:**
- [06] Testes: `registrar_chave` (insert+upsert), `obter_chave` (ATIVA / inativa / inexistente→`ValueError`), migração contra `.db` temporário, teste multi-thread. Confirmar/expandir lista de providers (auditoria cita "6"; código só cabeia openai/tavily — **a confirmar**, Dossiê 06).
- [04] Testes: path traversal, bloqueio de escrita em E:\, shell injection, cenários ofensivos/chaos reconstruídos. Confirmar `diskpart` ausente da regex original (**a confirmar** em variantes, Dossiê 04).
- `CONFORMIDADE ZERO GHOST` da fase = APROVADA somente com saída real dos testes registrada.

---

### FASE 2 — Constituição / Governança  ·  Ativos [01] → [02] → [03]
**Pré-condições:**
- Fase 1 concluída (SAFE_GATE disponível como dependência do gate de governança).

**Entregáveis:**
- [01] Doutrina reescrita em versão neutra (sem AGENTE-X/COMPLEXO_ZEUS/Diretor) em `00_GOVERNANCA` e/ou `01_RULES` como regra constitucional de prioridade máxima.
- [02] 13 regras + índice recriadas em `00_GOVERNANCA`, mantendo o template de 10 seções; wikilinks `[[...]]` remapeados para IDs reais de `00_GOVERNANCA`/`03_SKILLS`; decisão explícita por regra sobre RULE_006 (Drive)/RULE_007 (GitHub); `.env` da raiz do vault PHANDORA **excluído** explicitamente.
- [03] Governance Engine reconstruído como **package** com `__init__.py` e imports relativos (5 módulos: policy/risk/validation/registry); 3 paths absolutos externalizados (config→`00_GOVERNANCA`, DB+log→`17_RUNTIME`); `except: pass` de `GovernanceRegistry.save` substituído por log de erro; `governance_rules.json` movido para `00_GOVERNANCA` com revisão de keywords por substring; rótulo validador `PHANDORA` parametrizado.

**Critérios de validação:**
- [02] Cada regra com 10 seções presentes; nenhum link órfão; severities na escala oficial (12 de 14 hoje **a confirmar**, Dossiê 02); regras de auditoria não conflitam com a Zero Ghost local.
- [03] Testes: bloqueio por `blocked_keyword` (`delete database`, `drop database`, `wipe`, `format`, `destroy`), os 4 níveis CRITICAL/HIGH/MEDIUM/LOW, gate de validação HIGH/CRITICAL→validador, persistência+leitura do histórico, default LOW sem match. Definir política LGPD de retenção de `director_input` antes de persistir.
- Confirmar contagem real de `governance_history` (citadas "86 entradas" — **a confirmar**, Dossiê 03).

---

### FASE 3 — Guardas  ·  Ativo [05]
**Pré-condições:**
- Fase 2 concluída (doutrina e RULES formalizadas — o guard é sua materialização).

**Entregáveis:**
- [05] HallucinationGuard reconstruído como módulo de package (sem import flat); thresholds (0.1/0.4/0.8), lista de negações e limites de chars externalizados via config; des-acentuação/normalização linguística adicionada; baseline única eleita (comparar `01_CORE/validation` vs `03_BASELINES/FASE4` vs 5 backups — **a confirmar diffs**, Dossiê 05).
- **FAIL CLOSED real** especificado no ponto de consumo (bloqueio + human review quando `SAFE_MODE_ACTIVATED`), conforme padrão confirmado no `react_engine` (Dossiê 05, seção 2; ajuste do Dossiê 01).

**Critérios de validação:**
- Testes cobrindo os 4 níveis (SAFE/WARNING/RESTRICTED_MODE/SAFE_MODE_ACTIVATED), contradição (negações), NO_CONTEXT (risco 1.0) e fronteiras dos thresholds. Validar Python 3.10 e 3.11 (versões confirmadas no bytecode de origem).
- **Ressalva dominante:** cobertura é morfológica/substring, não semântica (Dossiê 05, seção 4). Avaliar falsos positivos/negativos antes de elevar criticidade; upgrade para embeddings fica em backlog.

---

### FASE 4 — Roteamento  ·  Ativo [09]
**Pré-condições:**
- Fase 1 concluída (Vault provê as chaves — não usar `.env`).
- Fase 3 concluída (guard disponível para validar saídas de LLM no consumidor).

**Entregáveis:**
- [09] Router fundido: **Origem A (ONE Router)** como esqueleto (pipeline de governança 6 camadas, 14 tipos de task) + **Origem B** contribui FinanceEngine (circuit breaker), AntiLoopGuard/TraceContext e cascata cost-aware (Ollama > DeepSeek > Claude > OpenAI > Gemini).
- Dois `.env` hardcoded eliminados (`D:\BIBLIOTECA_COMPLEXO_ZEUS\91_CONFIGS\.env` e `_ROOT/.env`); `sys.path.insert` substituído por package; endpoint Ollama unificado (`/api/generate` vs `/api/chat`); `task_classifier` duplicado reconciliado; políticas (cost map, fallback chain, timeouts, privacy) movidas para `00_GOVERNANCA`.
- Entrypoint único `route_llm_request(payload)`; credenciais resolvidas via Vault; nomes de env unificados (`CLAUDE_API_KEY` vs `ANTHROPIC_API_KEY`).

**Critérios de validação:**
- Testes com providers **mockados** (zero chamadas reais/pagas): classificação dos 14 tipos, fallback offline→Ollama, bloqueio do FinanceEngine, bloqueio do AntiLoopGuard, `force_local` por privacidade, exaustão de cascata→`RuntimeError` real (sem resposta simulada).
- Privacidade: decidir mascaramento/retenção de prompts em `llm_routing_history.json`; escrita concorrente-segura (lock).
- Validação Zero Ghost: nenhum caminho retorna resposta fake.

---

### FASE 5 — Cognição  ·  Ativos [07] → [08]
**Pré-condições:**
- Fase 4 concluída (07 importa `LLMRouter` — risco conhecido).
- Fase 3 concluída (07 levanta `RuntimeError` na importação se o guard não carregar — fail-closed rígido, Dossiê 07).
- Fase 1 concluída (SAFE_GATE para steps de escrita/shell).

**Entregáveis:**
- [07] ReAct Engine reconstruído com `_ROOT`/`sys.path.insert` parametrizados; imports diretos (`LLMRouter`, `ToolRegistry`, `ContextManager`, `SkillManager`, `HallucinationGuard`) convertidos em imports de package/injeção; topologia remapeada (`04_SKILLS`→`03_SKILLS`, memória, logs, config); PII de `director_profile.py`/`SOUL.md` removida/parametrizada; limites `MAX_STEPS=20`/`MAX_RETRIES=2` preservados; orçamento de custo de LLM por execução avaliado (hoje sem limite aparente).
- [08] `skills_registry.json` recriado como asset declarativo nativo em `02_WORKFLOWS`; paths `D:\NEXUSPREMIUM` do orquestrador eliminados; interfaces da Fábrica para `executar_tool` e ponte LLM (`processar_livre`/`local_llama`) abstraídas para o Router (09).

**Critérios de validação:**
- [07] Testes do ciclo ReAct com LLM/tools mockados; validar fail-closed do guard; validar `MAX_STEPS`/`MAX_RETRIES`; smoke test end-to-end isolado. Confirmar antes existência real de `context_manager.py`, `skill_manager.py`, `director_profile.py` (alguns **a confirmar**, Dossiê 07).
- [08] **Inventário anti-fantasma:** cada uma das 25 sub-skills das 5 fases deve ter handler real em `03_SKILLS`; qualquer sub-skill sem handler é marcada PENDENTE (não fantasma). Teste de `detectar_fantasma` (fase VALIDAR) como gate Zero Ghost; teste sequência COMPLEXA (5 fases) e SIMPLES (DECIDIR>EXECUTAR>VALIDAR).

---

### FASE 6 — Estrutura e Memória  ·  Ativos [10] → [11]
**Pré-condições:**
- Fase 5 concluída (agente cognitivo operacional para consumir template e memória).
- Política LGPD "schema sim, dados não" registrada em `00_GOVERNANCA` (Dossiê 11).

**Entregáveis:**
- [10] Template de 12 arquivos recriado em `07_TEMPLATES`/`05_AGENTS` (escrita reconstruída, sem copiar bytes); path `D:\NEXUSPREMIUM\data\nexus.db` em `06_tools.json` parametrizado (`{{DATA_DIR}}`); nomes próprios → tokens (`{{AGENT_NAME}}`); `09_output_schema.json` validado e versionado como contrato oficial; cobertura completada para agentes que hoje têm só `persona.txt`/`run.py`.
- [11] Apenas os módulos `.py` reconstruídos (context_manager, memory_manager, db_init, db_migration_fase4, chroma_manager) + schema. **NUNCA** copiar `agente_x.db`, `-wal/-shm`, `learning_memory.db`, `vector/chroma.sqlite3`, nem o backup `agente_x_pre_cleanup_*` (≈320 MB). Bancos recriados VAZIOS via `init_database()`; `Path(...).parent.parent.parent` e `logging.basicConfig` no import substituídos por config injetada; versões de `chromadb` + `sentence-transformers` (`all-MiniLM-L6-v2`) pinadas.

**Critérios de validação:**
- [10] Varredura por segredos/PII em `10_examples.md` antes de migrar; output validado contra `09_output_schema.json`; homologação end-to-end de 1 agente de teste com o template adaptado.
- [11] Testes: `init_database` cria schema v1.0 do zero; CRUD em `missions`/`knowledge`/`fila_execucao`; ChromaManager upsert+search em coleção VAZIA recém-criada; ContextManager persiste/recarrega `MEMORY.md` (limite `MAX_CONTEXT_CHARS=2500`); **verificação explícita de ausência de qualquer dado herdado**.
- Confirmar pendências: schema de `learning_memory.db` (não lido), versão Python alvo, conteúdo de `E:\Sistema_open_claude\.env`, qual orquestrador consome os managers (**a confirmar**, Dossiê 11).

---

## 4. Matriz de Risco por Ativo e Mitigação

| ID | Risco residual | Severidade | Mitigação confirmada |
|----|----------------|------------|----------------------|
| 06 | Chaves em texto plano no SQLite | BAIXO (técnico) → relevante | Política de cripto em repouso + permissões do `.db` em `00_GOVERNANCA`; nunca importar `nexus_vault.db` real |
| 06 | Variante NIVEL 1 deleta `.env` (`os.remove`) | BAIXO | Adotar variante NIVEL 2; garantir que migração NUNCA delete `.env` |
| 04 | Blacklist shell incompleta | BAIXO | Endurecer regex; normalizar comando antes do match; reconstruir suíte ofensiva |
| 04 | Acoplamento a `realtime.event_bus` | BAIXO | Logger/callback injetado (DI); base canônica = variante Agente X stand-alone |
| 01 | Doutrina só reporta, não bloqueia | BAIXO | FAIL CLOSED implementado no consumidor (ver 05); origem PHANDORA da doutrina **(a confirmar)** |
| 01 | PII "Diretor Luiz Cipolari" em `SOUL.md` | BAIXO | Neutralizar nomes próprios na reescrita |
| 02 | Wikilinks Obsidian quebram fora do vault | BAIXO | Remapear `[[...]]` → IDs de `00_GOVERNANCA`/`03_SKILLS`; recriar `RULE_INDEX` |
| 02 | Regras 006/007 (Drive/GitHub) divergentes da stack | BAIXO | Decisão explícita importar/adaptar/descartar por regra |
| 03 | Paths absolutos `E:\SISTEMA_ONE` | BAIXO (portabilidade) | Externalizar config/DB/log via ENV+config |
| 03 | `except: pass` engole falha de persistência | BAIXO | Substituir por log de erro + métrica de falha |
| 03 | `director_input` persistido (LGPD) | BAIXO→MÉDIO | Política de retenção/anonimização antes de persistir |
| 05 | Cobertura morfológica (não semântica) | BAIXO (dominante) | Des-acentuação + revisão de match; backlog: embeddings; não elevar criticidade sem validar |
| 05 | Import flat / `sys.path` | BAIXO | Reempacotar como package |
| 09 | 2 `.env` hardcoded + `sys.path.insert` | MÉDIO | Config central + package; credenciais via Vault (06) |
| 09 | Conflito de fusão (2 classifiers, 2 endpoints Ollama) | MÉDIO | Origem A como esqueleto; reconciliar classifier e endpoint na extração |
| 09 | `history` JSON pode conter prompts sensíveis | MÉDIO | Mascaramento/retenção + escrita com lock |
| 07 | Acoplamento à topologia Agente-X | BAIXO→MÉDIO (portabilidade) | Parametrizar `_ROOT`/`sys.path`; DI dos 5 imports |
| 07 | Custo de LLM por execução sem orçamento | BAIXO | Avaliar limite de orçamento; FinanceEngine do Router (09) cobre parte |
| 07 | PII em `director_profile.py`/`SOUL.md` | BAIXO | Sanitizar antes de extrair |
| 08 | "Skill fantasma" (sub-skill sem handler) | BAIXO | Inventário 25 sub-skills → handler real em `03_SKILLS`; PENDENTE se faltar |
| 08 | Paths `D:\NEXUSPREMIUM` no orquestrador | BAIXO | Parametrizar root/logs/tools |
| 10 | Path `D:\NEXUSPREMIUM\data\nexus.db` em `06_tools.json` | BAIXO | Placeholder `{{DATA_DIR}}` |
| 10 | Cobertura incompleta (nem todos os 23 agentes 12/12) | BAIXO | Gerar 12 arquivos faltantes a partir do molde |
| 11 | **Bancos contêm dados pessoais reais** | **MÉDIO** | **Importar SCHEMA, NUNCA os dados**; recriar bancos vazios via `init_database()`; bloquear transferência de qualquer `.db/.wal/-journal/chroma.sqlite3` |
| 11 | `logging.basicConfig` no import (efeito global) | MÉDIO | Mover para config centralizada fora do import |
| 11 | Versões de `chromadb`/`sentence-transformers` não pinadas | BAIXO | Fixar em requirements; documentar download de `all-MiniLM-L6-v2` |

---

## 5. PRÉ-CONDIÇÃO CRÍTICA — Rotação das Chaves Expostas em E:\

**Esta é a primeira ação do roteiro e BLOQUEIA toda a integração (Fase 1 em diante).**

**Justificativa factual:** os dossiês confirmam que, embora o código-fonte não tenha segredos hardcoded, o ambiente de origem contém credenciais vivas:
- `.env` em `E:\Sistema_open_claude` (Dossiê 11, seção 4) e na raiz do vault PHANDORA (Dossiê 02, seção 4).
- `nexus_vault.db` (cofre real, Dossiê 06) com chaves em **texto plano**.
- O Router LLM (09) consome chaves reais de DeepSeek, Claude/Anthropic, OpenAI, Gemini via env (Dossiê 09, seção 3).
- `.env` referenciado em `D:\BIBLIOTECA_COMPLEXO_ZEUS\91_CONFIGS\.env` (Dossiê 09, seção 4).

**Premissa:** qualquer chave que tenha existido nesses arquivos em `E:\` deve ser tratada como **potencialmente comprometida** (longa exposição em disco, múltiplas cópias/backups confirmadas nos dossiês).

**Procedimento obrigatório (antes da Fase 1):**
1. Inventariar todos os providers em uso: DeepSeek, Anthropic/Claude, OpenAI, Gemini, Tavily, Ollama (local — sem chave) e quaisquer outros confirmados no Vault.
2. **Rotacionar (gerar nova chave e revogar a antiga)** em cada painel de provider — não apenas mover a chave antiga para o Vault.
3. Registrar as NOVAS chaves diretamente no API Vault da Fábrica (Fase 1) — nunca em `.env` em texto plano.
4. Confirmar revogação das chaves antigas no painel de cada provider.
5. Documentar a rotação em `00_GOVERNANCA` (data, providers, responsável).

**Sem rotação confirmada, a Fase 1 não inicia.** `CONFORMIDADE ZERO GHOST` da Fase 0 = PENDENTE até prova de revogação.

---

## 6. Impacto Esperado na Fábrica (ao concluir os 11 ativos)

Ao integrar os 11 ativos críticos, a Fábrica passa a ter um núcleo de runtime coeso, derivado de padrões já validados em uso real no ecossistema de origem:

- **Segurança de base (06+04):** todo segredo centralizado em cofre único (fim dos `.env` expostos); toda escrita e comando shell passam por um gate que protege `E:\` read-only e bloqueia injeção/destruição.
- **Constituição executável (01+02+03):** a Zero Ghost Law deixa de ser só texto e vira regra-mãe com 13 políticas verificáveis e um gate de governança que classifica risco em 4 níveis e exige validação humana em HIGH/CRITICAL, com histórico forense em SQLite.
- **Confiabilidade anti-alucinação (05):** todo output de LLM é validado contra o contexto observado, com bloqueio FAIL CLOSED + human review — o mecanismo que transforma a doutrina em garantia operacional.
- **Inferência soberana e econômica (09):** porta única e auditável para todo LLM, com classificação de 14 tipos de task, cascata cost-aware (Ollama local primeiro), circuit breaker financeiro, roteamento por privacidade e fallback resiliente.
- **Cognição orquestrável (07+08):** agentes deixam de ser LLMs passivos e passam a operar em loop ReAct com limites de segurança e num contrato cognitivo de 5 fases que inclui `detectar_fantasma` como gate Zero Ghost obrigatório.
- **Padronização e memória (10+11):** todo agente nasce de um template de 12 arquivos com contrato de saída, testes e permissões; e ganha continuidade real via memória de 3 camadas (working + estruturada/auditável + semântica/RAG) — sem herdar dado pessoal nenhum.

**Resultado líquido:** a Fábrica obtém um stack vertical completo — segurança → governança → guarda → roteamento → cognição → memória — onde cada camada é parametrizada, testada e auditável, e a Zero Ghost Law é enforçada por código em três pontos (SAFE_GATE, HallucinationGuard, `detectar_fantasma`), não apenas declarada.

---

## 7. O Que Fica de Fora Desta Extração (os 39 ativos não-críticos do Top 50)

Esta extração cobre **apenas os 11 ativos críticos** (núcleo de runtime mínimo viável e auditável). Os demais **39 ativos do Top 50** ficam **fora do escopo** desta missão e entram em ondas posteriores, após o núcleo estar validado.

**Critério da exclusão:** os 11 selecionados formam a cadeia mínima de dependências para um agente seguro, governado, confiável e com memória. Os 39 restantes são extensões, integrações periféricas ou ativos de risco/maturidade que dependem deste núcleo já pronto.

**Categorias confirmadas que NÃO entram agora** (referenciadas nos dossiês, mas marcadas como fora do template/escopo):
- **Bancos e dados reais:** `agente_x.db`, `learning_memory.db`, `vector/chroma.sqlite3`, `nexus_vault.db`, backups (`agente_x_pre_cleanup_*` ≈320 MB), `governance_history` populado — importa-se SCHEMA, nunca os dados (Dossiês 03, 06, 11).
- **Integrações externas das RULES 006/007:** automação de Google Drive Sync e GitHub Discipline — a decidir manter/adaptar/descartar (Dossiê 02).
- **Submódulos do Router não centrais à fusão:** `benchmark_engine.py`, `system_one_benchmark.py`, JSONs de baseline (`llm_benchmark.json`, `llm_health.json`) — úteis mas não no MVP (Dossiê 09).
- **Componentes de runtime do NEXUSPREMIUM fora do template:** `tool_executor`, `base_nexus_manager`, `core/agent_runtime/specialist_agent.py`, `data/agent_registry.json` — consumidores, não o ativo (Dossiês 08, 10).
- **Os 23 agentes-instância concretos** (O_Analista, O_Pentest_Tool, O_Juridico, etc.): importa-se o TEMPLATE (10), não os 23 agentes prontos (Dossiê 10).
- **Variantes/baselines/backups duplicados** de cada engine (cópias em `03_BASELINES`, `13_BACKUPS_DIARIOS`, `Sistema_open_claude\`, `Biblioteca\`, `ZEUS_COMMAND_CENTER`) — só a versão canônica de cada ativo é base de reconstrução.
- **Vault Obsidian completo** (`Memoria`, `Decisoes`, `.obsidian`) como 4ª camada narrativa — apenas referenciado; conteúdo humano não migra nesta onda (Dossiê 11).
- **Suítes ofensivas/Chaos/Stress de origem** (ZEUS_COMMAND_CENTER): servem de **fonte de casos de teste a revisar**, não de código a importar (Dossiê 04).

**Os 39 ativos não-críticos restantes do Top 50** serão objeto de um roteiro separado (onda 2+), priorizados somente após o núcleo dos 11 estar `CONFORMIDADE ZERO GHOST: APROVADA`. A enumeração nominal completa dos 39 **fica a confirmar** — não consta nos 11 dossiês lidos e não será inventada aqui (Zero Ghost Law).

---

## 8. Conformidade

**CONFORMIDADE ZERO GHOST: APROVADA (planejamento).**
Roteiro fundamentado exclusivamente nos 11 dossiês confirmados; nenhum código importado, copiado ou modificado de `E:\`; pendências factuais marcadas **(a confirmar)**; único arquivo gravado: este, em `D:\FABRICA_DE_SISTEMAS\17_RUNTIME\CORE_ASSETS\CORE_IMPORT_ROADMAP.md`.
