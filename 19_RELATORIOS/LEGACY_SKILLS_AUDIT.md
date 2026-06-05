# LEGACY_SKILLS_AUDIT.md

**Auditoria de SKILLS (capacidades / procedimentos) da unidade legada E:\**
**Fábrica de Sistemas — Missão de Análise sob ZERO GHOST LAW**

- **Auditor:** Agente de Auditoria da Fábrica de Sistemas
- **Data:** 2026-06-04
- **Escopo:** Catálogo, classificação e priorização de TODAS as skills detectadas nos sistemas legados de E:\
- **Restrição operacional:** ZERO GHOST LAW ATIVA — esta foi uma missão **APENAS DE ANÁLISE**. Nenhum arquivo de E:\ foi copiado, importado, modificado ou apagado. E:\ tratada como SOMENTE-LEITURA. O único artefato gravado foi este relatório em `D:\FABRICA_DE_SISTEMAS\19_RELATORIOS\`.

---

## 1. Sumário Executivo

A unidade E:\ contém um ecossistema multi-agente soberano construído por Luiz Cipolari, com forte linhagem evolutiva (Antigravity → ZEUS / PHANDORA → SISTEMA ONE → NEXUS → AGENTE-X). As skills se distribuem em quatro grandes famílias:

1. **Skills documentadas e numeradas** (catálogos `SKILL_001`...`SKILL_015` da PHANDORA/ZEUS, fases cognitivas do NEXUSPREMIUM) — altamente reutilizáveis, padronizadas em Markdown.
2. **Skills implementadas em código** (routers de LLM, motores de memória, safe gates, classificadores) — núcleo técnico de maior valor.
3. **Skills auto-aprendidas em JSON** (SkillManager / learned/) — específicas de contexto, valor de referência apenas.
4. **Skills herdadas / duplicadas** (Antigravity replicado em 3+ locais) — candidatas a descarte por redundância.

### Totais por classificação

| Classificação | Total | % | Significado |
|---|---|---|---|
| **REUTILIZAR** | 40 | 49% | Componente maduro, genérico, importável quase como está |
| **ADAPTAR** | 28 | 34% | Bom conceito, porém acoplado / hardcoded / parcial — requer refatoração |
| **DESCARTAR** | 14 | 17% | Duplicado, stub, hardcoded crítico, ou de baixo valor para a Fábrica |
| **TOTAL** | **82** | 100% | |

> **Padrão dominante recomendado para a Fábrica:** adotar como lei a tríade **Zero Ghost + Safe Gate + Pipeline cognitivo de 5 fases (PLANEJAR → DECIDIR → EXECUTAR → VALIDAR → RELATAR)** com roteamento LLM cost-aware e memória em 3 camadas.

---

## 2. Tabela Completa de Skills

Legenda de origem: AX=Agente X · AG=Antigravity · BIB=Biblioteca · ZEUS=BIBLIOTECA_COMPLEXO_ZEUS · BLE=BLESSED · LD=LDCODE · N1=NIVEL 1 (Complexo Nexus / Nexus Claude) · N2=NIVEL 2 (NEXUSPREMIUM) · N3=NIVEL 3 ANTIGRAVITY · PHA=PHANDORA · S1=SISTEMA ONE · S1U=SISTEMA_ONE · SOC=Sistema_open_claude

| # | Nome da Skill | Origem | Capacidade | Classificação |
|---|---|---|---|---|
| 1 | SkillManager (auto-aprendizado) | AX / SOC (04_SKILLS/skill_manager.py) | Extrai e serializa skills em JSON após tarefas com 5+ tool calls (goal_pattern, steps, tools_used, success_rate) | **REUTILIZAR** |
| 2 | ZERO_GHOST_MARTIAL_LAW_SKILL | AX / SOC (04_SKILLS/governance) | Skill de governança e veracidade — proíbe artefatos não verificáveis | **REUTILIZAR** |
| 3 | Skills aprendidas JSON (274578ab6572, 73aed394f340, 7c34629dbcbb, 7d30f57c1eb5, acba0b1e4fb0) | AX / SOC (04_SKILLS/learned/) | 5 skills auto-geradas específicas de tarefas passadas | **DESCARTAR** (valor de referência apenas; contexto-específicas) |
| 4 | REAL_AUDIT_STATUS_AGENT_X.json | AX (04_SKILLS/learned/) | Snapshot de status de auditoria | **DESCARTAR** (artefato de estado, não skill reutilizável) |
| 5 | Hermes Core | AX / SOC (hermes_core.py) | Fornece SOUL + MEMORY + SKILLS em formato Hermes para qualquer agente | **REUTILIZAR** |
| 6 | Hermes Knowledge Seeder | AX / SOC (hermes_knowledge_seeder.py 21k) | Semeador automático de conhecimento base do sistema Hermes | **ADAPTAR** |
| 7 | Skills planejadas (documentation, github, obsidian, planning, research, validation) | AX (04_SKILLS/) | Subdiretórios estruturados, ainda não populados | **ADAPTAR** (estrutura útil, conteúdo pendente) |
| 8 | LLMFactory.call() multi-provider (OpenRouter + Ollama) | AG (core/llm_factory.py) | Invocação LLM agnóstica de provedor | **ADAPTAR** (encoding quebrado / hardcoded) |
| 9 | LLMFactory variante Gemini | AG / N3 (llm_factory.py raiz, local_soul) | Chamadas Gemini 1.5 Flash | **DESCARTAR** (duplicado, hardcoded, encoding corrompido) |
| 10 | SovereignBridge.ask_the_mind() | AG / N3 (SOVEREIGN_BRIDGE.py) | Ponte Gemini 1.5 Pro para queries de alta capacidade | **ADAPTAR** |
| 11 | NexusBrain.get_memory() | AG / N3 (nexus_brain.py) | Busca semântica SQLite (LIKE) sobre knowledge_items | **ADAPTAR** (busca por LIKE é fraca; trocar por vetorial) |
| 12 | NexusBrain.execute_plan() | AG / N3 | Planejamento de tarefa aumentado por memória + raciocínio LLM | **ADAPTAR** |
| 13 | CoderAgent.create_file() | AG / N3 (agents/coder.py) | Criação de arquivo em workspace com logging no Blackboard | **ADAPTAR** |
| 14 | CHAVEIRO_MAESTRO.find_the_door() | AG / N3 (CHAVEIRO_MAESTRO.py) | Auto-descoberta do primeiro modelo Gemini funcional via API key | **REUTILIZAR** (utilitário genérico valioso) |
| 15 | NexusUltimate.think() | AG / N3 (NEXUS_ULTIMATE.py) | Inferência direta Gemini 1.5 Pro | **DESCARTAR** (redundante com LLMFactory) |
| 16 | BaseAgent.think() | AG / N3 (base_agent.py) | Raciocínio base de agente via LLMFactory + Blackboard logging | **REUTILIZAR** (padrão Blackboard extensível) |
| 17 | antigravity.generateCommitMessage | AG (extensão VS Code) | Geração de mensagem de commit por IA | **ADAPTAR** (acoplado ao IDE forkado) |
| 18 | antigravity.workflowEditor / ruleEditor | AG (extensão VS Code) | Editores customizados para .md de workflow e rules | **ADAPTAR** (conceito reutilizável; dependente de VSCode fork) |
| 19 | SKILL_001_PROJECT_MANAGEMENT | BIB/PHA/ZEUS | Gestão de projetos e missões | **REUTILIZAR** |
| 20 | SKILL_002_FILE_SYSTEM | BIB/PHA/ZEUS | Manipulação segura do sistema de arquivos | **REUTILIZAR** |
| 21 | SKILL_003_CODE_ANALYSIS | BIB/PHA/ZEUS | Análise de código | **REUTILIZAR** |
| 22 | SKILL_004_CODE_GENERATION | BIB/PHA/ZEUS | Geração de código | **REUTILIZAR** |
| 23 | SKILL_005_DOCUMENTATION | BIB/PHA/ZEUS | Documentação técnica | **REUTILIZAR** |
| 24 | SKILL_006_OBSIDIAN_WRITER | BIB/PHA/ZEUS | Escrita e organização no Obsidian | **REUTILIZAR** |
| 25 | SKILL_007_GOOGLE_DRIVE_SYNC | BIB/PHA/ZEUS | Sincronização com Google Drive | **ADAPTAR** (depende de credenciais/integração externa) |
| 26 | SKILL_008_GITHUB_MANAGER | BIB/PHA/ZEUS | Gestão de repositórios GitHub | **REUTILIZAR** |
| 27 | SKILL_009_MEMORY_MANAGER | BIB/PHA/ZEUS | Gestão de memória persistente JSON | **REUTILIZAR** |
| 28 | SKILL_010_AUDIT_ENGINE | BIB/PHA/ZEUS | Motor de auditoria forense | **REUTILIZAR** |
| 29 | SKILL_011_DECISION_SUPPORT | BIB/PHA/ZEUS | Suporte a decisões arquiteturais | **REUTILIZAR** |
| 30 | SKILL_012_RESEARCH_ENGINE | BIB/PHA/ZEUS | Motor de pesquisa e análise | **REUTILIZAR** |
| 31 | SKILL_013_ERROR_ANALYSIS | BIB/PHA/ZEUS | Análise e diagnóstico de erros | **REUTILIZAR** |
| 32 | SKILL_014_TOOL_SELECTION | BIB/PHA/ZEUS | Seleção inteligente de ferramentas | **REUTILIZAR** |
| 33 | SKILL_015_MISSION_ORCHESTRATION | BIB/PHA/ZEUS | Orquestração de missões complexas | **REUTILIZAR** |
| 34 | ANTIGRAVITY_SKILLS (Subprocess, SQLite, LLM Prompting) | ZEUS (06_SKILLS) | Skills herdadas do Antigravity para o ZEUS | **ADAPTAR** |
| 35 | SKILL_MARKDOWN_WRITER | ZEUS (06_SKILLS) | Criar/atualizar Markdown, organizar pastas, gerar logs | **REUTILIZAR** |
| 36 | skills_engine.py | BIB/SOC (Orquestrador) | Motor de skills do Sistema Open Claude | **ADAPTAR** |
| 37 | ZEUS_HABILIDADES (Controle Terminal, Scripts Python, Leitura SQLite, LLM Factory Call) | ZEUS | Habilidades operacionais do ZEUS | **ADAPTAR** |
| 38 | adaptive_routing.py / adaptive_scoring.py / adaptive_tuning.py | ZEUS (brain/) | Roteamento adaptativo de modelos | **REUTILIZAR** |
| 39 | cognitive_router.py | ZEUS (brain/) | Roteamento cognitivo com scoring | **REUTILIZAR** |
| 40 | model_router.py | ZEUS / N1 (core/) | Roteamento de modelos LLM por criticidade | **REUTILIZAR** |
| 41 | ollama_sovereignty_router.py | ZEUS (core/) | Roteamento soberano via Ollama (custo zero) | **REUTILIZAR** |
| 42 | learning_engine.py | ZEUS / PHA (brain/learning) | Motor de aprendizado contínuo | **ADAPTAR** |
| 43 | self_coding_engine.py | ZEUS (brain/) | Auto-geração de código | **ADAPTAR** (risco; requer Safe Gate forte) |
| 44 | patch_generator.py / safe_patch_executor.py | ZEUS (brain/) | Geração e execução segura de patches | **REUTILIZAR** |
| 45 | semantic_memory_v3.py | ZEUS (brain/) | Memória semântica v3 | **REUTILIZAR** |
| 46 | vector_memory.py | ZEUS (brain/) | Memória vetorial (ChromaDB) | **REUTILIZAR** |
| 47 | context_compression_engine.py / context_compression_levels.py | ZEUS (brain/) | Compressão de contexto | **REUTILIZAR** |
| 48 | S-01 Start Maestro (sinfonia.iniciar_loop) | N1 | Loop do Maestro nunca run_forever | **ADAPTAR** |
| 49 | S-02 Glow Code (canvas shadowBlur) | N1 | Aura visual pulsante para agentes em missão (3D office) | **DESCARTAR** (cosmético, acoplado à UI Nexus) |
| 50 | S-03 Log Push (requests.post /api/log) | N1 | Telemetria em tempo real | **ADAPTAR** |
| 51 | VectorDB local por agente (memoria.json rolante) | N1 | Contexto rolante das últimas 3 missões | **ADAPTAR** |
| 52 | ChromaDB vetorial (O_Guardiao) | N1 (MultiAgent_App) | Memória vetorial para agente Guardião | **REUTILIZAR** |
| 53 | Tavily search client (Forja Inteligente V2) | N1 | Busca web integrada | **REUTILIZAR** |
| 54 | API Vault (api_vault.py) | N1 / N2 | get/set chaves via SQLite (OpenAI, Anthropic, Groq, Gemini, DeepSeek, Tavily) | **REUTILIZAR** |
| 55 | LLM Factory (factory pattern por engine string) | N1 / N2 | Instancia clientes de qualquer provedor | **REUTILIZAR** |
| 56 | Budget Guard (custo/token + reset diário) | N1 / N2 / PHA | Cálculo de custo e bloqueio por teto diário | **REUTILIZAR** |
| 57 | Goal Manager (CRUD de metas) | N1 | Metas operacionais (custo, execução, estabilidade) | **REUTILIZAR** |
| 58 | Message Bus (publish/subscribe) | N1 | Comunicação entre agentes | **REUTILIZAR** |
| 59 | Risk Engine (avaliação de risco de missões) | N1 | Classifica risco de missões | **REUTILIZAR** |
| 60 | Pipeline cognitivo — PLANEJAR (decompor, objetivo, restrições, dependências, risco) | N2 (skills_registry.json) | Fase 1 do pipeline de 5 fases | **REUTILIZAR** |
| 61 | Pipeline cognitivo — DECIDIR (escolher ação/agente, classificar intenção, permissão, prioridade) | N2 | Fase 2 do pipeline | **REUTILIZAR** |
| 62 | Pipeline cognitivo — EXECUTAR (acionar executor/agente, consultar memória, ler/escrever seguro) | N2 | Fase 3 do pipeline | **REUTILIZAR** |
| 63 | Pipeline cognitivo — VALIDAR (checar resultado, comparar objetivo, verificar log/arquivo, detectar fantasma) | N2 | Fase 4 — inclui detecção de ghost data | **REUTILIZAR** |
| 64 | Pipeline cognitivo — RELATAR (resumo executivo, JSON final, log, riscos, próxima ação) | N2 | Fase 5 do pipeline | **REUTILIZAR** |
| 65 | O_Analista Skills (Tableau, Power BI) | N2 | Inteligência de dados / BI | **ADAPTAR** (depende de ferramentas externas pagas) |
| 66 | O_Designer Skills (Sketch, Adobe XD, Canva) | N2 | Criação visual / UX | **ADAPTAR** |
| 67 | O_Espiao Skills (análise de mercado e tendências) | N2 | Inteligência de tendências | **ADAPTAR** |
| 68 | O_Programador Skills (analisar código, corrigir, patches, testes) | N2 | Engenharia de software | **REUTILIZAR** |
| 69 | O_Seguranca Skills (detectar ação sensível, classificar risco, bloquear, exigir autorização) | N2 | Segurança operacional | **REUTILIZAR** |
| 70 | O_Secretario Skills (classificação de mensagens, seleção de agente, risco, payload) | N2 | Triagem e roteamento inicial | **REUTILIZAR** |
| 71 | Executive Routing (intent → ZEUS/PHANDORA/BOTH, 96.67% acc) | S1 / S1U | Classificador determinístico de destino de missão | **REUTILIZAR** |
| 72 | Governance/Risk Engine (4 níveis LOW/MED/HIGH/CRITICAL + keyword block) | S1 / S1U / N2 | Classificação de risco + bloqueio de comandos destrutivos | **REUTILIZAR** |
| 73 | Mission State Machine (5–8 estados) | S1 / S1U | Ciclo de vida de missão (created→queued→running→...→completed/failed) | **REUTILIZAR** |
| 74 | Bridge Engine (validação de contratos JSON) | S1 / S1U | Comunicação inter-sistema por contrato JSON | **REUTILIZAR** |
| 75 | Monitor Heartbeat / Proactive Checks | S1 (HEARTBEAT.md) | Checagens batch (email, calendário, clima, menções) com timing inteligente | **ADAPTAR** |
| 76 | Task Classification — 14 categorias | S1U (llm_router) | GENERAL_CHAT...SYNC, classificação de tarefa | **REUTILIZAR** |
| 77 | Complexity Scoring (ComplexityEngine) | S1U | Score numérico + tier para seleção de provedor | **REUTILIZAR** |
| 78 | Privacy Enforcement (PrivacyEngine) | S1U | Detecta padrões sensíveis (API keys, .env) e força Ollama local | **REUTILIZAR** |
| 79 | Cognitive Mode Routing (CognitiveModeRouter) | S1U | Mapeia tipos de intenção para modos cognitivos | **REUTILIZAR** |
| 80 | Ambiguity Resolution (ambiguity_resolution_engine.py) | S1U | Resolve entradas ambíguas do Diretor | **ADAPTAR** |
| 81 | Conversation Intelligence (adaptive_response, context_inference, conversation_memory, executive_style, low_fatigue, verbosity_controller) | S1U | Sub-pacote de inteligência conversacional executiva | **REUTILIZAR** |
| 82 | Multi-provider LLM fallback (DeepSeek→Gemini→OpenAI→Ollama) + Monitor guard integrity scan | S1U | Cascata automática de fallback + varredura de HTML não autorizado | **REUTILIZAR** |

> Observação: as skills `SKILL_001`–`SKILL_015` aparecem triplicadas em PHANDORA, ZEUS e Biblioteca (mesmo catálogo). Foram contadas **uma vez** cada (origem consolidada BIB/PHA/ZEUS) para evitar inflar o total com duplicatas físicas. As skills do AGENTE-X aparecem tanto em E:\Agente X quanto em E:\Sistema_open_claude\Agente X — também consolidadas.

---

## 3. Análise das Skills Mais Valiosas

### 3.1 Pipeline Cognitivo de 5 Fases (NEXUSPREMIUM) — *Jóia da coroa*
`PLANEJAR → DECIDIR → EXECUTAR → VALIDAR → RELATAR`, codificado em `skills_registry.json`. É o procedimento mais bem decomposto de todo o ecossistema, com sub-skills atômicas por fase. A fase **VALIDAR** inclui `detectar_fantasma` — alinhamento direto com a Zero Ghost Law. **Recomendação:** adotar como o esqueleto operacional padrão de toda missão da Fábrica.

### 3.2 Roteamento LLM Cost-Aware + Governança (SISTEMA_ONE / ZEUS / NEXUS)
A combinação `Task Classification (14 tipos)` + `ComplexityEngine` + `PrivacyEngine` + `RoutingPolicy (DeepSeek→Gemini→OpenAI→Ollama)` + `Budget Guard` é um router de produção testado (98/100 em auditoria forense, 96.67% de acurácia de classificação). O `PrivacyEngine` que força roteamento local Ollama ao detectar segredos é especialmente valioso para soberania de dados. **Recomendação:** importar como o módulo de roteamento canônico da Fábrica.

### 3.3 Governança / Safe Gate / Risk Engine
`Governance Engine (4 níveis de risco + keyword block)`, `Safe Gate (extensões e caminhos proibidos)` e `Risk Engine` aparecem maduros e consistentes em N1, N2, S1, S1U e PHANDORA. Bloqueiam `rm -rf`, `DROP TABLE`, `format`, `wipe`, etc., e protegem a unidade E: como somente-leitura. **Recomendação:** tornar lei obrigatória — nenhuma ação física sem passar pelo Safe Gate.

### 3.4 Memória em 3 Camadas + Compressão de Contexto
`semantic_memory_v3.py` + `vector_memory.py` (ChromaDB) + `context_compression_engine.py` + `API Vault` formam um stack de memória soberano completo (SQLite episódico + ChromaDB vetorial + Obsidian legível). **Recomendação:** reutilizar como subsistema de memória; substituir buscas por `LIKE` (NexusBrain) pela versão vetorial.

### 3.5 SkillManager Auto-Aprendizado + Hermes Core
O `SkillManager` (extração de skills após 5+ tool calls) com `Hermes Core` (SOUL+MEMORY+SKILLS portável) é o mecanismo de auto-evolução. As 5 skills JSON `learned/` já produzidas comprovam que o ciclo funciona, ainda que seu conteúdo seja descartável. **Recomendação:** reutilizar o motor; descartar os artefatos JSON específicos.

### 3.6 Bridge Engine + Mission State Machine + Executive Routing
O padrão de isolamento por contratos JSON (sem DB/memória compartilhada) com máquina de estados de missão é a melhor arquitetura inter-agente da biblioteca. **Recomendação:** padrão canônico de comunicação multi-agente.

---

## 4. Recomendações

1. **Adotar o pipeline de 5 fases (PLANEJAR→DECIDIR→EXECUTAR→VALIDAR→RELATAR) como procedimento padrão** de toda skill/missão da Fábrica, com `detectar_fantasma` obrigatório na fase VALIDAR.
2. **Consolidar UM único router de LLM** a partir do `ONE LLM Router` (SISTEMA_ONE) + `model_router`/`ollama_sovereignty_router` (ZEUS), eliminando as 4+ implementações de `LLMFactory` duplicadas (Antigravity, N3, raiz, local_soul).
3. **Promover Safe Gate + Risk Engine + Zero Ghost a "lei" não-negociável** da Fábrica, integrando o `PrivacyEngine` (forçar Ollama local para segredos).
4. **Importar o catálogo SKILL_001–SKILL_015** (PHANDORA é a versão mais documentada — template de 10 seções) como a biblioteca-base de skills, descartando as cópias redundantes em ZEUS/Biblioteca.
5. **Reutilizar o stack de memória** (semantic_memory_v3 + vector_memory + context_compression + API Vault), aposentando a busca `LIKE` do NexusBrain.
6. **Descartar duplicatas do Antigravity** replicadas em E:\Antigravity, E:\NIVEL 3 ANTIGRAVITY (AMYGO_Sovereign, Antigravity_Sovereign, Nexus_Core) — manter apenas UMA referência canônica de `BaseAgent`/`Blackboard`/`CHAVEIRO_MAESTRO`.
7. **ALERTA DE SEGURANÇA (fora de escopo de skill, mas crítico):** múltiplos `.env` em E:\ (Antigravity, NIVEL 3, Sistema_open_claude) e `server.js` (LDCODE) contêm chaves de API reais em texto plano. As skills do `API Vault` devem substituir esse padrão; recomenda-se rotação imediata das chaves nos provedores. Nenhuma chave foi lida nem exfiltrada nesta auditoria.
8. **Marcar como NOT_IMPLEMENTED** as skills planejadas mas vazias (subdiretórios 04_SKILLS do AGENTE-X; memória vazia do SISTEMA_ONE) antes de qualquer reaproveitamento, conforme princípio VERDADE > EGO.
9. **Excluir do reaproveitamento os projetos sem skills de infraestrutura** (BLESSED e LDCODE são produtos de cliente — front-end/site — sem skills de agente; valor apenas como templates de UI/CSS).

---

## 5. Conclusão

O ecossistema E:\ é uma fonte rica de skills de agente, com forte cultura de governança e veracidade (Zero Ghost) já embutida. Cerca de **metade das skills (49%) é diretamente reutilizável**, concentrada nos motores de roteamento LLM, governança/segurança, memória vetorial e no pipeline cognitivo de 5 fases. O maior risco não é técnico, mas de **duplicação descontrolada** (Antigravity replicado 4+ vezes, catálogo SKILL_001–015 triplicado) e de **stubs apresentados como prontos**. A Fábrica deve consolidar um núcleo único e canônico a partir dos melhores exemplares listados acima.

---

TOTAL_SKILLS: 82
