# LEGACY_RULES_AUDIT.md
## Auditoria de RULES (Regras, Leis e Diretrizes Operacionais) — Unidade E:\

> **Auditor:** Fabrica de Sistemas — Modo ZERO GHOST LAW (analise apenas-leitura)
> **Data:** 2026-06-04
> **Escopo:** Mapeamento de todas as RULES detectadas nos sistemas legados da unidade E:\
> **Restricao ativa:** PROIBIDO copiar, importar, modificar ou apagar arquivos de E:\. Apenas LEITURA de E:\ e GRAVACAO em D:\FABRICA_DE_SISTEMAS\19_RELATORIOS\.

---

## 1. SUMARIO EXECUTIVO

Foram catalogadas RULES distribuidas em **13 sistemas legados** da unidade E:\. As regras convergem fortemente em torno de um nucleo doutrinario comum (integridade absoluta, anti-alucinacao, safe gate, E: read-only, testar antes de relatar), com forte duplicacao entre projetos derivados de uma mesma linhagem (Antigravity -> ZEUS -> PHANDORA -> SISTEMA ONE -> AGENTE-X / Nexus).

### Totais por classificacao

| Classificacao | Quantidade | % |
|---|---|---|
| **REUTILIZAR** | 24 | 53% |
| **ADAPTAR** | 14 | 31% |
| **DESCARTAR** | 7 | 16% |
| **TOTAL** | **45** | **100%** |

### Distribuicao por sistema de origem

| Sistema | Score | Rules detectadas | Observacao |
|---|---|---|---|
| E:\Agente X | 9/10 | 11 | Nucleo Zero Ghost mais maduro |
| E:\Antigravity | 4/10 | 4 | DNA constitucional, incompleto |
| E:\Biblioteca (PHANDORA/ZEUS/etc.) | 9/10 | RULE_000-013 + 4 ZEUS + 50+ JSON | Conjunto mais indexado |
| E:\BIBLIOTECA_COMPLEXO_ZEUS | 8/10 | 4 .md + 5 .py governanca | Lei de integridade central |
| E:\BLESSED | 4/10 | 0 | Produto e-commerce, sem rules |
| E:\LDCODE | 3/10 | 0 | Site institucional, sem rules |
| E:\NIVEL 1 (Complexo Nexus) | 9/10 | R-01 a R-08 (NCP) + Safe/Budget | Protocolo formal NCP |
| E:\NIVEL 2 (NEXUSPREMIUM) | 9/10 | LEI_SUPREMA + 16 regras operacionais | Mais sofisticado |
| E:\NIVEL 3 ANTIGRAVITY | 5/10 | 4 (DNA + blueprints) | Duplicata com credenciais expostas |
| E:\PHANDORA | 8/10 | RULE_000-013 + REGRA_SOVEREIGN | Template de regra de alta qualidade |
| E:\SISTEMA ONE | 8/10 | ECOSYSTEM_GOV + isolamento R1-R8 | Doutrina de isolamento |
| E:\SISTEMA_ONE | 8.5/10 | ZERO_TRUST + R1-R8 + LLM Gov | Versao implementada |
| E:\Sistema_open_claude | 9/10 | 7 (Zero Ghost + AvePro RULES) | Nucleo bifurcado |

---

## 2. TABELA COMPLETA DE RULES

| # | Nome | Origem | Resumo | Conflitos | Classificacao |
|---|---|---|---|---|---|
| 1 | **ZERO GHOST / LEI MARCIAL ZERO GHOST** | E:\Agente X (SOUL.md, 04_SKILLS/governance/ZERO_GHOST_MARTIAL_LAW.md); E:\Sistema_open_claude | Regra suprema: proibe qualquer simulacao, fabricacao ou relato de existencia sem prova real | Nenhum (regra suprema convergente) | **REUTILIZAR** |
| 2 | **REGRA_INTEGRIDADE_ABSOLUTA** | E:\Agente X, E:\Biblioteca, E:\BIBLIOTECA_COMPLEXO_ZEUS, E:\Sistema_open_claude | Prioridade maxima; proibe arquivos fantasmas, logs falsos, sucesso sem validacao real | Duplicado em 4+ sistemas (consolidar) | **REUTILIZAR** |
| 3 | **REGRAS_OFICIAIS_ZEUS_ANTIGRAVITY** | E:\Agente X, E:\Biblioteca, E:\BIBLIOTECA_COMPLEXO_ZEUS | Regra 1: Integridade absoluta + E: read-only; Regra 2: Testar antes de relatar | Sobrepoe rules 2, 4, 5 (composta) | **ADAPTAR** |
| 4 | **SAFE_GATE** | E:\Agente X, E:\Biblioteca, E:\BIBLIOTECA_COMPLEXO_ZEUS, E:\PHANDORA, E:\NIVEL 1/2 | Portao de seguranca: valida todo path de escrita e comando shell; classifica risco | Multiplas implementacoes divergentes | **REUTILIZAR** |
| 5 | **GOVERNANCA.md** | E:\Agente X, E:\Biblioteca, E:\BIBLIOTECA_COMPLEXO_ZEUS | Principio de modularidade, persistencia e evolucao continua | Duplicado 3x | **ADAPTAR** |
| 6 | **AUTORIZACAO_MAXIMA** | E:\Agente X, E:\BIBLIOTECA_COMPLEXO_ZEUS | Nivel TOTAL ativo permanente concedido pelo Diretor | Acopla a Luiz/Diretor especifico | **ADAPTAR** |
| 7 | **AUTORIZACAO_DIRETOR** | E:\Agente X, E:\BIBLIOTECA_COMPLEXO_ZEUS | Autorizacao formal de operacao (corrigir, daemons, patches sem confirmacao) | Acopla a Diretor especifico | **ADAPTAR** |
| 8 | **AUTO_PREVIEW_RELATORIOS** | E:\Agente X, E:\BIBLIOTECA_COMPLEXO_ZEUS | Regra de preview automatico de relatorios | Especifica de fluxo legado | **DESCARTAR** |
| 9 | **ORDEM_DIRETOR** | E:\Agente X, E:\BIBLIOTECA_COMPLEXO_ZEUS | Ordens diretas do Diretor | Redundante com rule 7 | **DESCARTAR** |
| 10 | **Ciclo imutavel CREATE > TEST > VALIDATE > SAVE** | E:\Agente X (README.md, SOUL.md) | Ciclo obrigatorio de execucao | Variacao de rule 38 | **REUTILIZAR** |
| 11 | **Restricoes absolutas (AGENTS.md)** | E:\Agente X (AGENTS.md) | Nunca escrever em E:, nunca rm -rf/DROP TABLE/format, nunca inventar dados | Convergente com rules 4, 1 | **REUTILIZAR** |
| 12 | **nexus_twin_dna.txt (AMYGO Directives)** | E:\Antigravity, E:\NIVEL 3 ANTIGRAVITY | Constituicao de identidade: SOBERANIA, AMIZADE, AGENCIA, MEMORIA | Persona-especifica (AMYGO) | **ADAPTAR** |
| 13 | **ARCHITECT_BLUEPRINTS.md** | E:\Antigravity, E:\NIVEL 3 ANTIGRAVITY | Lei arquitetural: ciclo Percepcao-Raciocinio-Acao; .env obrigatorio; expansao via agents/ + blackboard | Hardcoded paths, .env exposto | **ADAPTAR** |
| 14 | **ESTUDO_IA.md** | E:\Antigravity | Guia operacional: Gemini 1.5 Flash free tier; Ollama fallback; .env em D:\DATASTORE | Path hardcoded, guia tutorial | **DESCARTAR** |
| 15 | **antigravity extension package.json (rule/workflow editor)** | E:\Antigravity | Editor de rules/workflows para .agent/rules/**/*.md e .agent/workflows/**/*.md | Acoplado ao fork VSCode | **ADAPTAR** |
| 16 | **RULE_000_MASTER_RULE** | E:\Biblioteca\PHANDORA, E:\PHANDORA | Regra suprema: toda acao auditavel com evidencia fisica. Severity CRITICAL | Convergente com rules 1, 2 | **REUTILIZAR** |
| 17 | **RULE_001_TRUTH_RULE** | E:\PHANDORA, E:\Biblioteca | Proibido afirmar sem evidencia verificada (CRITICAL) | Convergente com rule 1 | **REUTILIZAR** |
| 18 | **RULE_002_NO_PHANTOM_PROGRESS** | E:\PHANDORA, E:\Biblioteca | Proibido relatar progresso fantasma (CRITICAL) | Convergente com R-07 | **REUTILIZAR** |
| 19 | **RULE_003_SAFE_EXECUTION** | E:\PHANDORA, E:\Biblioteca | Execucao segura com validacao pre-acao | Sobrepoe Safe Gate (rule 4) | **REUTILIZAR** |
| 20 | **RULE_004_MEMORY_INTEGRITY** | E:\PHANDORA, E:\Biblioteca | Integridade da memoria operacional/persistente | Nenhum | **REUTILIZAR** |
| 21 | **RULE_005_OBSIDIAN_DOCUMENTATION** | E:\PHANDORA, E:\Biblioteca | Toda acao documentada no Obsidian | Acopla a Obsidian | **ADAPTAR** |
| 22 | **RULE_006_GOOGLE_DRIVE_SYNC** | E:\PHANDORA, E:\Biblioteca | Sincronizacao obrigatoria com Google Drive | Acopla a Google Drive | **ADAPTAR** |
| 23 | **RULE_007_GITHUB_DISCIPLINE** | E:\PHANDORA, E:\Biblioteca | Disciplina rigorosa de commits GitHub | Nenhum | **REUTILIZAR** |
| 24 | **RULE_008_ANTI_HALLUCINATION** | E:\PHANDORA, E:\Biblioteca | Proibido fabricar dados ou resultados (CRITICAL) | Convergente com rule 1 | **REUTILIZAR** |
| 25 | **RULE_009_DIRECTOR_PRIORITY** | E:\PHANDORA, E:\Biblioteca | Comandos do Diretor tem prioridade absoluta | Acopla a Diretor | **ADAPTAR** |
| 26 | **RULE_010_SELF_IMPROVEMENT** | E:\PHANDORA, E:\Biblioteca | Auto-melhoria continua obrigatoria | Nenhum | **REUTILIZAR** |
| 27 | **RULE_011_SECURITY_RULE** | E:\PHANDORA, E:\Biblioteca | Seguranca de credenciais e tokens | Convergente com REGRA_CREDENCIAIS | **REUTILIZAR** |
| 28 | **RULE_012_TOOL_USAGE_RULE** | E:\PHANDORA, E:\Biblioteca | Uso correto e auditado de ferramentas | Nenhum | **REUTILIZAR** |
| 29 | **RULE_013_AUDIT_RULE** | E:\PHANDORA, E:\Biblioteca | Toda missao gera relatorio de auditoria | Nenhum | **REUTILIZAR** |
| 30 | **REGRA_TESTAR_ANTES_DE_RELATAR** | E:\Biblioteca\PHANDORA\05_MEMORY (JSON) | Proibido relatar sucesso sem teste real e validacao fisica | Duplica Regra 2 de rule 3 | **REUTILIZAR** |
| 31 | **REGRA_SOVEREIGN_CRITICAL_* (50+ JSON)** | E:\Biblioteca\PHANDORA\05_MEMORY, E:\PHANDORA | 50+ regras soberanas criticas persistidas em memoria | Instancias em runtime, nao fonte | **ADAPTAR** |
| 32 | **REGRA_EXECUCAO_SOMENTE_COM_SAFE_GATE.json** | E:\PHANDORA\05_MEMORY | Nenhuma execucao sem aprovacao do Safe Gate | Subordina a rule 4 | **REUTILIZAR** |
| 33 | **REGRA_E_DRIVE_SOMENTE_LEITURA.json** | E:\PHANDORA\05_MEMORY | Drive E protegido contra escrita nao autorizada | Convergente com rule 11 | **REUTILIZAR** |
| 34 | **REGRA_CREDENCIAIS_APENAS_COFRE.json** | E:\PHANDORA\05_MEMORY | Credenciais apenas via cofre seguro | Convergente com rule 27 | **REUTILIZAR** |
| 35 | **NCP R-01 a R-08 (Nexus Core Protocol)** | E:\NIVEL 1 (NEXUS_CORE_PROTOCOL.md, nexus_claude_protocol.md) | 8 regras: metricas fieis, transparencia/log, visual 3D, persistencia, custo hibrido, kanban total, verdade absoluta, hierarquia | R-03 (visual 3D) e cosmetico; R-08 acopla papeis | **ADAPTAR** |
| 36 | **Safe Gate (blacklist shell)** | E:\NIVEL 1, E:\NIVEL 2 | Lista negra de comandos perigosos (rm, del, format, diskpart, shutdown) | Implementacao de rule 4 | **REUTILIZAR** |
| 37 | **Budget Guard** | E:\NIVEL 1 (BRL 5/dia), E:\NIVEL 2 (USD 5/dia, 150/mes), E:\PHANDORA ($1/dia) | Limite diario; bloqueia modelos caros ao atingir teto | Limites e moedas divergentes | **ADAPTAR** |
| 38 | **LEI_SUPREMA + Pipeline 5 fases (NEXUSPREMIUM)** | E:\NIVEL 2 | Execucao real obrigatoria (MODO_FAKE: false); REALIDADE/EXECUTOR/SAFE_GATE/LOG_TOTAL; cadeia de aprovacao O_Seguranca | Banco hardcoded D:\NEXUSPREMIUM | **REUTILIZAR** |
| 39 | **SafeGate Extensoes/Caminhos Proibidos** | E:\NIVEL 2 | Proibe .bat .ps1 .sh .cmd .exe .dll; bloqueia System32, vault, API_Vault | Paths hardcoded especificos | **ADAPTAR** |
| 40 | **LLMFactory fallback rule** | E:\Antigravity, E:\NIVEL 3 ANTIGRAVITY | Se sem API key, retornar erro em vez de crashar | Nenhum (boa pratica tecnica) | **REUTILIZAR** |
| 41 | **Blackboard logging pattern** | E:\Antigravity, E:\NIVEL 3 ANTIGRAVITY | Toda atividade de agente logada via log_event() com nome/papel/msg/timestamp | Nenhum | **REUTILIZAR** |
| 42 | **ECOSYSTEM_GOVERNANCE_MASTER (Isolamento R1-R8)** | E:\SISTEMA ONE, E:\SISTEMA_ONE | ONE orquestra, ZEUS executa, PHANDORA valida; proibe DB/memoria/raciocinio compartilhado; VERDADE > EGO | Especifica da tri-arquitetura | **ADAPTAR** |
| 43 | **ZERO TRUST + Blocked Keywords (governance_rules.json)** | E:\SISTEMA_ONE, E:\SISTEMA ONE | Decisoes via PolicyEngine + RiskEngine; hard-block: delete database, drop table, wipe, format, destroy | Convergente com rules 4, 36 | **REUTILIZAR** |
| 44 | **MONITOR_CONTRACT / ARCHITECTURE_FREEZE** | E:\SISTEMA ONE, E:\SISTEMA_ONE (04_MONITOR) | Apenas 2 monitores HTML oficiais; arquitetura congelada V1; HTML nao-autorizado dispara alerta via monitor_guard.py | Especifica de UI de monitores | **DESCARTAR** |
| 45 | **AvePro/RULES.md (8 regras)** | E:\Sistema_open_claude\AvePro | Zero Agentes Fantasma, Zero Pacotes Falsos, Tudo em Tres Lugares, RULES+WORKFLOWS+SKILLS+CONTAINER obrigatorios, credenciais nunca no codigo, status honesto, log de tudo, memoria persistente | Convergente com rules 1, 27 | **REUTILIZAR** |

> **Notas de DESCARTE adicionais:** As regras de UI (UI_RULES.md, RESPONSIVE_RULES.md em SISTEMA ONE/04_MONITOR), o POLICY.md/AGENTS.md do OpenClaw mentor (subset de rules ja cobertas), e o `nexus_twin_dna.txt` em sua forma persona-AMYGO sao tratados como subordinados/duplicatas das entradas acima.

---

## 3. DUPLICIDADES DETECTADAS

A linhagem dos sistemas (Antigravity -> ZEUS -> PHANDORA -> SISTEMA ONE -> AGENTE-X / Nexus) gerou forte replicacao das mesmas leis. Principais clusters de duplicidade:

### 3.1 Cluster INTEGRIDADE / ANTI-FANTASMA (a regra mais duplicada do ecossistema)
Mesma lei aparece sob 9+ nomes diferentes:
- ZERO GHOST / LEI MARCIAL ZERO GHOST (Agente X, Sistema_open_claude)
- REGRA_INTEGRIDADE_ABSOLUTA (Agente X, Biblioteca, COMPLEXO_ZEUS, Sistema_open_claude)
- RULE_000_MASTER_RULE + RULE_001_TRUTH_RULE + RULE_002_NO_PHANTOM_PROGRESS + RULE_008_ANTI_HALLUCINATION (PHANDORA, Biblioteca)
- R-07 Verdade Absoluta (NIVEL 1)
- LEI_SUPREMA / REALIDADE_OBRIGATORIA (NIVEL 2)
- VERDADE > EGO (SISTEMA ONE / SISTEMA_ONE)
- Zero Agentes Fantasma / Zero Pacotes Falsos (AvePro)
- Restricao "nunca inventar dados" (AGENTS.md, Agente X)

**=> Consolidar numa unica LEI ZERO GHOST canonica da Fabrica.**

### 3.2 Cluster SAFE GATE (multiplas implementacoes da mesma funcao)
- SAFE_GATE.md + safe_gate.py (Agente X, Biblioteca, COMPLEXO_ZEUS, PHANDORA)
- Safe Gate blacklist shell (NIVEL 1, NIVEL 2)
- SafeGate classificacao de risco LOW/MEDIUM/HIGH/PROIBIDO (NIVEL 2)
- ZERO TRUST PolicyEngine + RiskEngine blocked keywords (SISTEMA ONE / SISTEMA_ONE)
- RULE_003_SAFE_EXECUTION (PHANDORA)
- REGRA_EXECUCAO_SOMENTE_COM_SAFE_GATE.json (PHANDORA)

**=> Unificar num unico Safe Gate com classificacao de risco + blacklist + path guard.**

### 3.3 Cluster E: READ-ONLY
- REGRAS_OFICIAIS_ZEUS_ANTIGRAVITY Regra 1 (varios)
- REGRA_E_DRIVE_SOMENTE_LEITURA.json (PHANDORA)
- Restricoes absolutas AGENTS.md (Agente X)
- SAFE_GATE protecao E: (COMPLEXO_ZEUS)

### 3.4 Cluster TESTAR ANTES DE RELATAR
- REGRAS_OFICIAIS_ZEUS_ANTIGRAVITY Regra 2 (varios)
- REGRA_TESTAR_ANTES_DE_RELATAR.json (PHANDORA)
- RULE_002_NO_PHANTOM_PROGRESS (PHANDORA)
- Ciclo CREATE>TEST>VALIDATE>SAVE (Agente X)

### 3.5 Cluster AUTORIZACAO/ORDEM DO DIRETOR
- autorizacao_maxima.md + autorizacao_diretor.md + ordem_diretor.md (Agente X, COMPLEXO_ZEUS, Sistema_open_claude)
- RULE_009_DIRECTOR_PRIORITY (PHANDORA)

### 3.6 Cluster CREDENCIAIS/COFRE
- RULE_011_SECURITY_RULE (PHANDORA)
- REGRA_CREDENCIAIS_APENAS_COFRE.json (PHANDORA)
- Credenciais nunca no codigo (AvePro)
- "Credenciais apenas do COFRE" (ZEUS Regra 1)

### 3.7 Duplicidade de SISTEMA inteiro
- **SISTEMA ONE (com espaco)** vs **SISTEMA_ONE (underscore)** — mesmas regras de isolamento R1-R8 e ZERO TRUST. SISTEMA_ONE (8.5/10) e a versao implementada; SISTEMA ONE (8/10) e a camada de documentacao/monitor. Rastro de refatoracao incompleta.
- **Antigravity** vs **NIVEL 3 ANTIGRAVITY** — copias quase identicas do mesmo runtime (nexus_twin_dna.txt, ARCHITECT_BLUEPRINTS.md duplicados). NIVEL 3 contem 3 copias internas adicionais (AMYGO_Sovereign, Antigravity_Sovereign, Nexus_Core).

---

## 4. RULES SUPERIORES (que prevalecem)

Hierarquia de prevalencia recomendada para a Fabrica de Sistemas, da mais alta para a mais baixa:

| Nivel | Rule Superior | Justificativa | Fonte canonica recomendada |
|---|---|---|---|
| **L0 — SUPREMA** | **ZERO GHOST LAW / INTEGRIDADE ABSOLUTA** | Declarada explicitamente como "regra suprema" e "prioridade maxima" em TODOS os sistemas maduros (score 8-9). Severity CRITICAL. Prevalece sobre automacoes, workflows, agentes e prompts. | Agente X SOUL.md + PHANDORA RULE_000 |
| **L1 — SEGURANCA** | **SAFE_GATE (com classificacao de risco)** | Toda execucao passa obrigatoriamente pelo gate; bloqueio nao-substituivel (hard block) de comandos destrutivos. | NEXUSPREMIUM SafeGate + SISTEMA_ONE ZERO TRUST |
| **L1 — PROTECAO DADOS** | **E: READ-ONLY + CREDENCIAIS NO COFRE** | Protege a fonte legada e segredos. Diretamente alinhada a esta propria missao (ZERO GHOST LAW ativa). | REGRA_E_DRIVE_SOMENTE_LEITURA + RULE_011 |
| **L2 — QUALIDADE** | **TESTAR ANTES DE RELATAR / NO PHANTOM PROGRESS** | Garante que resultados sejam reais antes de qualquer report. | ZEUS Regra 2 + PHANDORA RULE_002 |
| **L2 — AUDITABILIDADE** | **RULE_013_AUDIT_RULE + LOG_TOTAL** | Toda missao gera auditoria com evidencia fisica. | PHANDORA RULE_013 + NEXUSPREMIUM LOG_TOTAL |
| **L3 — AUTORIDADE** | **DIRECTOR_PRIORITY / AUTORIZACAO_MAXIMA** | Resolve conflitos: ordem do Diretor prevalece sobre demais agentes (mas NUNCA sobre L0/L1). | PHANDORA RULE_009 |

> **Regra de resolucao de conflito:** Em caso de colisao, prevalece o nivel mais alto. Nenhuma autorizacao do Diretor (L3) pode sobrepor a Lei Zero Ghost (L0) ou o Safe Gate destrutivo (L1) — este e o principio "hard block, no override" herdado do governance_rules.json do SISTEMA_ONE.

---

## 5. RECOMENDACOES

1. **Adotar a LEI ZERO GHOST como Constituicao unica da Fabrica.** Consolidar os 9+ nomes do cluster 3.1 num unico documento `00_GOVERNANCE/ZERO_GHOST_LAW.md`, eliminando a fragmentacao. Severity CRITICAL, prioridade L0.

2. **Unificar o Safe Gate.** Combinar o melhor de cada implementacao: classificacao de risco LOW/MEDIUM/HIGH/PROIBIDO (NEXUSPREMIUM) + blacklist de comandos shell (NIVEL 1) + blocked keywords hard-block sem override (SISTEMA_ONE) + path guard E: read-only. Implementar como modulo unico reutilizavel.

3. **Adotar o template de RULE do PHANDORA.** O padrao `RULE_XXX_NOME.md` com 10 secoes (Objetivo, Quando Aplicar, Condicoes de Bloqueio, Exemplo Correto/Incorreto, Criterio de Validacao, Logs, Dependencias, Severity Level, Auto-checklist) e o formato de regra de mais alta qualidade encontrado. Usar como padrao da Fabrica.

4. **Desacoplar regras de identidade/Diretor.** Rules 6, 7, 9, 12, 25 estao acopladas a "Luiz/Diretor" e a personas (AMYGO). Adaptar para parametros configuraveis (role de autoridade) em vez de hardcode.

5. **Parametrizar Budget Guard.** Os limites divergem (BRL 5/dia, USD 5/dia, USD 150/mes, $1/dia). Definir um unico modelo de budget configuravel por ambiente, em moeda unica.

6. **Descartar regras cosmeticas e tutoriais.** AUTO_PREVIEW_RELATORIOS, ORDEM_DIRETOR (redundante), ESTUDO_IA.md (guia tutorial com path hardcoded), R-03 Visual/Aura Turbo 3D e MONITOR_CONTRACT/ARCHITECTURE_FREEZE (especificos de UI legada) nao agregam valor de governanca a Fabrica.

7. **ALERTA DE SEGURANCA (fora de escopo mas critico):** Multiplos sistemas (Antigravity, NIVEL 3 ANTIGRAVITY, Sistema_open_claude, LDCODE) contem **credenciais reais expostas em texto plano** (.env e tokens hardcoded). A propria existencia da RULE_011 / REGRA_CREDENCIAIS_APENAS_COFRE evidencia que a regra existia mas NAO foi cumprida nos legados. Ao reaproveitar, NUNCA importar arquivos .env de E:\; todas as chaves devem ser consideradas comprometidas e rotacionadas.

8. **Resolver duplicidade SISTEMA ONE vs SISTEMA_ONE.** Adotar SISTEMA_ONE (underscore, 8.5/10, implementado e testado) como fonte canonica das regras de isolamento R1-R8 e ZERO TRUST; tratar SISTEMA ONE (espaco) como camada de documentacao legada.

9. **Promover a doutrina de isolamento (R1-R8) como padrao multiagente.** A regra "sem DB compartilhado, sem memoria compartilhada, comunicacao apenas por contratos JSON validados por schema" e um padrao arquitetural solido e reutilizavel para qualquer sistema multiagente da Fabrica.

---

TOTAL_RULES: 45
