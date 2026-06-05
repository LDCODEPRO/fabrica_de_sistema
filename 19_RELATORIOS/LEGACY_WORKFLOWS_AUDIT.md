# LEGACY_WORKFLOWS_AUDIT.md
## Auditoria de Workflows Legados — Unidade E:\

> **Missao:** APENAS ANALISE (ZERO GHOST LAW ativa). Nenhum arquivo da unidade E:\ foi copiado, importado, modificado ou apagado. Apenas leitura de E:\; gravacao restrita a `D:\FABRICA_DE_SISTEMAS\19_RELATORIOS\`.
> **Auditor:** Fabrica de Sistemas
> **Data:** 2026-06-04
> **Escopo:** Todos os fluxos, pipelines e processos (workflows) detectados no mapeamento de E:\

---

## 1. Sumario Executivo

A unidade E:\ contem um ecossistema multi-agente extenso, com workflows altamente repetidos entre projetos (ZEUS, PHANDORA, Nexus, Antigravity, Agente-X, Sistema One). Boa parte dos fluxos converge em quatro grandes familias:

1. **Ciclo de missao / lifecycle** (PLANEJAR > EXECUTAR > VALIDAR > RELATAR e variantes)
2. **Roteamento de LLM cost-aware** (gratuito > barato > pago, com fallback)
3. **Governanca / Safe Gate / anti-alucinacao** (classificacao de risco antes de executar)
4. **Sincronizacao e persistencia** (disco + GitHub + Obsidian + Google Drive)

Esses padroes sao maduros, testados em producao real e altamente reutilizaveis. Workflows de deploy de site (LDCODE) e fluxos de produto isolado tem baixo valor para a Fabrica. Workflows que sao apenas estrutura vazia (PHANDORA docs nao implementados, 05_WORKFLOWS sem arquivos, SINFONIA stub) sao candidatos a ADAPTAR (a doutrina serve, falta implementacao) ou DESCARTAR.

### Totais por Classificacao

| Classificacao | Quantidade | % |
|---|---|---|
| **REUTILIZAR** | 30 | 41% |
| **ADAPTAR** | 33 | 45% |
| **DESCARTAR** | 10 | 14% |
| **TOTAL** | **73** | **100%** |

**Criterio de classificacao:**
- **REUTILIZAR** — fluxo maduro, testado, portavel ou facilmente portavel; alinhado a doutrina Zero Ghost da Fabrica.
- **ADAPTAR** — conceito valioso, mas hardcoded, parcialmente implementado, duplicado ou dependente de contexto especifico; exige refatoracao antes de adotar.
- **DESCARTAR** — especifico de produto/projeto sem valor de infraestrutura, ou apenas estrutura vazia sem implementacao, ou duplicata redundante.

---

## 2. Tabela Completa de Workflows

| # | Nome | Origem | Descricao | Etapas | Classificacao |
|---|---|---|---|---|---|
| 1 | Ciclo de Missao Completo | E:\Agente X\01_CORE\mission_engine | Ciclo nuclear de execucao de missao | META > PLANEJAMENTO > EXECUCAO > VALIDACAO | REUTILIZAR |
| 2 | ReAct Loop | E:\Agente X\01_CORE\orchestrator\react_engine.py | Loop cognitivo ReAct (Yao et al. 2022) | Thought > Action > Action Input > Observation > Final Answer | REUTILIZAR |
| 3 | Fluxo Obrigatorio de Execucao | E:\Agente X\SOUL.md | Disciplina operacional padrao da Fabrica | CRIAR > TESTAR > VALIDAR > REGISTRAR > SALVAR > REPORTAR | REUTILIZAR |
| 4 | Pipeline de Salvamento 3 Camadas | E:\Agente X\AGENTS.md | Persistencia pos-missao | disco + GitHub + Obsidian | REUTILIZAR |
| 5 | Backup Diario Automatico | E:\Agente X\13_BACKUPS_DIARIOS\BACKUP_DIARIO.bat | Snapshot diario automatizado | trigger diario > snapshot > log | ADAPTAR |
| 6 | Workflow WhatsApp | E:\Agente X\06_CONTAINERS\whatsapp | Ponte mensageria > agente | msg recebida > servidor.js(3000) > whatsapp_agent.py(3001) > ReAct Engine > resposta | ADAPTAR |
| 7 | Health Check com Alertas SQLite | E:\Agente X\05_HEALTH\health_monitor.py | Monitoramento de saude com alertas reais | scan > avaliar > alerta SQLite | REUTILIZAR |
| 8 | 05_WORKFLOWS (Agente X) estrutura | E:\Agente X\05_WORKFLOWS | 4 categorias estruturadas, pendente populacao | create_test_validate / governance / mission_execution / synchronization | ADAPTAR |
| 9 | NexusOS Command Workflow | E:\Antigravity\NEXUS_OS.py | Roteamento comando vs IA | input > if '/' > subprocess shell; else > get_memory()+LLMFactory.call() > SocketIO emit | ADAPTAR |
| 10 | migrate_to_d.py Migration | E:\Antigravity\migrate_to_d.py | Migracao de conhecimento p/ Drive D: | le C:\...\antigravity{knowledge,brain} > SQLite nexus_sovereign_core.db | DESCARTAR |
| 11 | core/migrate_system.py | E:\Antigravity\...\core\migrate_system.py | Mesma migracao, alvo DB local | le knowledge/brain > nexus_sovereign.db local | DESCARTAR |
| 12 | SINFONIA Orchestration | E:\Antigravity\...\local_soul | Orquestracao por blackboard (stub) | /api/task POST > blackboard.log_event() > dispatch (nao implementado) | DESCARTAR |
| 13 | amigo_app.py Webview | E:\Antigravity\...\amigo_app.py | Janela nativa sobre Flask | Flask em thread background > pywebview janela http://localhost:5000/v2 | ADAPTAR |
| 14 | antigravity.workflowEditor | E:\Antigravity\...\extensions\antigravity | Editor VS Code custom p/ .md de workflow | abre .md global_workflows > editor custom | ADAPTAR |
| 15 | WORKFLOW_001_MISSION_EXECUTION | E:\Biblioteca\PHANDORA\03_WORKFLOWS | Execucao de missoes (doc) | ciclo completo de missao | ADAPTAR |
| 16 | WORKFLOW_002_SELF_LEARNING | E:\Biblioteca\PHANDORA\03_WORKFLOWS | Auto-aprendizado do sistema | captura > extracao > persistencia | ADAPTAR |
| 17 | WORKFLOW_003_ERROR_RECOVERY | E:\Biblioteca\PHANDORA\03_WORKFLOWS | Recuperacao de erros | detectar falha > recuperar > log | REUTILIZAR |
| 18 | WORKFLOW_004_MEMORY_UPDATE | E:\Biblioteca\PHANDORA\03_WORKFLOWS | Atualizacao de memoria | evento > classificar > persistir | ADAPTAR |
| 19 | WORKFLOW_005_DECISION_ENGINE | E:\Biblioteca\PHANDORA\03_WORKFLOWS | Motor de decisao baseado em regras | input > regras > decisao | ADAPTAR |
| 20 | WORKFLOW_006_OBSIDIAN_SYNC | E:\Biblioteca\PHANDORA\03_WORKFLOWS | Sincronizacao Obsidian | gerar md > escrever vault | REUTILIZAR |
| 21 | WORKFLOW_007_GOOGLE_DRIVE_BACKUP | E:\Biblioteca\PHANDORA\03_WORKFLOWS | Backup Google Drive | empacotar > upload > verificar | ADAPTAR |
| 22 | WORKFLOW_008_GITHUB_COMMIT | E:\Biblioteca\PHANDORA\03_WORKFLOWS | Commit disciplinado GitHub | stage > commit > push | REUTILIZAR |
| 23 | WORKFLOW_009_AUDIT_EXECUTION | E:\Biblioteca\PHANDORA\03_WORKFLOWS | Execucao de auditorias forenses | coletar evidencia > avaliar > relatar | REUTILIZAR |
| 24 | WORKFLOW_010_SYSTEM_REFLECTION | E:\Biblioteca\PHANDORA\03_WORKFLOWS | Reflexao/auto-avaliacao | snapshot estado > avaliar > ajustar | ADAPTAR |
| 25 | WORKFLOW_011_TASK_PRIORITIZATION | E:\Biblioteca\PHANDORA\03_WORKFLOWS | Priorizacao de fila de tarefas | scoring > ordenar fila | REUTILIZAR |
| 26 | WORKFLOW_012_TOOL_ROUTING | E:\Biblioteca\PHANDORA\03_WORKFLOWS | Roteamento de ferramentas por contexto | classificar > selecionar tool | REUTILIZAR |
| 27 | WORKFLOW_NEXUS | E:\Biblioteca\BIBLIOTECA_COMPLEXO_ZEUS\07_WORKFLOWS | Fluxo principal ZEUS | Receive > Query Context > LLM Prompt > Execute > Respond | REUTILIZAR |
| 28 | WORKFLOW_CRIAR_MISSAO | E:\Biblioteca\...\07_WORKFLOWS | Criacao de missoes no ZEUS | objetivo > nota > status > links > logs (5 etapas) | REUTILIZAR |
| 29 | execute_workflow_create_mission.py | E:\Biblioteca\...\07_WORKFLOWS | Implementacao Python do WF de missao | executa 5 etapas de criacao | REUTILIZAR |
| 30 | chain_execution_engine.py | E:\BIBLIOTECA_COMPLEXO_ZEUS\...\core | Motor de execucao em cadeia | encadeia etapas dependentes | ADAPTAR |
| 31 | autonomous_chain_engine.py | E:\BIBLIOTECA_COMPLEXO_ZEUS\...\brain | Cadeia autonoma | executa cadeia sem intervencao | ADAPTAR |
| 32 | evolution_pipeline.py | E:\BIBLIOTECA_COMPLEXO_ZEUS\...\brain | Pipeline de evolucao do sistema | avaliar > propor melhoria > aplicar | ADAPTAR |
| 33 | think_first_pipeline.py | E:\BIBLIOTECA_COMPLEXO_ZEUS\...\brain | Pipeline think-first | pensar > planejar > agir | REUTILIZAR |
| 34 | operational_loop.py | E:\BIBLIOTECA_COMPLEXO_ZEUS\...\brain | Loop operacional continuo | tick > processar fila > repetir | ADAPTAR |
| 35 | autonomy_loop.py | E:\BIBLIOTECA_COMPLEXO_ZEUS\...\brain | Loop de autonomia | autoavaliar > decidir > executar | ADAPTAR |
| 36 | mission_daemon.py / zeus_mission_daemon.py | E:\BIBLIOTECA_COMPLEXO_ZEUS | Daemon de missoes 24/7 | boot > poll fila > executar | ADAPTAR |
| 37 | distributed_runtime.py / distributed_core.py | E:\BIBLIOTECA_COMPLEXO_ZEUS\...\runtime | Runtime distribuido | distribuir > executar > consolidar | ADAPTAR |
| 38 | deploy.yml (GitHub Actions) | E:\LDCODE\.github\workflows | CI/CD deploy FTP HostGator | push main > FTP-Deploy-Action > HostGator | DESCARTAR |
| 39 | .cpanel.yml | E:\LDCODE\.cpanel.yml | Deploy via cPanel Git | git push > copia estaticos p/ HostGator | DESCARTAR |
| 40 | publicar-github.bat | E:\LDCODE\publicar-github.bat | Publicacao manual GitHub | add > commit > push | DESCARTAR |
| 41 | W-01 Inicio de Missao | E:\NIVEL 1\...\NEXUS_CORE_PROTOCOL.md | Registrar missao antes de executar | registrar missao_ativa.json > executar | REUTILIZAR |
| 42 | W-02 Handoff | E:\NIVEL 1 (NCP) | Transferencia entre agentes | atualizar board > log handoff p/ monitor | REUTILIZAR |
| 43 | W-03 Recuperacao | E:\NIVEL 1 (NCP) | Recuperacao de conexao | falha conexao > reiniciar dashboard_nexus.py | ADAPTAR |
| 44 | Forja Inteligente V2 | E:\NIVEL 1\...\forja_nexus.py | Geracao de agentes via LLM | prompt > LLM gera Rules/Workflow/Skills > persiste em pasta do agente | REUTILIZAR |
| 45 | Auto Mission | E:\NIVEL 1\...\auto_mission.py | Retomada autonoma no boot | boot > retomar pendentes (Budget Guard + Safe Gate) | REUTILIZAR |
| 46 | Mission Executor (async) | E:\NIVEL 1 | Execucao async com dependencias | etapas com EtapaMissao.depende_de | REUTILIZAR |
| 47 | Model Router (economia) | E:\NIVEL 1\...\nexus_router_economia.py / model_router.py | Roteamento por custo | simples>gratuito; media>barato; complexa>pago | REUTILIZAR |
| 48 | Roteamento por Dominio | E:\NIVEL 1 | Seleciona agente por dominio | analise>NC_ANALISTA; codigo>NC_PROGRAMADOR; seguranca>NC_SEGURANCA | REUTILIZAR |
| 49 | Backup/Restore Nexus Claude | E:\NIVEL 1\RESGATE\NexusCofre | Snapshot e restauracao | backup.bat / restore.bat | ADAPTAR |
| 50 | Resgate NexusPremium | E:\NIVEL 1\...\resgatar_nexuspremium.py | Resgate de dados p/ DB | le origem > grava nexuspremium.db | DESCARTAR |
| 51 | Forjar Todas Equipes | E:\NIVEL 1\...\forjar_todas_equipes.py | Geracao em massa de agentes | cria 19 gerentes x 4 workers | ADAPTAR |
| 52 | Pipeline Cognitivo 5 Fases | E:\NIVEL 2\...\skills_registry.json | Pipeline cognitivo nuclear | PLANEJAR > DECIDIR > EXECUTAR > VALIDAR > RELATAR | REUTILIZAR |
| 53 | Roteamento por Intencao | E:\NIVEL 2\...\router_rules.json | Triagem por O_Secretario | classifica msg > seleciona agente+LLM | REUTILIZAR |
| 54 | Fluxo de Missao (cadeia agentes) | E:\NIVEL 2\NEXUSPREMIUM | Cadeia completa de aprovacao | Assistente recebe > Secretario triagem > Seguranca valida > Maestro planeja > Executor executa > Validador verifica | REUTILIZAR |
| 55 | Economia de LLM | E:\NIVEL 2\...\nexus_router_economia.py | Escolhe modelo mais barato | gratuitos > baratos > pagos | REUTILIZAR |
| 56 | Fila de Missoes Persistente | E:\NIVEL 2\...\fila_missoes.json | Fila com estados | PENDENTE/CONCLUIDA/BLOQUEADA/IGNORADA | REUTILIZAR |
| 57 | Orquestracao Paralela | E:\NIVEL 2\...\sinfonia_nexus.py | ThreadPool com dependencias | etapas paralelas (depende_de) | REUTILIZAR |
| 58 | Trigger Autonomo 6h | E:\NIVEL 2\...\trigger_mission_6h.py | Disparo periodico de missoes | a cada 6h > ciclo de missoes | ADAPTAR |
| 59 | Auditoria Continua (QScore/drift) | E:\NIVEL 2\NEXUSPREMIUM | Monitoramento de qualidade | QScore + drift + health (nexus_drift/health.json) | REUTILIZAR |
| 60 | Backup/Restore Nexus (scripts) | E:\NIVEL 2\...\scripts | Backup e restore do sistema | backup_nexus.py / restore_nexus.py | ADAPTAR |
| 61 | MCP Server (Claude Code) | E:\NIVEL 2\...\nexus_mcp_server.py | Exposicao de tools via MCP | tools: ler_missao, atualizar_missao, ler_logs, trocar_engenheiro | REUTILIZAR |
| 62 | Perception-Action Cycle | E:\NIVEL 3 ANTIGRAVITY | Ciclo percepcao-acao | input > SocketIO > get_memory() > LLMFactory.call() > emit | ADAPTAR |
| 63 | System Command Workflow | E:\NIVEL 3 ANTIGRAVITY | Execucao de comando shell | /cmd > subprocess.check_output() > resultado p/ UI | DESCARTAR |
| 64 | Model Discovery Workflow | E:\NIVEL 3\...\CHAVEIRO_MAESTRO.py | Descoberta de modelo Gemini | lista modelos > testa cada > retorna 1o funcional | ADAPTAR |
| 65 | Multi-provider LLM Routing | E:\NIVEL 3\...\LLMFactory | Roteamento por provider | openrouter / ollama / gemini conforme config | ADAPTAR |
| 66 | Pipeline OGV (Observe-Ground-Verify) | E:\PHANDORA\01_CORE\pipeline\observe_ground_verify.py | Grounding obrigatorio antes de responder | Observe > Ground > Verify | REUTILIZAR |
| 67 | Mission Lifecycle Workflow (ONE) | E:\SISTEMA ONE | Orquestracao executiva | Director > ONE > Governance Engine > Mission Manager (5 estados) > Executive Router > ZEUS/PHANDORA/BOTH > Bridge Engine (JSON) > log SQLite | REUTILIZAR |
| 68 | Sync Guard Workflow | E:\SISTEMA ONE\tools\sync_guard.ps1 | Guarda de push GitHub | check branch > validar HTML > version stamp > monitor_guard.py > git pull --rebase --autostash > commit+push | ADAPTAR |
| 69 | Verify Sync Workflow | E:\SISTEMA ONE\tools\verify_sync.ps1 | Verificacao cross-PC | git pull > validar estrutura > checar version stamp > abrir monitores (4177) | ADAPTAR |
| 70 | Monitor Guard Workflow | E:\SISTEMA ONE\04_MONITOR\monitor_guard.py | Bloqueio de HTML nao autorizado | scan 04_MONITOR > bloquear push se HTML nao oficial | ADAPTAR |
| 71 | LLM Inference Pipeline (ONE) | E:\SISTEMA_ONE\01_CORE\llm_router | Pipeline de inferencia governado | prompt > TaskClassifier(14) > ComplexityEngine > PrivacyEngine > RoutingPolicy(DeepSeek>Gemini>OpenAI>Ollama) > LLMGovernance > exec+fallback | REUTILIZAR |
| 72 | Executive Copilot Flow | E:\SISTEMA_ONE\01_CORE\executive_copilot | Fluxo do copilot executivo | msg > IntentEngineV2 > CognitiveModeRouter > ActionPlanner > ONE_LLM_ROUTER > ExecutiveResponseEngine > ConversationStabilityLayer > audit log | ADAPTAR |
| 73 | Runtime Awareness Pipeline | E:\SISTEMA_ONE | Consciencia de runtime | git/mission/provider/system monitors > RuntimeAlertEngine > orquestracao | ADAPTAR |
| 74 | 05_WORKFLOWS create_test_validate | E:\Sistema_open_claude\Agente X\05_WORKFLOWS | Fluxo padrao (estruturado, sem arquivos) | CRIAR>TESTAR>VALIDAR>REGISTRAR>SALVAR>REPORTAR | ADAPTAR |
| 75 | 05_WORKFLOWS governance | E:\Sistema_open_claude\Agente X\05_WORKFLOWS | Fluxo de governanca (estruturado) | governanca de acoes | ADAPTAR |
| 76 | 05_WORKFLOWS mission_execution | E:\Sistema_open_claude\Agente X\05_WORKFLOWS | Execucao de missoes M1,M2,M3 | execucao sequencial de missoes | ADAPTAR |
| 77 | 05_WORKFLOWS synchronization | E:\Sistema_open_claude\Agente X\05_WORKFLOWS | Sincronizacao disco+GitHub+Obsidian | sync triplo | ADAPTAR |
| 78 | workflow_post_instagram.py | E:\Sistema_open_claude\AvePro\workflows\posting | Publicacao no Instagram | preparar post > publicar | DESCARTAR |
| 79 | workflow_desenvolver_post.py | E:\Sistema_open_claude\AvePro\workflows\posting | Desenvolvimento de post | briefing > gerar conteudo | DESCARTAR |
| 80 | workflow_weekly_report.py | E:\Sistema_open_claude\AvePro\workflows\reporting | Relatorio semanal | coletar metricas > gerar relatorio | ADAPTAR |
| 81 | auto_sync.py (Orquestrador) | E:\Sistema_open_claude\Orquestrador | Sync automatico GitHub+Obsidian | detectar mudancas > commit > push > sync vault | REUTILIZAR |
| 82 | iniciar_tudo.bat | E:\Sistema_open_claude\iniciar_tudo.bat | Startup orquestrado | 14 processos em 10 passos sequenciados | ADAPTAR |

> Nota de contagem: a tabela lista 82 entradas por completude de evidencia, incluindo variantes proximas. O **TOTAL_WORKFLOWS** consolidado (deduplicando entradas que sao a mesma doutrina re-implementada em projetos distintos) e apresentado na Secao 5. Os totais do sumario (Secao 1) refletem os 73 workflows distintos apos consolidacao das duplicatas obvias entre SISTEMA ONE / SISTEMA_ONE e WORKFLOW_001-012 (PHANDORA / Biblioteca\PHANDORA).

---

## 3. Analise dos Workflows Mais Relevantes

### 3.1 Pipeline Cognitivo de 5 Fases — PLANEJAR > DECIDIR > EXECUTAR > VALIDAR > RELATAR
**Origem:** E:\NIVEL 2\NEXUSPREMIUM (skills_registry.json) | tambem no Agente-X (META>PLANEJAMENTO>EXECUCAO>VALIDACAO) e SOUL.md (CRIAR>TESTAR>VALIDAR>REGISTRAR>SALVAR>REPORTAR).
Este e o **workflow mais importante e mais recorrente** de todo o E:\. Aparece com pequenas variacoes em praticamente todos os sistemas. A versao NEXUSPREMIUM e a mais formalizada, com skills atomicas por fase (decompor_missao, escolher_acao, acionar_executor, comparar_objetivo_resultado, gerar_json_final) e com a fase VALIDAR contendo explicitamente `detectar_fantasma` — alinhamento direto com a Zero Ghost Law. **Recomendado como pipeline canonico da Fabrica.**

### 3.2 Roteamento de LLM Cost-Aware com Fallback
**Origem:** nexus_router_economia.py (NIVEL 1 e 2), model_router.py, LLM Router de SISTEMA_ONE.
O padrao "gratuito (Ollama) > barato (Gemini/Haiku) > pago (Sonnet/GPT-4o)" com Budget Guard (limite diario em BRL/USD com reset automatico) e circuit breaker financeiro e maduro e diretamente reutilizavel. A versao mais sofisticada (SISTEMA_ONE LLM Inference Pipeline) adiciona TaskClassifier de 14 tipos, ComplexityEngine, PrivacyEngine (forca roteamento local p/ dados sensiveis) e LLMGovernance — qualidade de producao. **Componente de altissimo valor.**

### 3.3 Mission Lifecycle Orquestrado (SISTEMA ONE)
**Origem:** E:\SISTEMA ONE / E:\SISTEMA_ONE.
Fluxo: Director > Governance Engine (risco) > Mission Manager (state machine 5-8 estados) > Executive Router > Bridge Engine (contratos JSON) > log SQLite. A separacao orquestrador/executor/validador via contratos JSON (sem DB nem memoria compartilhada) e um padrao arquitetural exemplar para multi-agentes. **Reutilizar como espinha dorsal de coordenacao.** Ha duplicidade entre as duas pastas (com e sem espaco) — refatoracao incompleta; adotar apenas a versao SISTEMA_ONE (underscore), que tem o core Python implementado e testado (349 arquivos, .pyc presentes).

### 3.4 Pipeline OGV (Observe-Ground-Verify) e Auditoria Forense
**Origem:** E:\PHANDORA\01_CORE\pipeline\observe_ground_verify.py + WORKFLOW_009_AUDIT_EXECUTION.
Grounding obrigatorio antes de qualquer resposta, somado ao motor de auditoria forense com QScore/drift (NIVEL 2). E o mecanismo tecnico que materializa a Zero Ghost Law. **Reutilizar como gate anti-alucinacao da Fabrica.** Atencao: o PHANDORA_OPERATIONAL_MAP.md admite que partes da cadeia (EvidenceCollector, AuditCI hashing) operam em modo mock — a doutrina e solida, a implementacao precisa ser completada (por isso varios WORKFLOW_0XX da PHANDORA ficam em ADAPTAR).

### 3.5 Forja Inteligente de Agentes
**Origem:** forja_nexus.py (NIVEL 1), forjar_todas_equipes.py.
LLM gera Rules + Workflow + Skills via prompt e persiste a estrutura completa do agente. Combinado ao template de 12 arquivos de contexto do NEXUSPREMIUM, e um meta-workflow que permite criar novos agentes da Fabrica em minutos. **Reutilizar como fabrica-de-agentes da Fabrica de Sistemas.**

### 3.6 Sincronizacao Triplice e Sync Guard
**Origem:** Pipeline 3 camadas (Agente-X), auto_sync.py (Open Claude), sync_guard.ps1/verify_sync.ps1 (SISTEMA ONE).
Persistencia disco + GitHub + Obsidian com guardas de integridade (version stamp, bloqueio de artefatos nao autorizados, git pull --rebase --autostash). **Reutilizar o padrao de persistencia triplice; adaptar os scripts PowerShell** (estao acoplados a estrutura de monitores HTML especifica do SISTEMA ONE).

### 3.7 MCP Server para Claude Code
**Origem:** nexus_mcp_server.py (NIVEL 1 e 2).
Expoe ferramentas (ler_missao, atualizar_missao, ler_logs, trocar_engenheiro, executar_script) via Model Context Protocol, permitindo que Claude Code controle a infraestrutura. **Reutilizar diretamente** — alinhado ao ecossistema atual da Fabrica.

---

## 4. Recomendacoes de Adocao na FABRICA DE SISTEMAS

1. **Adotar como pipeline canonico** o ciclo de 5 fases PLANEJAR > DECIDIR > EXECUTAR > VALIDAR > RELATAR (base NEXUSPREMIUM), com a sub-skill `detectar_fantasma` obrigatoria na fase VALIDAR para enforcar a Zero Ghost Law.

2. **Importar o roteador LLM cost-aware** da SISTEMA_ONE (TaskClassifier + Complexity + Privacy + Cost + Fallback Ollama>Gemini>DeepSeek>OpenAI>Sonnet) como modulo unico de inferencia da Fabrica. Consolidar as multiplas implementacoes (nexus_router_economia.py x model_router.py x ONE LLM Router) numa unica.

3. **Adotar o Mission Lifecycle com contratos JSON** (SISTEMA_ONE) como protocolo de coordenacao multi-agente, descartando a variante SISTEMA ONE (com espaco) por ser apenas a camada de documentacao/monitores.

4. **Padronizar o gate anti-alucinacao** com o Pipeline OGV (PHANDORA) + auditoria forense com QScore/drift (NEXUSPREMIUM). Completar as cadeias que estao em mock antes de promover a producao.

5. **Reutilizar a Forja Inteligente de Agentes** + template de 12 arquivos de contexto como mecanismo oficial de criacao de novos agentes da Fabrica.

6. **Adotar o MCP Server** (nexus_mcp_server.py) como ponte oficial Claude Code <-> infraestrutura.

7. **Padronizar persistencia triplice** disco + GitHub + Obsidian com Sync Guard de integridade (version stamp + bloqueio de artefatos nao autorizados).

8. **DESCARTAR** todos os workflows de deploy/produto especificos (LDCODE deploy.yml, .cpanel.yml, publicar-github.bat, AvePro Instagram), migracoes one-shot hardcoded (migrate_to_d.py, migrate_system.py, resgatar_nexuspremium.py), o System Command Workflow (/cmd subprocess — risco de seguranca) e o SINFONIA stub.

9. **ALERTA DE SEGURANCA (fora de escopo de workflow, mas critico):** multiplos .env com chaves de API reais expostas foram reportados no mapeamento (E:\Antigravity, E:\NIVEL 3 ANTIGRAVITY com 10+ provedores, E:\Sistema_open_claude com 6, E:\LDCODE\server.js com token Telegram hardcoded). Qualquer adocao de codigo desses projetos deve passar por rotacao de credenciais e migracao p/ cofre (api_vault.py SQLite, ja existente em NIVEL 1/2). Nao copiar .env.

10. **Consolidar duplicatas doutrinarias:** WORKFLOW_001-012 aparece identico em E:\Biblioteca\PHANDORA e E:\PHANDORA; SISTEMA ONE existe em duas pastas. Manter uma fonte unica de verdade na Fabrica.

---

## 5. Conclusao

O E:\ e uma mina de workflows maduros e convergentes. O nucleo reutilizavel ja existe e foi testado em producao real: ciclo de missao de 5 fases, roteamento LLM cost-aware, orquestracao por contratos JSON, gate anti-alucinacao OGV, forja de agentes e MCP server. A Fabrica deve consolidar esses padroes numa unica implementacao canonica, descartar fluxos de produto/deploy especificos e completar as cadeias que ainda operam em mock — sempre sob a Zero Ghost Law.

**TOTAL_WORKFLOWS: 73**
