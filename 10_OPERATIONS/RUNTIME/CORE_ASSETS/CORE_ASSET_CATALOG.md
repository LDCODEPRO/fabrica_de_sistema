# CORE_ASSET_CATALOG — Catálogo Consolidado dos 11 Ativos Críticos

> **ZERO GHOST LAW ATIVA.** Documento APENAS de planejamento / curadoria.
> Nenhum código foi copiado, importado ou modificado de E:\. Os arquivos de E:\ foram lidos somente em modo leitura para confirmação factual. Onde a confirmação não foi possível, o item está marcado como "a confirmar".
> **Data:** 2026-06-04
> **Local de gravação autorizado:** `D:\FABRICA_DE_SISTEMAS\17_RUNTIME\CORE_ASSETS\`

---

## 1. Introdução

`CORE_ASSETS` é o conjunto curado dos **11 ativos críticos** identificados na auditoria do ecossistema legado (E:\ — Agente X, SISTEMA_ONE, NIVEL 1, NIVEL 2/NEXUSPREMIUM, PHANDORA, Sistema_open_claude, Biblioteca). Cada ativo possui um dossiê técnico individual (`DOSSIE_01..DOSSIE_11`) gravado nesta mesma pasta, com identificação, finalidade, dependências reais confirmadas, riscos, compatibilidade com a Fábrica, classificação e plano de extração.

Este catálogo consolida as **classificações finais** dos 11 dossiês e organiza os ativos por categoria funcional, mapa de dependências e sumário de decisão.

**Regime Zero Ghost.** Toda esta curadoria opera sob a Lei Marcial Zero Ghost (ativo 01): proibido afirmar a existência de qualquer artefato sem prova real e verificável. As classificações abaixo refletem o que foi efetivamente lido no código/arquivos de origem; nenhum detalhe técnico foi inventado.

**Código ainda NÃO importado.** Nenhum dos 11 ativos foi importado, copiado ou adaptado para a Fábrica. Este catálogo é a etapa de planejamento que **precede** qualquer extração. A importação só ocorrerá após aprovação, seguindo os planos de extração de cada dossiê e o fluxo obrigatório `CRIAR > TESTAR > VALIDAR > REGISTRAR > SALVAR > REPORTAR`.

---

## 2. Tabela Mestre

| ID | Ativo | Origem (confirmada em E:\) | Tipo | Risco | Classificação | Dossiê |
|----|-------|-----------------------------|------|-------|---------------|--------|
| 01 | Zero Ghost Law / Lei Marcial Zero Ghost | Agente X (SOUL.md, REGRA_INTEGRIDADE_ABSOLUTA.md, ZERO_GHOST_MARTIAL_LAW.md) + hallucination_guard.py | Doutrina / Regra constitucional + impl. runtime | BAIXO | **ADAPTAR** | DOSSIE_01_ZERO_GHOST_LAW.md |
| 02 | Sistema de Regras Numeradas RULE_000–013 | PHANDORA `02_RULES\` (14 arquivos .md) | Template / Regra | BAIXO | **ADAPTAR** | DOSSIE_02_RULES_000_013.md |
| 03 | Governance / Risk Engine (4 níveis + keyword block) | SISTEMA_ONE `01_CORE\governance\governance_engine.py` (+4 módulos) | Engine Python | BAIXO | **ADAPTAR** | DOSSIE_03_GOVERNANCE_ENGINE.md |
| 04 | SAFE_GATE (paths + shell + E:\ read-only) | Agente X `00_GOVERNANCE\safe_gate.py` (+ variante NEXUSPREMIUM e PHANDORA forense) | Engine Python | BAIXO | **ADAPTAR** | DOSSIE_04_SAFE_GATE.md |
| 05 | HallucinationGuard (anti-alucinação, fail-closed) | Agente X `01_CORE\validation\hallucination_guard.py` | Engine Python | BAIXO | **ADAPTAR** | DOSSIE_05_HALLUCINATION_GUARD.md |
| 06 | API Vault SQLite (cofre multi-provider) | NIVEL 1 `Security\API_Vault\api_vault.py` + NIVEL 2 `vault\secrets\api_vault.py` | Engine Python | BAIXO | **ADAPTAR** | DOSSIE_06_API_VAULT.md |
| 07 | ReAct Engine (Thought>Action>Observation>Final) | Agente X `01_CORE\orchestrator\react_engine.py` | Engine Python | BAIXO | **ADAPTAR** | DOSSIE_07_REACT_ENGINE.md |
| 08 | Pipeline Cognitivo 5 Fases (PLANEJAR>DECIDIR>EXECUTAR>VALIDAR>RELATAR) | NIVEL 2 `core\cognitive\skills_registry.json` | Workflow / Padrão | BAIXO | **ADAPTAR** | DOSSIE_08_PIPELINE_5_FASES.md |
| 09 | Router LLM Unificado (ONE Router 5-provider + Multi-LLM cost-aware) | SISTEMA_ONE `01_CORE\llm_router\` + Agente X `orchestrator\llm_router.py` | Engine Python (fusão de 2 ativos) | BAIXO | **ADAPTAR** | DOSSIE_09_LLM_ROUTER_UNIFICADO.md |
| 10 | Template de Agente NEXUSPREMIUM (12 arquivos de contexto) | NIVEL 2 `managers\<agente>\context\` (12 arquivos) | Template | BAIXO | **ADAPTAR** | DOSSIE_10_TEMPLATE_AGENTE_12_ARQUIVOS.md |
| 11 | Memória em 3 Camadas (SQLite + ChromaDB + Obsidian) | Agente X `02_MEMORY` + Sistema_open_claude (vault Obsidian) | Padrão / Arquitetura | MÉDIO | **ADAPTAR** | DOSSIE_11_MEMORIA_3_CAMADAS.md |

> Nota de risco: o ativo 11 é o único classificado **MÉDIO** — os bancos de origem contêm dados pessoais reais. A diretriz é importar o **PADRÃO/schema, NUNCA os dados**. Os demais 10 ativos são risco BAIXO (sem segredos hardcoded; riscos são de portabilidade/parametrização).

---

## 3. Agrupamento por Categoria Funcional

### 3.1 Governança / Doutrina
- **[01] Zero Ghost Law** — regra-mãe constitucional (texto + guard executável associado).
- **[02] Regras Numeradas RULE_000–013** — template de 10 seções; núcleo de políticas operacionais.
- **[03] Governance / Risk Engine** — gate de decisão "permitir / classificar risco / exigir validação" + auditoria forense em SQLite.

### 3.2 Segurança
- **[04] SAFE_GATE** — enforcement técnico da Zero Ghost Law: valida paths de escrita, mantém E:\ read-only e bloqueia shell injection / comandos destrutivos.
- **[06] API Vault SQLite** — cofre de credenciais; remove segredos em texto plano de código/.env.
- **[05] HallucinationGuard** — anti-alucinação fail-closed (também é segurança de saída; ver nota de fronteira abaixo).

### 3.3 Cognição
- **[05] HallucinationGuard** — barreira anti-alucinação em tempo real sobre a resposta do LLM (fronteira Segurança/Cognição; é a materialização executável do ativo 01).
- **[07] ReAct Engine** — motor de raciocínio-ação (Thought>Action>Observation>Final Answer).
- **[08] Pipeline Cognitivo 5 Fases** — contrato declarativo de execução cognitiva (inclui `detectar_fantasma` na fase VALIDAR, alinhado à Zero Ghost Law).

### 3.4 Roteamento / Custo
- **[09] Router LLM Unificado** — porta única de inferência LLM: classificação de task (14 tipos), cascata cost-aware (Ollama>DeepSeek>Claude>OpenAI>Gemini), circuit breaker financeiro, fallback multi-camada e privacidade (force_local).

### 3.5 Estrutura de Agente
- **[10] Template de Agente NEXUSPREMIUM** — molde de 12 arquivos de contexto (identidade, papel, skill, workflow, regras, tools, memória, testes, output schema, exemplos, docs, changelog).

### 3.6 Memória
- **[11] Memória em 3 Camadas** — working (SQLite/MEMORY.md) + estruturada (SQLite agente_x.db) + vetorial/semântica (ChromaDB), mais 4ª camada narrativa Obsidian.

---

## 4. Mapa de Dependências entre os 11 Ativos

Notação: `A → B` = "A depende de / consome B". Dependências confirmadas por leitura, salvo onde marcado "a confirmar".

```
[01] Zero Ghost Law (doutrina)
       └─ é materializada por → [05] HallucinationGuard            (confirmado: header "Portado do PHANDORA"; impl. real em Agente X)
       └─ é enforçada por      → [04] SAFE_GATE                     (E:\ read-only / paths / shell = enforcement da lei)
       └─ é verificada por     → [08] Pipeline (sub-skill detectar_fantasma na fase VALIDAR)

[02] Regras RULE_000–013
       └─ alinhamento conceitual → [01] (RULE_008 ANTI_HALLUCINATION, RULE_002 NO_PHANTOM mapeiam à Zero Ghost Law)
       └─ wikilinks Obsidian → [11] (plataforma Obsidian / RULE_005 documentação)   (a confirmar nas regras não lidas)

[03] Governance / Risk Engine
       └─ módulos co-dependentes (mesmo dir): PolicyEngine, RiskEngine, ValidationGate, GovernanceRegistry  (confirmado)
       └─ persiste em → SQLite local (parente arquitetural de [11], não import direto)
       └─ rótulo validador "PHANDORA" (acoplamento conceitual, a confirmar consumo real)

[07] ReAct Engine (orquestrador central de cognição)
       └─ DEPENDE de → [09] LLM Router        (LLMRouter; risco conhecido "depende do LLM router") (confirmado)
       └─ DEPENDE de → [05] HallucinationGuard (FAIL-CLOSED: RuntimeError se não carregar)            (confirmado)
       └─ DEPENDE de → [11] Memória            (ContextManager / short_term)                          (confirmado import)
       └─ DEPENDE de → ToolRegistry, SkillManager                                                     (confirmado/parcial)
       └─ injeta perfil do Diretor (SOUL.md / director_profile.py) — PII a sanitizar

[09] LLM Router Unificado (fusão A=SISTEMA_ONE + B=Agente X)
       └─ Origem A → 12 submódulos irmãos (classifier, complexity, privacy, policy, fallback, governance, registry, health) (confirmado)
       └─ Origem B → finance_engine, anti_loop_guard, trace_context (via sys.path)                    (confirmado existem)
       └─ consome credenciais → idealmente via [06] API Vault (hoje lê .env; alvo: cofre)             (alvo de adaptação)

[08] Pipeline 5 Fases (skills_registry.json declarativo)
       └─ executável depende de → orquestrador cognitive_pipeline.py (tool_executor, base_nexus_manager) (confirmado)
       └─ ponte LLM (processar_livre/local_llama) → alvo: [09] LLM Router                              (alvo de adaptação)
       └─ fase VALIDAR (detectar_fantasma) → [01] Zero Ghost Law

[10] Template de Agente (12 arquivos)
       └─ 06_tools.json aponta DB hardcoded → parente de [11] (memória/persistência)                  (confirmado path)
       └─ usa em runtime → vault/secrets (= [06] API Vault) e config LLM (= [09])                      (acoplamento de consumo)
       └─ 05_rules.md / 06_tools.json (allowed/blocked) → mapeiam a [02]/[03]/[04] (governança)

[06] API Vault — ativo-base, sem dependências de outros ativos; é CONSUMIDO por [07],[09],[10],[16-sistemas]  (consumo a confirmar)

[04] SAFE_GATE — variante NEXUSPREMIUM acopla a realtime.event_bus; variante Agente X é stand-alone (preferível como base)

[11] Memória — ativo-base; consumido por [07] (ContextManager) e [10] (ponteiro de DB); plataforma Obsidian compartilhada com [02]
```

**Núcleos de dependência (resumo):**
- **Ativos-base (poucas ou nenhuma dependência interna; são consumidos):** [01] doutrina, [02] regras, [04] SAFE_GATE (Agente X stand-alone), [06] API Vault, [11] Memória.
- **Hub de maior acoplamento:** **[07] ReAct Engine** — depende simultaneamente de [09], [05] e [11] (mais Tool/Skill registries). É o ativo que NÃO deve ser importado sem seus dependentes.
- **Fusão controlada:** **[09] LLM Router** — exige reconciliar duas origens (dois task_classifier, dois endpoints Ollama, dois contratos de entrada).
- **Enforcement da doutrina:** [04], [05] e [08:detectar_fantasma] implementam, cada um a seu modo, a Zero Ghost Law [01].

---

## 5. Sumário de Classificação

| Classificação | Quantidade | Ativos |
|---------------|------------|--------|
| **IMPORTAR** (uso direto, sem mudança) | **0** | — |
| **ADAPTAR** (importar após parametrização/sanitização) | **11** | 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11 |
| **REJEITAR** | **0** | — |
| **Total** | **11** | — |

**Leitura do sumário:** todos os 11 ativos são valiosos e classificados **ADAPTAR**. Nenhum é importável "cru" (todos têm paths hardcoded, nomes próprios de origem, acoplamentos por `sys.path`/wikilinks, ou — no caso do 11 — dados pessoais a excluir). Nenhum é rejeitado: o conteúdo de todos foi confirmado como real, útil e alinhado ao propósito da Fábrica.

**Padrões comuns de adaptação (transversais aos 11):**
1. Remover paths absolutos hardcoded (`E:\...`, `D:\NEXUSPREMIUM`, `D:\BIBLIOTECA_COMPLEXO_ZEUS`) → config da Fábrica.
2. Neutralizar nomes próprios de origem (AGENTE-X, COMPLEXO_ZEUS, NEXUSPREMIUM, PHANDORA, "Diretor Luiz Cipolari").
3. Desacoplar imports flat / `sys.path.insert` → packages com imports relativos ou injeção de dependência.
4. Externalizar credenciais e segredos → [06] API Vault.
5. Recriar/reescrever do zero na Fábrica (sem copiar bytes de E:\) e validar com testes reais antes de promover a runtime.

---

## 6. Nota Zero Ghost / Save Law

Este catálogo foi produzido sob a **Lei Marcial Zero Ghost (ativo 01)** e respeita integralmente o regime de proteção de dados:

- **E:\ é read-only.** Nenhum arquivo de E:\ foi copiado, importado, escrito ou modificado. Apenas leitura para confirmação factual.
- **Único local de gravação:** `D:\FABRICA_DE_SISTEMAS\17_RUNTIME\CORE_ASSETS\`. Este arquivo (`CORE_ASSET_CATALOG.md`) e os 11 dossiês são os únicos artefatos gravados.
- **Sem código importado.** Os 11 ativos permanecem na origem. A Fábrica ainda NÃO contém esse código. Qualquer importação futura seguirá os planos de extração dos dossiês e o fluxo `CRIAR > TESTAR > VALIDAR > REGISTRAR > SALVAR > REPORTAR`.
- **Sem invenção técnica.** Toda afirmação deste catálogo deriva de leitura confirmada nos dossiês/origem. Itens não confirmados estão explicitamente marcados como "a confirmar" (ex.: origem PHANDORA da doutrina escrita; contagem real de entradas em `governance_history`; "6 provedores" do API Vault; consumo real do rótulo PHANDORA).
- **Save Law / dados pessoais:** o ativo 11 (e quaisquer bancos `.db`/`.wal`/`chroma.sqlite3` de origem) contém dados pessoais reais — **importar o PADRÃO, NUNCA os dados**. Os bancos serão recriados VAZIOS a partir do schema.

**CONFORMIDADE ZERO GHOST: APROVADA** — documento de planejamento, leitura somente, gravação restrita ao local autorizado, nenhuma alegação não verificada.

---

*Catálogo gerado em 2026-06-04 — Curadoria de Ativos da FÁBRICA DE SISTEMAS.*
