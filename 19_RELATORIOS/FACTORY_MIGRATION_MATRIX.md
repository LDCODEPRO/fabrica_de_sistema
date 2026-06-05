# FACTORY_MIGRATION_MATRIX

**Fábrica de Sistemas — Matriz de Aproveitamento de Ativos**
**Data:** 2026-06-04
**Autor:** Estrategista de Migração da Fábrica de Sistemas
**Regime:** ZERO GHOST LAW ATIVA — missão APENAS DE ANÁLISE. Unidade E:\ é área SOMENTE LEITURA. Nenhum arquivo de E:\ foi copiado, importado, modificado ou apagado nesta missão. Este documento é o único artefato gravado, em D:\FABRICA_DE_SISTEMAS\19_RELATORIOS\.

---

## 1. Introdução e Critérios de Decisão

Esta matriz consolida o mapeamento de 13 projetos da unidade E:\ e define, para cada ativo reaproveitável, uma decisão estratégica de migração para a FÁBRICA DE SISTEMAS. O objetivo é maximizar o reaproveitamento de código maduro, padrões arquiteturais comprovados e doutrina de governança, evitando reimportar código quebrado, hardcoded, duplicado ou inseguro.

### 1.1 Critérios de VALOR

| Nível | Definição |
|-------|-----------|
| **CRITICO** | Ativo fundacional. Define a identidade arquitetural da Fábrica (governança Zero Ghost, roteamento LLM, máquina de missões). Sem ele a Fábrica perde diferencial. |
| **ALTO** | Componente maduro, testado e diretamente reutilizável com ajustes mínimos. |
| **MEDIO** | Padrão útil, mas precisa de extração/refatoração antes de servir. |
| **BAIXO** | Aproveitamento marginal ou específico de produto; opcional. |

### 1.2 Critérios de RISCO

| Nível | Definição |
|-------|-----------|
| **BAIXO** | Código limpo, sem segredos, portável, com baixo acoplamento. |
| **MEDIO** | Acoplamento moderado, encoding parcial quebrado, paths a parametrizar, ou stubs/mocks. |
| **ALTO** | Credenciais expostas, paths hardcoded, código incompleto/mock, ou duplicidade que gera ambiguidade. |

### 1.3 Critérios de AÇÃO

| Ação | Quando aplicar |
|------|----------------|
| **IMPORTAR** | Valor ALTO/CRITICO e RISCO BAIXO. Trazer para a Fábrica com adaptação mínima. |
| **REFATORAR** | Valor relevante porém RISCO MEDIO/ALTO sanável. Extrair o padrão, limpar segredos, parametrizar paths, remover mocks. |
| **IGNORAR** | Valor BAIXO, duplicado, específico de cliente, inseguro sem ganho, ou meramente residual. |

### 1.4 Princípios transversais (Lei da Fábrica)

- **ZERO GHOST:** nenhum mock, hollow shell, log falso ou progresso fantasma entra na Fábrica.
- **SEM SEGREDOS NO CÓDIGO:** qualquer ativo com `.env`, API keys ou tokens hardcoded é refatorado para cofre (vault SQLite) antes de qualquer uso. Chaves expostas em E:\ são tratadas como COMPROMETIDAS.
- **E:\ READ-ONLY:** o padrão SAFE_GATE de proteção da unidade E:\ é regra herdada.
- **TESTAR ANTES DE RELATAR:** nenhum ativo é declarado "funcional" sem teste real.

---

## 2. Matriz Principal de Aproveitamento

| # | ITEM | ORIGEM | VALOR | RISCO | AÇÃO |
|---|------|--------|-------|-------|------|
| 1 | LEI ZERO GHOST / REGRA_INTEGRIDADE_ABSOLUTA (SOUL.md, ZERO_GHOST_MARTIAL_LAW.md) | E:\Agente X / Sistema_open_claude / PHANDORA | CRITICO | BAIXO | IMPORTAR |
| 2 | SAFE_GATE — validação de paths e comandos shell + proteção E:\ read-only | E:\Agente X (00_GOVERNANCE/safe_gate.py) | CRITICO | BAIXO | IMPORTAR |
| 3 | HallucinationGuard (fail-closed, scoring semântico) | E:\Agente X / PHANDORA (hallucination_guard.py) | CRITICO | BAIXO | IMPORTAR |
| 4 | ReAct Engine (Thought>Action>Observation>Final Answer) | E:\Agente X (01_CORE/orchestrator/react_engine.py) | CRITICO | BAIXO | IMPORTAR |
| 5 | Multi-LLM Router cost-aware (Ollama>DeepSeek>Claude>OpenAI) + preflight de custo | E:\Agente X / Sistema_open_claude (llm_router.py) | CRITICO | BAIXO | IMPORTAR |
| 6 | Finance/Billing Guard — circuit breaker financeiro diário/mensal | E:\Agente X / PHANDORA (billing_guard.py) | ALTO | BAIXO | IMPORTAR |
| 7 | MissionEngine — máquina de estados PENDING/IN_PROGRESS/DONE/FAILED | E:\Agente X (01_CORE/mission_engine) | ALTO | BAIXO | IMPORTAR |
| 8 | Mission State Machine (8 estados: CREATED>QUEUED>RUNNING>...>COMPLETED) | E:\SISTEMA_ONE (mission_state_machine.py) | ALTO | BAIXO | IMPORTAR |
| 9 | Memória 3 camadas (SQLite + ChromaDB + Obsidian) | E:\Agente X / Sistema_open_claude (02_MEMORY) | ALTO | BAIXO | IMPORTAR |
| 10 | SkillManager — auto-extração de skills JSON após 5+ tool calls | E:\Agente X (04_SKILLS/skill_manager.py) | ALTO | BAIXO | IMPORTAR |
| 11 | Formato padrão de skill JSON {id,goal_pattern,steps,tools_used,success_rate} | E:\Agente X (04_SKILLS/learned) | ALTO | BAIXO | IMPORTAR |
| 12 | Pipeline OGV (Observe-Ground-Verify) obrigatório pré-resposta | E:\PHANDORA (pipeline/observe_ground_verify.py) | CRITICO | BAIXO | IMPORTAR |
| 13 | Conjunto de 13 RULES numeradas (template 10 seções: Severity + Auto-checklist) | E:\PHANDORA (02_RULES/RULE_000..013) | ALTO | BAIXO | IMPORTAR |
| 14 | 12 WORKFLOWS numerados + WORKFLOW_INDEX | E:\PHANDORA (03_WORKFLOWS) | ALTO | BAIXO | IMPORTAR |
| 15 | 15 SKILLS numeradas + SKILL_INDEX | E:\PHANDORA (04_SKILLS) | ALTO | BAIXO | IMPORTAR |
| 16 | Executive Router — classificador determinístico (96.67% acc, 14 task types) | E:\SISTEMA_ONE (executive_router.py) | ALTO | BAIXO | IMPORTAR |
| 17 | ONE LLM Router 5-provider (TaskClassifier+Complexity+Privacy+Cost+Fallback) | E:\SISTEMA_ONE (01_CORE/llm_router) | CRITICO | BAIXO | IMPORTAR |
| 18 | Governance/Risk Engine — 4 níveis + bloqueio de keywords destrutivas | E:\SISTEMA_ONE / SISTEMA ONE (governance_engine.py) | ALTO | BAIXO | IMPORTAR |
| 19 | Bridge Engine — comunicação por contratos JSON (sem DB compartilhado) | E:\SISTEMA_ONE (bridge_engine.py) | ALTO | BAIXO | IMPORTAR |
| 20 | Sovereign Auditor Suite — inventário forense + health scanner | E:\SISTEMA_ONE (09_TESTS/sovereign_auditor_suite.py) | ALTO | BAIXO | IMPORTAR |
| 21 | API Vault SQLite (migração de .env, multi-provedor) | E:\NIVEL 1 (Security/API_Vault/api_vault.py) | CRITICO | BAIXO | IMPORTAR |
| 22 | Budget Guard (limite diário BRL/USD, reset automático) | E:\NIVEL 1 / NIVEL 2 (budget_guard.py) | ALTO | BAIXO | IMPORTAR |
| 23 | Template de agente em 12 arquivos de contexto numerados (01_identity..12_changelog) | E:\NIVEL 2 (managers/*) | ALTO | BAIXO | IMPORTAR |
| 24 | Pipeline cognitivo 5 fases PLANEJAR>DECIDIR>EXECUTAR>VALIDAR>RELATAR | E:\NIVEL 2 (skills_registry.json) | ALTO | BAIXO | IMPORTAR |
| 25 | SafeGate com classificação de risco LOW/MEDIUM/HIGH/PROIBIDO + ext/paths proibidos | E:\NIVEL 2 (core/executor/safe_gate.py) | ALTO | BAIXO | IMPORTAR |
| 26 | NexusExecutor — único ponto de execução física de ações | E:\NIVEL 2 (core/executor/executor.py) | ALTO | MEDIO | REFATORAR |
| 27 | MCP Bridge (ferramentas ler/atualizar missão, executar script) p/ Claude Code | E:\NIVEL 1 / NIVEL 2 (nexus_mcp_server.py) | ALTO | MEDIO | REFATORAR |
| 28 | Forja de Agentes V2 (_gerar_agentes.py, forja_nexus.py) — geração automatizada | E:\NIVEL 1 (Core/forja_nexus.py) | ALTO | MEDIO | REFATORAR |
| 29 | Template Python de agente NC_ (header, SYSTEM prompt, contexto, executar) | E:\NIVEL 1 (_gerar_agentes.py) | MEDIO | BAIXO | IMPORTAR |
| 30 | Modelos Pydantic de missão (MissaoAtiva, EtapaMissao, ResultadoTarefa) | E:\NIVEL 1 / NIVEL 2 | ALTO | BAIXO | IMPORTAR |
| 31 | Stack de persona OpenClaw (SOUL/IDENTITY/USER/MEMORY/AGENTS/POLICY/TOOLS) | E:\Biblioteca / SISTEMA ONE (OpenClaw/mentor) | ALTO | BAIXO | IMPORTAR |
| 32 | LearningLoop / learning_engine — aprendizado contínuo | E:\Agente X / BIBLIOTECA_COMPLEXO_ZEUS (learning_engine.py) | ALTO | MEDIO | REFATORAR |
| 33 | Memória operacional PHANDORA (200+ JSON: episodic/semantic/procedural/reflection) | E:\PHANDORA / Biblioteca (05_MEMORY) | MEDIO | MEDIO | REFATORAR |
| 34 | Red Team Suites (prompt_injection, hallucination_stress, evidence_poisoning) | E:\PHANDORA (01_CORE/red_team) | ALTO | MEDIO | REFATORAR |
| 35 | Chaos/Stress testing (burnin, death_test, chaos_resilience_tester) | E:\BIBLIOTECA_COMPLEXO_ZEUS (ZEUS_COMMAND_CENTER) | MEDIO | MEDIO | REFATORAR |
| 36 | ForensicSelfAuditEngine (7 perguntas pré-resposta) + IntegrityChecker SHA-256 | E:\PHANDORA (01_CORE/audit) | ALTO | MEDIO | REFATORAR |
| 37 | PhandoraRuntime / heartbeat / watchdog / scheduler / queue_manager | E:\PHANDORA (01_CORE/runtime) | MEDIO | MEDIO | REFATORAR |
| 38 | Maestro daemon 24/7 (fila de missões, modos --daemon/--once/--task) | E:\Agente X (03_RUNTIME/maestro.py) | ALTO | MEDIO | REFATORAR |
| 39 | Container WhatsApp (Node whatsapp-web.js :3000 + FastAPI :3001 > ReAct) | E:\Agente X (06_CONTAINERS/whatsapp) | MEDIO | MEDIO | REFATORAR |
| 40 | Ferramentas PHANDORA (filesystem/github/obsidian/terminal _tool.py) | E:\PHANDORA / Biblioteca (02_TOOLS) | ALTO | BAIXO | IMPORTAR |
| 41 | Hierarquia de 11 agentes HTTP-microsserviço (Secretario>Gerentes>Workers) | E:\Sistema_open_claude (Orquestrador) | MEDIO | MEDIO | REFATORAR |
| 42 | Sync Guard CI/CD PowerShell (sync_guard.ps1 + verify_sync.ps1 + version stamp) | E:\SISTEMA_ONE / SISTEMA ONE (tools) | MEDIO | BAIXO | IMPORTAR |
| 43 | Monitor Guard (bloqueio de HTML não autorizado em 04_MONITOR) | E:\SISTEMA_ONE (04_MONITOR/monitor_guard.py) | MEDIO | BAIXO | IMPORTAR |
| 44 | Dashboards HTML5 de monitoramento + Design Tokens JSON + Component Library | E:\SISTEMA_ONE (04_MONITOR/blueprints) | MEDIO | BAIXO | IMPORTAR |
| 45 | Conversation Intelligence (adaptive/context/memory/style/verbosity engines) | E:\SISTEMA_ONE (executive_copilot) | MEDIO | MEDIO | REFATORAR |
| 46 | Privacy Engine — força roteamento local p/ dados sensíveis (.env, keys) | E:\SISTEMA_ONE (privacy engine) | ALTO | BAIXO | IMPORTAR |
| 47 | Hermes Core — SOUL+MEMORY+SKILLS portável p/ qualquer agente | E:\Agente X / Sistema_open_claude (hermes_core.py) | MEDIO | MEDIO | REFATORAR |
| 48 | Auditoria de routers LLM (audit_adaptive_router_v35, audit_trimotor, cost_aware) | E:\BIBLIOTECA_COMPLEXO_ZEUS (Scripts) | MEDIO | MEDIO | REFATORAR |
| 49 | NCP Protocol (R-01..R-08: métricas, transparência, verdade absoluta, hierarquia) | E:\NIVEL 1 (NEXUS_CORE_PROTOCOL.md) | MEDIO | BAIXO | IMPORTAR |
| 50 | LLMFactory multi-provider (Gemini/OpenRouter/Ollama) + Blackboard pattern | E:\Antigravity / NIVEL 3 ANTIGRAVITY | MEDIO | ALTO | REFATORAR |
| 51 | Live Chat Socket.io + painel + notificação Telegram | E:\LDCODE (server.js) | BAIXO | ALTO | IGNORAR |
| 52 | CSS Design System boutique (40+ tokens, dark editorial) + Store localStorage | E:\BLESSED (assets/, site/store.js) | BAIXO | BAIXO | IGNORAR |
| 53 | Antigravity IDE (VSCode fork rebranded + extensões custom) | E:\Antigravity / NIVEL 3 ANTIGRAVITY | BAIXO | ALTO | IGNORAR |
| 54 | Arquivos .env com chaves reais expostas (10+ provedores) | E:\Antigravity / NIVEL 3 / Sistema_open_claude / LDCODE | BAIXO | ALTO | IGNORAR |
| 55 | SISTEMA ONE vs SISTEMA_ONE (duplicidade com/sem espaço) | E:\SISTEMA ONE (cópia doc-only) | BAIXO | ALTO | IGNORAR |
| 56 | Cópias triplicadas Nexus_Core/Antigravity_Sovereign/AMYGO_Sovereign | E:\NIVEL 3 ANTIGRAVITY | BAIXO | ALTO | IGNORAR |
| 57 | ZEUS_TASK_SAAS (mini-SaaS de tarefas Flask) | E:\BIBLIOTECA_COMPLEXO_ZEUS (04_PROJETOS) | BAIXO | MEDIO | IGNORAR |
| 58 | Múltiplos snapshots/backups diários (.zip, RESGATE, NexusCofre) | E:\Agente X / NIVEL 1 | BAIXO | BAIXO | IGNORAR |

---

## 3. IMPORTAR AGORA (Prioridade Máxima)

Ativos de valor CRITICO/ALTO e risco BAIXO que formam o esqueleto da Fábrica. São maduros, testados e limpos. Importar nesta ordem:

### 3.1 Núcleo de Governança (a "Constituição" da Fábrica)
1. **Lei Zero Ghost / REGRA_INTEGRIDADE_ABSOLUTA** (#1) — adotar como lei suprema da Fábrica; consolidar SOUL.md + ZERO_GHOST_MARTIAL_LAW.md em doutrina única.
2. **SAFE_GATE** (#2) — proteção de paths/comandos e E:\ read-only como gate universal.
3. **HallucinationGuard fail-closed** (#3) e **Pipeline OGV** (#12) — toda resposta passa por grounding antes de emitir.
4. **13 RULES + 12 WORKFLOWS + 15 SKILLS numerados** da PHANDORA (#13, #14, #15) — base documental padronizada com templates de 10 seções.

### 3.2 Motor Cognitivo
5. **ReAct Engine** (#4) — ciclo de raciocínio padrão.
6. **Pipeline cognitivo 5 fases** PLANEJAR>DECIDIR>EXECUTAR>VALIDAR>RELATAR (#24).
7. **MissionEngine + Mission State Machine** (#7, #8) — adotar a máquina de 8 estados do SISTEMA_ONE como canônica.

### 3.3 Roteamento e Custo
8. **ONE LLM Router 5-provider** (#17) — classificador + complexidade + privacidade + custo + fallback (production-grade, 98/100 em auditoria forense).
9. **Multi-LLM Router cost-aware** (#5) com cascata Ollama>DeepSeek>Claude>OpenAI.
10. **API Vault SQLite** (#21) — pré-requisito de segurança: nenhuma chave em código.
11. **Budget Guard + Billing Guard** (#22, #6) — circuit breaker financeiro.
12. **Privacy Engine** (#46) — roteamento local forçado p/ dados sensíveis.

### 3.4 Memória, Skills e Agentes
13. **Memória 3 camadas** (#9) SQLite+ChromaDB+Obsidian.
14. **SkillManager + formato skill JSON** (#10, #11) — auto-aprendizado.
15. **Template de agente 12 arquivos de contexto** (#23) e **template Python NC_** (#29).
16. **Stack de persona OpenClaw** (#31) — SOUL/IDENTITY/USER/MEMORY/AGENTS/POLICY/TOOLS.
17. **Modelos Pydantic de missão** (#30).

### 3.5 Roteamento Executivo, Ferramentas e Auditoria
18. **Executive Router** (#16), **Governance/Risk Engine** (#18), **Bridge Engine** (#19).
19. **Ferramentas filesystem/github/obsidian/terminal** (#40).
20. **Sovereign Auditor Suite** (#20), **Monitor Guard** (#43), **Sync Guard CI/CD** (#42), **Dashboards + Design Tokens** (#44).
21. **NexusExecutor SafeGate** classificador de risco (#25), **NCP Protocol** (#49).

---

## 4. REFATORAR (Próximo Sprint)

Valor relevante, mas com risco MEDIO/ALTO sanável. Extrair o padrão, limpar segredos, parametrizar paths e remover mocks antes do uso.

| Item | O que refatorar |
|------|-----------------|
| **NexusExecutor** (#26) | Desacoplar do Nexus, padronizar contrato de ação único da Fábrica. |
| **MCP Bridge** (#27) | Remover paths hardcoded; expor toolset padronizado da Fábrica via MCP. |
| **Forja de Agentes V2** (#28) | Generalizar geração para o template 12-arquivos canônico; remover dependência Nexus. |
| **LearningLoop / learning_engine** (#32) | Unificar implementações concorrentes (Agente X vs ZEUS) numa só. |
| **Memória operacional PHANDORA 200+ JSON** (#33) | Migrar para schema padronizado; validar veracidade (Zero Ghost) antes de importar. |
| **Red Team Suites** (#34) | Integrar como suíte de auto-teste contínuo da Fábrica. |
| **Chaos/Stress testing** (#35) | Generalizar burnin/death_test para qualquer agente. |
| **ForensicSelfAuditEngine + IntegrityChecker** (#36) | PHANDORA admite hashing mock/EvidenceCollector vazio — implementar de verdade (FAIL CLOSED). |
| **Runtime PHANDORA** (#37) e **Maestro daemon** (#38) | Unificar dois daemons concorrentes (Maestro vs PhandoraRuntime) num runtime único. |
| **Container WhatsApp** (#39) | Mover token/credenciais p/ vault; isolar como conector plugável. |
| **Hierarquia de agentes HTTP** (#41) | Reavaliar microsserviço por porta vs orquestração in-process; remover acoplamento. |
| **Conversation Intelligence** (#45) | Extrair engines como pacote independente. |
| **Hermes Core** (#47) | Corrigir encoding e unificar com template de persona OpenClaw. |
| **Auditorias de router LLM** (#48) | Converter scripts ad-hoc em testes automatizados versionados. |
| **LLMFactory + Blackboard (Antigravity)** (#50) | Encoding UTF-8 quebrado e paths hardcoded; extrair apenas o padrão Blackboard e o conceito multi-provider. |

**Pré-condição obrigatória de qualquer refatoração:** rotacionar TODAS as chaves expostas em E:\ e nunca trazer `.env` para a Fábrica.

---

## 5. IGNORAR (com Justificativa)

| Item | Justificativa |
|------|---------------|
| **Live Chat LDCODE** (#51) | Acoplado a site institucional específico; token Telegram hardcoded e painel sem autenticação. Risco ALTO, valor de infraestrutura nulo para a Fábrica. |
| **CSS/Store BLESSED** (#52) | Projeto de e-commerce de cliente (calopsitas). Zero padrões de agente/workflow/skill. Reuso apenas estético, fora do escopo da Fábrica. |
| **Antigravity IDE (VSCode fork)** (#53) | Binário de 218MB rebrandeado; extensão sovereign-auth injeta tokens p/ bypass de licença. Risco ALTO, sem valor de infraestrutura agentic. |
| **Arquivos .env com chaves reais** (#54) | PROIBIDO importar. Chaves de 10+ provedores expostas em texto plano — tratar como COMPROMETIDAS e rotacionar imediatamente. |
| **Duplicidade SISTEMA ONE vs SISTEMA_ONE** (#55) | A versão com espaço é apenas doc/monitor sem o core Python. Importar somente E:\SISTEMA_ONE (underscore), que contém o código real testado. Ignorar a cópia. |
| **Cópias triplicadas NIVEL 3** (#56) | AMYGO_Sovereign/Antigravity_Sovereign/Nexus_Core são quase idênticas. Escolher uma fonte única na refatoração do LLMFactory; ignorar as réplicas. |
| **ZEUS_TASK_SAAS** (#57) | Produto SaaS de tarefas, não infraestrutura de fábrica. Pode virar projeto-cliente separado, não ativo de migração. |
| **Snapshots/backups (.zip, RESGATE, NexusCofre)** (#58) | Artefatos de backup, não código fonte de produção. Sem valor de reaproveitamento direto. |

---

## 6. Cronograma Sugerido de Migração

### Sprint 0 — Segurança e Fundação (Semana 1)
- **PRIORIDADE ABSOLUTA:** auditar e rotacionar todas as chaves expostas em E:\ (NIVEL 3, Antigravity, Sistema_open_claude, LDCODE).
- Implantar **API Vault SQLite** (#21) na Fábrica como cofre único.
- Importar **Lei Zero Ghost + REGRA_INTEGRIDADE_ABSOLUTA + SAFE_GATE** (#1, #2) como constituição.

### Sprint 1 — Governança e Guardas (Semanas 2-3)
- Importar **HallucinationGuard** (#3) e **Pipeline OGV** (#12).
- Importar **13 RULES + 12 WORKFLOWS + 15 SKILLS** numerados (#13–#15).
- Importar **Governance/Risk Engine** (#18) e **SafeGate de risco** (#25).
- Importar **NCP Protocol** (#49) e **Privacy Engine** (#46).

### Sprint 2 — Motor Cognitivo e Missões (Semanas 4-5)
- Importar **ReAct Engine** (#4) e **Pipeline cognitivo 5 fases** (#24).
- Importar **MissionEngine + Mission State Machine** (#7, #8) e **Modelos Pydantic** (#30).
- Importar **Bridge Engine** (#19).

### Sprint 3 — Roteamento LLM e Custo (Semana 6)
- Importar **ONE LLM Router 5-provider** (#17) e **Multi-LLM Router** (#5).
- Importar **Budget Guard + Billing Guard** (#22, #6).
- Importar **Executive Router** (#16).

### Sprint 4 — Memória, Skills e Agentes (Semanas 7-8)
- Importar **Memória 3 camadas** (#9) e **SkillManager + formato JSON** (#10, #11).
- Importar **Template de agente 12-arquivos** (#23), **template NC_** (#29), **Stack persona OpenClaw** (#31).
- Importar **Ferramentas _tool.py** (#40).

### Sprint 5 — Auditoria, Monitor e CI/CD (Semana 9)
- Importar **Sovereign Auditor Suite** (#20), **Monitor Guard** (#43), **Sync Guard** (#42), **Dashboards + Design Tokens** (#44).

### Sprint 6+ — Refatorações (Semanas 10-13)
- Refatorar, na ordem de dependência: NexusExecutor (#26) → Maestro/Runtime unificado (#37, #38) → MCP Bridge (#27) → Forja de Agentes (#28) → LearningLoop (#32).
- Refatorar suítes de teste: Red Team (#34), Chaos (#35), ForensicSelfAudit real (#36).
- Refatorar conectores: WhatsApp (#39), Conversation Intelligence (#45), Hermes (#47).
- Migrar memória operacional PHANDORA (#33) com validação Zero Ghost.

### Marco de Conclusão
- **Semana 13:** Fábrica com núcleo CRITICO/ALTO importado, suítes de teste reais, zero segredos em código, e doutrina Zero Ghost ativa em toda a stack.

---

## 7. Notas Finais

- **Fontes de maior valor:** E:\Agente X (9/10), E:\Sistema_open_claude (9/10), E:\NIVEL 1 (9/10), E:\NIVEL 2 (9/10), E:\PHANDORA (8/10), E:\SISTEMA_ONE (8.5/10). Estes seis projetos concentram ~90% dos ativos IMPORTAR.
- **Maior dívida técnica a evitar:** duplicações (SISTEMA ONE/SISTEMA_ONE, tripla cópia NIVEL 3, dois daemons de runtime, dois LearningLoops) e segredos em texto plano.
- **Diferencial estratégico da Fábrica:** a combinação Zero Ghost + SAFE_GATE + HallucinationGuard + OGV + roteamento cost-aware com vault é o padrão arquitetural mais valioso encontrado e deve ser o coração da Fábrica de Sistemas.

---

*Documento gerado sob ZERO GHOST LAW. Nenhum arquivo de E:\ foi modificado. Único artefato gravado: este relatório em D:\FABRICA_DE_SISTEMAS\19_RELATORIOS\FACTORY_MIGRATION_MATRIX.md — 2026-06-04.*
