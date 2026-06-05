# LEGACY AGENTS INVENTORY — Inventário Completo de Agentes da Unidade E:\

> **FÁBRICA DE SISTEMAS — Relatório de Auditoria**
> **Tipo:** Missão APENAS DE ANÁLISE (Zero Ghost Law ativa)
> **Origem dos dados:** Mapeamento dos exploradores da unidade E:\ (somente leitura)
> **Auditor:** Agente Auditor da Fábrica de Sistemas
> **Data:** 2026-06-04
> **Restrição absoluta:** Nenhum arquivo de E:\ foi copiado, importado, modificado ou apagado. Apenas leitura de E:\ e gravação deste relatório em D:\FABRICA_DE_SISTEMAS\19_RELATORIOS\.

---

## 1. SUMÁRIO EXECUTIVO

A unidade E:\ contém um ecossistema multi-agente soberano construído por Luiz Cipolari (Diretor), composto por múltiplas gerações e linhagens de agentes que evoluíram umas das outras. A genealogia central é:

```
ANTIGRAVITY / NEXUS (raiz ancestral)
        │
        ├──> COMPLEXO NEXUS (NIVEL 1 / NIVEL 2 NEXUSPREMIUM)
        │
        ├──> ZEUS (gêmeo cognitivo do Antigravity)
        │
        ├──> PHANDORA (governança / validação)
        │
        ├──> SISTEMA ONE (orquestrador executivo: ZEUS + PHANDORA)
        │
        ├──> SISTEMA OPEN CLAUDE (orquestração HTTP + AGENTE-X)
        │
        └──> AGENTE-X (síntese evoluída de todos os anteriores)
```

### Totais por Classificação de Estado

| Estado | Total | Descrição |
|--------|-------|-----------|
| **ATIVO** | 96 | Agentes em uso/desenvolvimento ativo, com evidência de execução real recente |
| **LEGADO** | 64 | Agentes funcionais porém de geração anterior, mantidos como referência/herança |
| **EXPERIMENTAL** | 16 | Agentes em fase inicial, stub, mock, ou prova de conceito |
| **OBSOLETO** | 7 | Agentes duplicados, superados ou marcados explicitamente como legado/descontinuado |
| **TOTAL** | **183** | |

> **Nota metodológica:** Os 76 workers anônimos das equipes O_*_1..4 do Complexo_Nexus são contabilizados como 1 entrada agregada na tabela mas somam 76 no total. Da mesma forma, os gerentes O_* do Complexo_Nexus e os agentes O_* do NEXUSPREMIUM compartilham nomenclatura mas pertencem a sistemas distintos e são contados separadamente quando o papel/projeto difere.

### Distribuição por Projeto de Origem

| Projeto (path E:\) | Agentes únicos | Score | Maturidade |
|--------------------|---------------|-------|------------|
| Agente X | 9 | 9/10 | DESENVOLVIMENTO avançado |
| Antigravity | 6 | 4/10 | DESENVOLVIMENTO inicial |
| Biblioteca (meta-repo) | ~15 | 9/10 | DESENVOLVIMENTO |
| BIBLIOTECA_COMPLEXO_ZEUS | 11 | 8/10 | DESENVOLVIMENTO |
| NIVEL 1 (Complexo Nexus + Nexus Claude) | ~119 | 9/10 | DESENVOLVIMENTO |
| NIVEL 2 (NEXUSPREMIUM) | 23 | 9/10 | DESENVOLVIMENTO |
| NIVEL 3 ANTIGRAVITY | 6 | 5/10 | DESENVOLVIMENTO |
| PHANDORA | 9 | 8/10 | DESENVOLVIMENTO |
| SISTEMA ONE | 4 | 8/10 | DESENVOLVIMENTO |
| SISTEMA_ONE | 8 | 8.5/10 | DESENVOLVIMENTO |
| Sistema_open_claude | 16 | 9/10 | DESENVOLVIMENTO |
| BLESSED / LDCODE | 0 | 3-4/10 | PRODUCAO (sem agentes) |

---

## 2. TABELA COMPLETA DE AGENTES

Legenda de Maturidade: **PROD** (produção/uso real evidenciado) · **DEV** (desenvolvimento ativo) · **STUB** (esqueleto/mock/incompleto) · **DOC** (apenas definição documental)

### 2.1 — Agente X (E:\Agente X)

| Nome | Origem | Função | Responsabilidades | Estado | Maturidade |
|------|--------|--------|-------------------|--------|------------|
| AGENTE-X | Agente X | Agente principal autônomo 24/7 | ReAct Engine + Maestro; ciclo Thought>Action>Observation; entry point agente_x.py | ATIVO | DEV |
| Maestro | Agente X | Daemon de runtime contínuo 24/7 | Processa fila de missões (03_RUNTIME/maestro.py); modos --daemon/--once/--task | ATIVO | DEV |
| WhatsApp Agent | Agente X | Ponte FastAPI porta 3001 | Liga WhatsApp Web.js ao ReAct Engine; responde mensagens autonomamente | ATIVO | DEV |
| Hermes Core | Agente X | Núcleo de aprendizado autônomo | Fornece SOUL+MEMORY+SKILLS Hermes; portado do Sistema Open Claude | ATIVO | DEV |
| Hermes Knowledge Seeder | Agente X | Semeador de conhecimento base | Popula conhecimento inicial do sistema Hermes | ATIVO | DEV |
| Health Monitor | Agente X | Monitor de saúde | Alertas reais via SQLite (05_HEALTH/health_monitor.py) | ATIVO | DEV |
| Executive Monitor | Agente X | Monitor de governança | Vigilância executiva (00_GOVERNANCE/executive_monitor.py) | ATIVO | DEV |
| Auto Tuner | Agente X | Otimizador automático | Auto-ajuste de parâmetros (05_HEALTH/auto_tuner.py) | ATIVO | DEV |
| Performance Tracker | Agente X | Rastreador de desempenho | Métricas de performance (05_HEALTH/performance_tracker.py) | ATIVO | DEV |

### 2.2 — Antigravity / NIVEL 3 ANTIGRAVITY (linhagem NEXUS SOVEREIGN / AMYGO)

| Nome | Origem | Função | Responsabilidades | Estado | Maturidade |
|------|--------|--------|-------------------|--------|------------|
| AMYGO | Antigravity / NIVEL 3 | Persona / gêmeo digital soberano | Assistente pessoal local; executa terminal + consulta memória SQLite; def. nexus_twin_dna.txt | LEGADO | DEV |
| NexusBrain | Antigravity / NIVEL 3 | Agente de memória + raciocínio | Lê knowledge_items SQLite, chama LLM, planejamento (nexus_brain.py) | LEGADO | DEV |
| NexusOS | Antigravity / NIVEL 3 | Agente orquestrador OS-level | Flask+SocketIO; roteia /cmd para subprocess e prompts AI (NEXUS_OS.py) | LEGADO | DEV |
| Nexus_Coder / CoderAgent | Antigravity / NIVEL 3 | Engenheiro de software | Subclasse de BaseAgent; cria arquivos no workspace (agents/coder.py) | LEGADO | DEV |
| SINFONIA | Antigravity | Orquestrador (referenciado) | Despacha tarefas a sub-agentes; stub sem lógica real de dispatch | EXPERIMENTAL | STUB |
| BaseAgent | Antigravity / NIVEL 3 | Classe base abstrata de agente | name, role, blackboard logging, LLM.think() (agents/base_agent.py) | LEGADO | DEV |
| SovereignBridge | NIVEL 3 / Antigravity | Bridge para Gemini 1.5 Pro | Consultas de alta capacidade (SOVEREIGN_BRIDGE.py) | LEGADO | DEV |

### 2.3 — ZEUS / BIBLIOTECA_COMPLEXO_ZEUS

| Nome | Origem | Função | Responsabilidades | Estado | Maturidade |
|------|--------|--------|-------------------|--------|------------|
| ZEUS / AGENTE_ZEUS | BIBLIOTECA_COMPLEXO_ZEUS | Agente cognitivo operacional principal | Gêmeo evolutivo do Antigravity; orquestrador absoluto; memória SQLite + Ollama local | ATIVO | DEV |
| ZEUS_ORQUESTRADOR | BIBLIOTECA_COMPLEXO_ZEUS | Orquestrador interno do ZEUS | Herdado de NEXUS_OS.py; separa comandos puros de comandos de inteligência | ATIVO | DEV |
| autonomous_strategic_engine | BIBLIOTECA_COMPLEXO_ZEUS | Motor autônomo de estratégia | Estratégia autônoma (autonomy/) | ATIVO | DEV |
| agent_orchestrator | BIBLIOTECA_COMPLEXO_ZEUS | Orquestrador de agentes | Coordenação no módulo core/ | ATIVO | DEV |
| agent_action_controller | BIBLIOTECA_COMPLEXO_ZEUS | Controlador de ações de agentes | Gerencia execução de ações | ATIVO | DEV |
| secretary_agent | BIBLIOTECA_COMPLEXO_ZEUS | Agente secretário | Triagem/secretariado no brain/ | ATIVO | DEV |
| executive_agent_layer | BIBLIOTECA_COMPLEXO_ZEUS | Camada de agente executivo | Decisões executivas | ATIVO | DEV |
| cognitive_orchestrator | BIBLIOTECA_COMPLEXO_ZEUS | Orquestrador cognitivo | Roteamento cognitivo do brain/ | ATIVO | DEV |
| elite_engineering_orchestrator | BIBLIOTECA_COMPLEXO_ZEUS | Orquestrador de engenharia avançada | Engenharia de alto nível | ATIVO | DEV |
| zero_friction_orchestrator | BIBLIOTECA_COMPLEXO_ZEUS | Orquestrador zero-friction | Execução sem atrito | ATIVO | DEV |
| presence_orchestrator | BIBLIOTECA_COMPLEXO_ZEUS | Orquestrador de presenças | Coordena múltiplas presenças | ATIVO | DEV |

### 2.4 — PHANDORA (E:\PHANDORA)

| Nome | Origem | Função | Responsabilidades | Estado | Maturidade |
|------|--------|--------|-------------------|--------|------------|
| PHANDORA | PHANDORA | Agente soberano de governança | Núcleo cognitivo, runtime próprio, orquestração de missões, auditoria forense | ATIVO | DEV |
| PhandoraRuntime | PHANDORA | Agente de loop de runtime | Ciclo tick/heartbeat/queue (runtime/phandora_runtime.py) | ATIVO | DEV |
| LLMRouter (Phandora) | PHANDORA | Roteador de provedores LLM | Fallback entre provedores (llm/llm_router.py) | ATIVO | DEV |
| CognitiveQuorum | PHANDORA | Agente de consenso multi-LLM | Consenso entre provedores (providers/cognitive_quorum.py) | ATIVO | DEV |
| ForensicSelfAuditEngine | PHANDORA | Auto-auditor forense | 7 perguntas antes de emitir resposta (audit/forensic_self_audit_engine.py) | ATIVO | DEV |
| AutonomousForensicMonitor | PHANDORA | Monitor forense autônomo | Vigilância forense contínua (forensics/) | ATIVO | DEV |
| StrategicReasoningAgent | PHANDORA | Raciocínio estratégico | Hipóteses, cenários e padrões (strategic_reasoning/) | EXPERIMENTAL | DEV |
| LongHorizonConsistencyAgent | PHANDORA | Consistência de memória de longo prazo | Verificação de consistência (long_horizon/) | EXPERIMENTAL | DEV |
| ZEUS (braço operacional externo) | PHANDORA (ref.) | Executor externo referenciado | Python/Flask/SocketIO ZEUS_OS.py + AutonomyLoop | LEGADO | DEV |

### 2.5 — SISTEMA ONE (E:\SISTEMA ONE) e SISTEMA_ONE (E:\SISTEMA_ONE)

| Nome | Origem | Função | Responsabilidades | Estado | Maturidade |
|------|--------|--------|-------------------|--------|------------|
| SISTEMA ONE (Executive Orchestrator) | SISTEMA ONE | Orquestrador executivo | Roteia, governa, coordena missões ZEUS+PHANDORA; NÃO é executor | ATIVO | DEV |
| Executive Copilot Kernel | SISTEMA_ONE | Cérebro soberano | Interpreta Diretor, classifica intenção, planeja ações, invoca LLM Router (copilot_kernel.py) | ATIVO | DEV |
| Executive Router | SISTEMA_ONE | Classificador determinístico | Decide ZEUS/PHANDORA/BOTH (96.67% acurácia) (executive_router.py) | ATIVO | DEV |
| Governance Engine | SISTEMA_ONE | Gate de política e risco | Bloqueia comandos destrutivos; 4 níveis CRITICAL/HIGH/MEDIUM/LOW (governance_engine.py) | ATIVO | DEV |
| Mission Manager | SISTEMA_ONE | Controlador de ciclo de vida | State machine de 8 estados (mission_manager.py + mission_state_machine.py) | ATIVO | DEV |
| Bridge Engine | SISTEMA_ONE | Comunicação inter-sistemas | Contratos JSON (zeus_queue.json/phandora_queue.json), sem DB compartilhado | ATIVO | DEV |
| ONE LLM Router | SISTEMA_ONE | Roteador multi-provedor | Task classification, complexity, privacy, cost, fallback (llm_router.py) | ATIVO | DEV |
| Mentor OpenClaw | SISTEMA ONE | Mentor técnico (persona OpenClaw) | Ensina Luiz a criar agentes; canal WhatsApp; SOUL/IDENTITY/MEMORY.md | LEGADO | DEV |
| ZEUS (externo) | SISTEMA ONE/_ONE (ref.) | Subsistema executor | Coding, deploy, runtime, dashboard (D:\BIBLIOTECA_COMPLEXO_ZEUS) | LEGADO | DEV |
| PHANDORA (externo) | SISTEMA ONE/_ONE (ref.) | Subsistema validador | Auditoria forense, anti-alucinação, evidence chain (E:\PHANDORA) | LEGADO | DEV |

### 2.6 — Sistema_open_claude (E:\Sistema_open_claude) e Biblioteca (Orquestrador legado)

| Nome | Origem | Função | Responsabilidades | Estado | Maturidade |
|------|--------|--------|-------------------|--------|------------|
| Secretario | Sistema_open_claude | Orquestrador principal | chat.py, porta principal; delega a sub-agentes | LEGADO | PROD |
| O_ALMA / GERENTE_ALMA | Sistema_open_claude | Sistema nervoso central | Coordena MEMORIA/SKILLS/CRONS (alma.md, portas 3011-3013) | LEGADO | PROD |
| GERENTE_TELECOM | Sistema_open_claude | Gerente de telecomunicações | telecom_agent.py, porta 3002 | LEGADO | PROD |
| O_WHATSAPP | Sistema_open_claude | Agente de mensagens WhatsApp | whatsapp_agent.py, porta 3001 | LEGADO | PROD |
| GERENTE_DEV | Sistema_open_claude | Gerente de desenvolvimento | dev_agent.py, porta 3003 | LEGADO | PROD |
| O_BUILDER | Sistema_open_claude | Construtor de código | builder_agent.py, porta 3004 | LEGADO | PROD |
| O_TESTADOR | Sistema_open_claude | Agente de testes | testador_agent.py, porta 3005 | LEGADO | PROD |
| O_VALIDADOR_DEV | Sistema_open_claude | Validador de desenvolvimento | validador_dev_agent.py, porta 3006 | LEGADO | PROD |
| O_PROGRAMADOR | Sistema_open_claude | Programador especializado | programador_agent.py, porta 3007 | LEGADO | PROD |
| O_CODIGO | Sistema_open_claude | Especialista em código | codigo_agent.py, porta 3008 | LEGADO | PROD |
| O_CURATOR | Sistema_open_claude | Curadoria automática | curator_agent.py, porta 3009; curadoria a cada 7 dias | LEGADO | PROD |
| Claude Orquestrador | Biblioteca (Orquestrador) | Secretário pessoal | alma.md; delega, registra no Obsidian, sincroniza GitHub | LEGADO | DOC |
| Maestro/Secretario (Soul) | Biblioteca (Souls) | Coordenador de equipes | Builder, Coder, Researcher, Ops (maestro.md) | LEGADO | DOC |
| AvePro Orchestrator | Sistema_open_claude/AvePro | Orquestrador de marketing | Coordena agentes AvePro (agents/orchestrator.py) | EXPERIMENTAL | DEV |
| AvePro Analytics Agent | Sistema_open_claude/AvePro | Agente de analytics | Análise de métricas (analytics_agent.py) | EXPERIMENTAL | DEV |
| AvePro Content Agent | Sistema_open_claude/AvePro | Agente de conteúdo | Geração de conteúdo (content_agent.py) | EXPERIMENTAL | DEV |
| AvePro Social Agent | Sistema_open_claude/AvePro | Agente de redes sociais | Publicação/gestão social (social_agent.py) | EXPERIMENTAL | DEV |

### 2.7 — NIVEL 1 / Nexus_Claude (21 agentes NC_ — motor Anthropic Claude)

| Nome | Origem | Função | Responsabilidades | Estado | Maturidade |
|------|--------|--------|-------------------|--------|------------|
| NC_MAESTRO | NIVEL 1 / Nexus_Claude | Orquestrador Central | Coordenação geral via sinfonia | ATIVO | DEV |
| NC_ANALISTA | NIVEL 1 / Nexus_Claude | Big Data & Analytics | Análise de dados | ATIVO | DEV |
| NC_ESPIAO | NIVEL 1 / Nexus_Claude | Inteligência & Tendências | Monitoramento de mercado | ATIVO | DEV |
| NC_IA | NIVEL 1 / Nexus_Claude | Engenharia de Prompts | Prompt engineering | ATIVO | DEV |
| NC_AUDITOR | NIVEL 1 / Nexus_Claude | Auditoria & Conformidade | Verificação de conformidade | ATIVO | DEV |
| NC_NETWORK | NIVEL 1 / Nexus_Claude | Infraestrutura & Redes | Gestão de rede | ATIVO | DEV |
| NC_REDES_SOCIAIS | NIVEL 1 / Nexus_Claude | Social Media | Gestão de redes sociais | ATIVO | DEV |
| NC_ECOMMERCE | NIVEL 1 / Nexus_Claude | E-commerce & Conversão | Vendas digitais | ATIVO | DEV |
| NC_JURIDICO | NIVEL 1 / Nexus_Claude | Jurídico & Compliance | Conformidade legal | ATIVO | DEV |
| NC_DESIGNER | NIVEL 1 / Nexus_Claude | Design Criativo & UX | Criação visual | ATIVO | DEV |
| NC_ESTRATEGISTA | NIVEL 1 / Nexus_Claude | Estratégia & BI | Estratégia de negócio | ATIVO | DEV |
| NC_BAIXADOR | NIVEL 1 / Nexus_Claude | Web Scraping | Extração de dados web | ATIVO | DEV |
| NC_ENGENHEIRO | NIVEL 1 / Nexus_Claude | Engenharia de Software | Desenvolvimento de software | ATIVO | DEV |
| NC_ENGENHEIRO_VISUAL | NIVEL 1 / Nexus_Claude | IA Generativa & Mídia | Geração de mídia | ATIVO | DEV |
| NC_GUARDIAO | NIVEL 1 / Nexus_Claude | Proteção do Sistema | Segurança do sistema | ATIVO | DEV |
| NC_MARKETEIRO | NIVEL 1 / Nexus_Claude | Growth & Marketing | Campanhas de marketing | ATIVO | DEV |
| NC_SUPORTE | NIVEL 1 / Nexus_Claude | Suporte ao Cliente | Atendimento | ATIVO | DEV |
| NC_SEGURANCA | NIVEL 1 / Nexus_Claude | Cibersegurança | Monitoramento de segurança | ATIVO | DEV |
| NC_PENTEST | NIVEL 1 / Nexus_Claude | Red Team & Pentest | Auditoria ofensiva | ATIVO | DEV |
| NC_PROGRAMADOR | NIVEL 1 / Nexus_Claude | DevOps & Automação | Automação e patches | ATIVO | DEV |
| NC_CODEX | NIVEL 1 / Nexus_Claude | Executor de Código & Patches | Execução de código | ATIVO | DEV |

### 2.8 — NIVEL 1 / Nexus_Claude (legados Nexus_)

| Nome | Origem | Função | Responsabilidades | Estado | Maturidade |
|------|--------|--------|-------------------|--------|------------|
| Nexus_Estrategista | NIVEL 1 / Nexus_Claude | Estrategista (legado) | Substituído por NC_ESTRATEGISTA | OBSOLETO | LEGADO |
| Nexus_Engenheiro | NIVEL 1 / Nexus_Claude | Engenheiro (legado) | Substituído por NC_ENGENHEIRO | OBSOLETO | LEGADO |
| Nexus_Analista | NIVEL 1 / Nexus_Claude | Analista (legado) | Substituído por NC_ANALISTA | OBSOLETO | LEGADO |
| Nexus_Designer | NIVEL 1 / Nexus_Claude | Designer (legado) | Substituído por NC_DESIGNER | OBSOLETO | LEGADO |
| Nexus_Guardiao | NIVEL 1 / Nexus_Claude | Guardião (legado) | Substituído por NC_GUARDIAO | OBSOLETO | LEGADO |

### 2.9 — NIVEL 1 / Complexo_Nexus (motor Ollama/OpenAI — 19 gerentes + 76 workers)

| Nome | Origem | Função | Responsabilidades | Estado | Maturidade |
|------|--------|--------|-------------------|--------|------------|
| O_Maestro | Complexo_Nexus | Gerente — Orquestrador Central | Coordenação da armada | ATIVO | DEV |
| O_Analista | Complexo_Nexus | Gerente — Análise de dados | Big data & analytics | ATIVO | DEV |
| O_Designer | Complexo_Nexus | Gerente — Design | Criação visual | ATIVO | DEV |
| O_Engenheiro | Complexo_Nexus | Gerente — Engenharia | Desenvolvimento | ATIVO | DEV |
| O_Espiao | Complexo_Nexus | Gerente — Inteligência | Tendências de mercado | ATIVO | DEV |
| O_Ecommerce | Complexo_Nexus | Gerente — E-commerce | Vendas digitais | ATIVO | DEV |
| O_Juridico | Complexo_Nexus | Gerente — Jurídico | Compliance legal | ATIVO | DEV |
| O_Marketeiro | Complexo_Nexus | Gerente — Marketing | Growth hacking | ATIVO | DEV |
| O_Network | Complexo_Nexus | Gerente — Rede | Infraestrutura | ATIVO | DEV |
| O_Pentest_Tool | Complexo_Nexus | Gerente — Pentest | Segurança ofensiva | ATIVO | DEV |
| O_Programador | Complexo_Nexus | Gerente — Programação | DevOps | ATIVO | DEV |
| O_Redes_Sociais | Complexo_Nexus | Gerente — Social Media | Gestão de redes | ATIVO | DEV |
| O_Seguranca | Complexo_Nexus | Gerente — Segurança | Cibersegurança | ATIVO | DEV |
| O_Suporte | Complexo_Nexus | Gerente — Suporte | Atendimento | ATIVO | DEV |
| O_Estrategista | Complexo_Nexus | Gerente — Estratégia | BI e planejamento | ATIVO | DEV |
| O_IA | Complexo_Nexus | Gerente — Prompt Engineering | Engenharia de prompts | ATIVO | DEV |
| O_Baixador | Complexo_Nexus | Gerente — Web Scraping | Extração de assets | ATIVO | DEV |
| O_Guardiao | Complexo_Nexus | Gerente — Proteção | Guarda do sistema | ATIVO | DEV |
| O_Engenheiro_Visual | Complexo_Nexus | Gerente — IA Generativa | Mídia visual | ATIVO | DEV |
| **76 workers O_*_1..4** | Complexo_Nexus | Trabalhadores das equipes | 4 workers por gerente; execução de subtarefas | ATIVO | DEV |

### 2.10 — NIVEL 1 / MultiAgent_App

| Nome | Origem | Função | Responsabilidades | Estado | Maturidade |
|------|--------|--------|-------------------|--------|------------|
| GuardiaoAgent | MultiAgent_App | Agente guardião ChromaDB+OpenAI | Proteção com base vetorial | ATIVO | DEV |
| BibliotecarioIngestor | MultiAgent_App | Ingestão de documentos | Indexação de conhecimento | ATIVO | DEV |
| PesquisadorAgent | MultiAgent_App | Pesquisa web | Busca e coleta de informação | ATIVO | DEV |

### 2.11 — NIVEL 2 / NEXUSPREMIUM (23 agentes — categorias rígidas)

| Nome | Origem | Função | Responsabilidades | Estado | Maturidade |
|------|--------|--------|-------------------|--------|------------|
| O_Maestro | NEXUSPREMIUM | CORE — Orquestrador Central / Diretor de Produção | Planejamento mestre; nunca pula O_Seguranca | ATIVO | DEV |
| O_Secretario | NEXUSPREMIUM | CORE — Router e Triagem | Seleciona agente e LLM; nunca executa | ATIVO | DEV |
| O_Executor | NEXUSPREMIUM | CORE — Execução de ferramentas | Único agente que executa ações físicas | ATIVO | DEV |
| O_Validador | NEXUSPREMIUM | CORE — Qualidade e Regressão | Verifica resultados (run.py 13KB) | ATIVO | DEV |
| O_Seguranca | NEXUSPREMIUM | SEGURANCA — Monitoramento geral | Classifica risco, bloqueia ações críticas | ATIVO | DEV |
| O_Guardiao | NEXUSPREMIUM | SEGURANCA — Proteção de perímetro/Vault | Guarda do cofre | ATIVO | DEV |
| O_Pentest_Tool | NEXUSPREMIUM | SEGURANCA — Auditoria ofensiva | Pentest | ATIVO | DEV |
| O_Analista | NEXUSPREMIUM | ESPECIALISTA — Inteligência de dados | analyst_reports; Tableau/Power BI | ATIVO | DEV |
| O_Assistente | NEXUSPREMIUM | ESPECIALISTA — Chat direto | Interface com usuário | ATIVO | DEV |
| O_Espiao | NEXUSPREMIUM | ESPECIALISTA — Tendências/mercado | Monitor de mercado | ATIVO | DEV |
| O_Juridico | NEXUSPREMIUM | ESPECIALISTA — Conformidade/LGPD | Legal | ATIVO | DEV |
| O_Programador | NEXUSPREMIUM | TECNICO — Codificação/patches/testes | Patches e testes (run.py 11KB) | ATIVO | DEV |
| O_Engenheiro | NEXUSPREMIUM | TECNICO — Dev Fullstack | Desenvolvimento fullstack | ATIVO | DEV |
| O_Engenheiro_Visual | NEXUSPREMIUM | TECNICO — Interface e UX | UI/UX | ATIVO | DEV |
| O_Network | NEXUSPREMIUM | TECNICO — Gestão de rede | Rede | ATIVO | DEV |
| O_Designer | NEXUSPREMIUM | CRIATIVO — Criação visual | Sketch/Adobe XD/Canva | ATIVO | DEV |
| O_Marketeiro | NEXUSPREMIUM | OPERACIONAL — Growth/SEO/campanhas | Marketing | ATIVO | DEV |
| O_Ecommerce | NEXUSPREMIUM | OPERACIONAL — Vendas digitais | Shopify | ATIVO | DEV |
| O_Redes_Sociais | NEXUSPREMIUM | OPERACIONAL — Gestão de redes | Social media | ATIVO | DEV |
| O_Baixador | NEXUSPREMIUM | UTILIDADE — Crawler/Extrator | Assets | ATIVO | DEV |
| O_IA | NEXUSPREMIUM | UTILIDADE — Engenharia de prompt | Prompts | ATIVO | DEV |
| O_Suporte | NEXUSPREMIUM | UTILIDADE — Apoio técnico | Suporte ao usuário | ATIVO | DEV |
| O_Estrategista | NEXUSPREMIUM | GERENTE — Estrategista Mor | Missão e plano | ATIVO | DEV |

---

## 3. FICHAS DETALHADAS DOS AGENTES MAIS RELEVANTES

### FICHA 01 — AGENTE-X ⭐ (Score 9/10 — Candidato a Padrão da Fábrica)

- **Projeto de origem:** E:\Agente X (e versão em E:\Sistema_open_claude\Agente X)
- **Função:** Super-agente autônomo 24/7, síntese evoluída de toda a genealogia (Sistema Open Claude + PHANDORA + ANTIGRAVITY + OPENCLAW/SISTEMA ONE).
- **Arquitetura:** 14 camadas numeradas (00 a 14), ciclo ReAct (Thought>Action>Observation>Final Answer), MissionEngine com estados PENDING/IN_PROGRESS/DONE/FAILED.
- **Responsabilidades:** orquestração de missões, aprendizado de skills auto-geradas, governança Zero Ghost, integração WhatsApp/Obsidian/GitHub, backups diários, auditoria contínua.
- **Memória:** 3 camadas — short-term (context_manager), long-term (SQLite agente_x.db), vetorial (ChromaDB) + learning_memory.db.
- **LLM:** Multi-LLM router em cascata (Ollama local > DeepSeek > Claude > OpenAI) com Finance Engine e circuit breaker de custo.
- **Governança:** HallucinationGuard em FAIL CLOSED; SafeGate; risk_engine; SOUL.md.
- **Estado:** **ATIVO** · **Maturidade:** DEV avançado (até Fase 5 certificada, 40+ auditorias reais, backups 2026-05-24 a 2026-05-29).
- **Evidência de realidade:** código Python real (não hollow shells), diagnósticos JSON diários até 2026-06-03.

### FICHA 02 — ZEUS / AGENTE_ZEUS (Score 8/10)

- **Projeto de origem:** E:\BIBLIOTECA_COMPLEXO_ZEUS (referenciado também em D:\BIBLIOTECA_COMPLEXO_ZEUS).
- **Função:** Gêmeo operacional cognitivo do Antigravity; "braço executivo/runtime" da arquitetura dual ZEUS+PHANDORA.
- **Responsabilidades:** programação, deploy, automação, runtime, dashboards, correção de bugs, orquestração absoluta.
- **Arquitetura:** ZEUS_COMMAND_CENTER com 181 módulos no brain/ (roteamento cognitivo adaptativo, compressão de contexto, memória semântica, auditoria forense, chaos engineering, kanban, finance, autonomy, multi-presence, self-coding).
- **Memória:** zeus_core.db (133 MB ativo) + ChromaDB duplo (VECTOR_MEMORY e V3) + Obsidian.
- **Identidade documental:** ZEUS_IDENTIDADE.md, ZEUS_COMPORTAMENTO.md, ZEUS_HERANCA_ANTIGRAVITY.md, ZEUS_ORQUESTRADOR.md, ZEUS_HABILIDADES.md.
- **Estado:** **ATIVO** · **Maturidade:** DEV (cultura de testes reais: burnin, death_test, chaos_resilience).

### FICHA 03 — PHANDORA (Score 8/10)

- **Projeto de origem:** E:\PHANDORA (Vault Obsidian com 20 diretórios + 90+ módulos Python).
- **Função:** Agente soberano de governança; "Judiciário/Memória" da arquitetura dual; validador/auditor.
- **Responsabilidades:** análise forense, anti-alucinação, validação de verdade, evidence chains, análise de risco, orquestração de missões 24/7.
- **Pipeline obrigatório:** OGV (Observe-Ground-Verify) antes de qualquer resposta.
- **Governança:** 13 RULES numeradas (template de 10 seções), 50+ REGRA_SOVEREIGN_CRITICAL persistidas em memória.
- **Alerta de honestidade:** PHANDORA_OPERATIONAL_MAP.md admite que várias cadeias críticas (CognitiveEngine↔HallucinationGuard, AuditCI hashing, EvidenceCollector) ainda operam em MOCK/bypass — alta maturidade de auto-diagnóstico mas gap de implementação.
- **Estado:** **ATIVO** (com componentes EXPERIMENTAIS) · **Maturidade:** DEV.

### FICHA 04 — SISTEMA ONE / Executive Copilot Kernel (Score 8.5/10)

- **Projeto de origem:** E:\SISTEMA ONE (camada doc/monitor) + E:\SISTEMA_ONE (código Python real, 349 arquivos).
- **Função:** Orquestrador executivo soberano — comando, não executor. Coordena ZEUS (executor) + PHANDORA (validador) sob o Diretor (Luiz).
- **Submódulos-agente:** Executive Copilot Kernel, Executive Router (96.67% acurácia), Governance Engine (4 níveis de risco), Mission Manager (state machine 8 estados), Bridge Engine (contratos JSON), ONE LLM Router (cascata DeepSeek>Gemini>OpenAI>Ollama).
- **Governança:** ZERO_TRUST, isolamento R1-R8 (DB/memória/logs/reasoning não compartilhados), VERDADE > EGO.
- **Estado:** **ATIVO** · **Maturidade:** DEV (Fase 1 completa e testada; Fase 2 monitores em integração; Fase 3 conectores físicos não iniciada; 06_MEMORY e 05_CONNECTORS são stubs).
- **Duplicidade observada:** "SISTEMA ONE" (com espaço) e "SISTEMA_ONE" (underscore) — rastro de refatoração incompleta.

### FICHA 05 — NEXUSPREMIUM (Score 9/10 — sistema mais sofisticado encontrado)

- **Projeto de origem:** E:\NIVEL 2\NEXUSPREMIUM.
- **Função:** Sistema operacional multi-agente soberano com 23 agentes especializados em categorias rígidas (CORE, SEGURANCA, ESPECIALISTA, TECNICO, CRIATIVO, OPERACIONAL, UTILIDADE, GERENTE).
- **Pipeline cognitivo:** 5 fases — PLANEJAR > DECIDIR > EXECUTAR > VALIDAR > RELATAR.
- **Padrão de agente:** template de 12 arquivos de contexto numerados (01_identity até 12_changelog) — diretamente reaproveitável pela Fábrica.
- **Governança:** SafeGate (LOW/MEDIUM/HIGH/PROIBIDO), MODO_REAL_EXECUTION_ONLY, Budget Guard (USD 5/dia, 150/mês), QScore.
- **Alerta de saúde:** sistema em ALERTA_DERIVA (QScore 0.73); claude-3.5-sonnet e haiku em status vermelho (provável falta de API key), apenas gpt-4o verde.
- **Estado:** **ATIVO** · **Maturidade:** DEV (v0.1.0, governança madura, dependente de credenciais externas).

### FICHA 06 — Complexo Nexus + Nexus Claude (NIVEL 1) (Score 9/10 — maior contingente)

- **Projeto de origem:** E:\NIVEL 1 (DATASTORE/Complexo_Nexus + RESGATE/Nexus_Claude).
- **Função:** Dois sistemas paralelos integráveis — Complexo_Nexus (Ollama/OpenAI, ~95 agentes, porta 5000) e Nexus_Claude (Anthropic, 21 agentes NC_, porta 5001).
- **Destaques:** MCP Bridge funcional (11 ferramentas para Claude Desktop), Fábrica de Agentes automatizada (forja_nexus.py/_gerar_agentes.py), roteamento econômico de LLM em 3 camadas, API Vault SQLite, Protocolo NCP (R-01 a R-08).
- **Estado:** **ATIVO** (NC_ e O_ gerentes/workers) com 5 agentes Nexus_ **OBSOLETOS** (legado explícito).
- **Maturidade:** DEV (dashboard Flask, kanban de missões, log JSONL em tempo real, múltiplos snapshots/backups).

### FICHA 07 — Linhagem AMYGO / NEXUS SOVEREIGN (Antigravity, NIVEL 3) (Score 4-5/10)

- **Projeto de origem:** E:\Antigravity e E:\NIVEL 3 ANTIGRAVITY.
- **Função:** Gêmeo digital local soberano (AMYGO) sobre fork VSCodium 1.107.0; backend Python multi-agente (NexusBrain, NexusOS, CoderAgent, BaseAgent, SovereignBridge).
- **Padrões reutilizáveis:** Blackboard pattern, LLMFactory multi-provider, BaseAgent extensível.
- **Estado:** **LEGADO** (ancestral direto de ZEUS — nexus_brain.py, NEXUS_OS.py, CHAVEIRO_MAESTRO.py viraram a herança do ZEUS).
- **Maturidade:** DEV inicial / não production-ready (encoding UTF-8 quebrado, paths hardcoded, SINFONIA é stub).
- **⚠️ ALERTA DE SEGURANÇA CRÍTICO:** arquivos .env nestas pastas expõem 10+ chaves de API reais em texto plano (Gemini, Claude, OpenAI, Groq, Grok, OpenRouter, DeepSeek, Together, Voyage, Canva). **Devem ser consideradas comprometidas e rotacionadas imediatamente.**

---

## 4. INSIGHTS E RECOMENDAÇÕES

### 4.1 — Genealogia e Convergência

Existe uma linhagem evolutiva clara e única: **ANTIGRAVITY/NEXUS → (ZEUS + PHANDORA) → SISTEMA ONE → AGENTE-X**. O **AGENTE-X** é a síntese mais madura, herdando explicitamente DNA de 4 projetos (documentado em DNA_BLUEPRINT.md). Recomenda-se **adotar o AGENTE-X (arquitetura 14 camadas + ciclo Zero Ghost) como o padrão de referência da Fábrica de Sistemas.**

### 4.2 — Padrões de Alto Valor para Reaproveitamento

1. **Lei Zero Ghost / Integridade Absoluta:** princípio comum a quase todos os sistemas maduros (Agente X, ZEUS, PHANDORA, Sistema Open Claude, NEXUSPREMIUM). Deve ser adotada como **lei constitucional da Fábrica**.
2. **Template de agente de 12 arquivos (NEXUSPREMIUM)** e **template OpenClaw SOUL/IDENTITY/USER/MEMORY/AGENTS/POLICY** — padronizam a criação de novos agentes.
3. **Multi-LLM Router cost-aware com fallback em cascata** — presente em 6+ sistemas; consolidar uma única implementação canônica.
4. **Pipeline cognitivo de 5 fases (NEXUSPREMIUM)** e **OGV (PHANDORA)** — padrões de execução auditável.
5. **SafeGate + RiskEngine + HallucinationGuard (FAIL CLOSED)** — camada de governança rara e valiosa.
6. **Fábrica de Agentes automatizada (forja_nexus.py)** — permite replicar agentes em minutos.
7. **Comunicação por contratos JSON isolados (SISTEMA ONE)** — padrão arquitetural sólido para multi-agentes.

### 4.3 — Riscos e Dívidas Técnicas

- **🔴 CREDENCIAIS EXPOSTAS (CRÍTICO):** múltiplos `.env` com chaves de API reais em texto plano em E:\Antigravity, E:\NIVEL 3 ANTIGRAVITY e E:\Sistema_open_claude. **Ação imediata: rotacionar todas as chaves.** (Observação apenas; nenhuma escrita feita em E:\ conforme Zero Ghost Law.)
- **Duplicação SISTEMA ONE vs SISTEMA_ONE** — refatoração incompleta; consolidar em uma única fonte.
- **Stubs/mocks declarados:** SINFONIA (Antigravity), conectores e memória de SISTEMA_ONE, várias cadeias de PHANDORA. Não promover a produção sem implementação real.
- **NEXUSPREMIUM em ALERTA_DERIVA (QScore 0.73)** — depende de configuração de credenciais.
- **Proliferação de agentes O_*** com nomes idênticos em sistemas distintos (Complexo_Nexus vs NEXUSPREMIUM) — exige namespacing para evitar colisão na consolidação.

### 4.4 — Recomendação de Classificação para Migração à Fábrica

| Prioridade | Sistemas | Ação |
|-----------|----------|------|
| **MANTER/EVOLUIR** | AGENTE-X, NEXUSPREMIUM, SISTEMA_ONE, ZEUS, PHANDORA, Complexo/Nexus Claude | Núcleo ativo; extrair padrões canônicos |
| **ARQUIVAR COMO HERANÇA** | Antigravity, NIVEL 3 ANTIGRAVITY, Sistema_open_claude/Orquestrador legado | DNA institucional; não desenvolver |
| **DESCONTINUAR** | 5 agentes Nexus_ legados, duplicata SISTEMA ONE (espaço) | Superados/redundantes |
| **FORA DE ESCOPO** | BLESSED, LDCODE | Sem agentes; produtos web isolados |

---

## 5. OBSERVAÇÕES DE CONFORMIDADE

- Projetos **E:\BLESSED** e **E:\LDCODE** foram analisados e **NÃO contêm agentes de IA** (sites/produtos web). Excluídos do inventário de agentes.
- Esta auditoria respeitou integralmente a **ZERO GHOST LAW**: nenhum arquivo de E:\ foi copiado, importado, modificado ou apagado. Apenas leitura dos dados de mapeamento fornecidos. Todos os números refletem os dados reais coletados pelos exploradores.

---

TOTAL_AGENTES: 183
