# DOSSIÊ TÉCNICO — ATIVO 07: ReAct Engine

> ZERO GHOST LAW: este dossiê é APENAS de planejamento. Nenhum código foi importado, copiado ou modificado. Os caminhos de E:\ foram acessados em modo somente-leitura para confirmação de dependências reais.

## 1. Identificação
- **ID:** 07
- **Nome:** ReAct Engine (Thought > Action > Action Input > Observation > Final Answer)
- **Tipo:** Engine Python (motor cognitivo / orquestrador)
- **Origem (caminho real confirmado em E:\):** `E:\Agente X\01_CORE\orchestrator\react_engine.py` (15.161 bytes — confirmado por `Get-ChildItem`)
- **Módulo pai:** `E:\Agente X\01_CORE\orchestrator\` (contém `__init__.py`, `llm_router.py`, `tool_registry.py`, `task_classifier.py`, `learning_loop.py`)

## 2. Finalidade
O ReAct Engine é o coração cognitivo do Agente-X (declarado no docstring real: "O coração cognitivo do agente"). Implementa o ciclo iterativo **Thought → Action → Action Input → Observation**, repetido até produzir uma **Final Answer**. Baseia-se em ReAct (Yao et al., 2022) e, segundo o próprio cabeçalho do arquivo, incorpora inspirações de Hermes Agent (self-improving loop, skill extraction) e Replit Agent 4 (plan-while-build, self-testing).

Por que importa para a Fábrica: é o motor de raciocínio-ação executável que une LLM, memória, ferramentas (tools) e loop de aprendizado num único laço cognitivo controlado, com limites de segurança (`MAX_STEPS = 20`, `MAX_RETRIES = 2`). É o componente que transforma um LLM passivo em um agente autônomo orquestrável — peça central para qualquer automação cognitiva da Fábrica.

## 3. Dependências
Confirmadas por leitura direta dos imports de `react_engine.py`:

**Bibliotecas padrão Python (baixo risco):** `re`, `sys`, `json`, `time`, `logging`, `pathlib.Path`, `typing.Optional`.

**Outros ativos críticos do mesmo projeto (acoplamento interno confirmado):**
- `LLMRouter` ← `01_CORE/orchestrator/llm_router.py` (CONFIRMADO existe, 12.834 bytes) — **risco conhecido do ativo: depende do LLM router**.
- `ToolRegistry` ← `01_CORE/orchestrator/tool_registry.py` (CONFIRMADO existe, 1.677 bytes).
- `ContextManager` ← `02_MEMORY/short_term/context_manager.py` (import confirmado; **arquivo a confirmar** — path injetado via `sys.path`).
- `SkillManager` ← `04_SKILLS/skill_manager.py` (import confirmado; **arquivo a confirmar**).
- `HallucinationGuard` ← `01_CORE/validation/hallucination_guard.py` — **FAIL-CLOSED**: o engine lança `RuntimeError` crítico se não carregar (import confirmado; **arquivo a confirmar**).
- `get_director_context` ← `12_CONFIG/director_profile.py` (opcional, falha silenciosa; **a confirmar**).
- Arquivos de configuração lidos em runtime: `12_CONFIG/SOUL.md`, `AGENTS.md`/`.hermes.md`/`HERMES.md` na raiz (**a confirmar**).

**Runtime / serviços:**
- Python 3.x (uso de `pathlib`, type hints).
- LLM(s): provider concreto **a confirmar** — abstraído atrás de `LLMRouter` (não inspecionado em detalhe nesta auditoria leve).
- Banco de dados / vetor store: **a confirmar** (memória de longo prazo não evidenciada neste arquivo; só `short_term` é referenciada).
- Sistema de arquivos: grava log em `09_LOGS/react_engine.log` (**a confirmar diretório**).

## 4. Riscos
- **Credenciais/segurança:** Nenhum segredo hardcoded encontrado no cabeçalho/imports lidos. Chaves de LLM provavelmente vivem no `LLMRouter` (**a confirmar** — não inspecionado).
- **Paths hardcoded / acoplamento estrutural:** ALTO acoplamento à estrutura de diretórios do Agente-X. O engine injeta caminhos relativos via `sys.path.insert` para `02_MEMORY/short_term`, `04_SKILLS`, `01_CORE/validation`, `12_CONFIG`, e calcula `_ROOT` por `Path(__file__).parent.parent.parent`. Fora dessa árvore exata, os imports quebram.
- **Fail-closed crítico:** se `HallucinationGuard` não carregar, o módulo inteiro levanta `RuntimeError` na importação — bom para segurança, mas torna o engine inutilizável sem esse ativo dependente (que ainda está "a confirmar").
- **Mocks:** nenhum mock evidente no trecho lido.
- **Dados pessoais:** referência a "perfil do Diretor" (`director_profile.py`, `SOUL.md`) pode conter dados de identidade/estilo do operador — **revisar antes de qualquer importação** (potencial PII).
- **Loop runaway:** mitigado por `MAX_STEPS` e `MAX_RETRIES`, mas o custo de LLM por execução não é limitado por orçamento aparente.

## 5. Compatibilidade com a Fábrica
- **05_AGENTS:** encaixe natural — é o motor de raciocínio que sustentaria agentes da Fábrica.
- **03_SKILLS:** depende de um `SkillManager`; precisa mapear o conceito de skill do Agente-X para o diretório `03_SKILLS` da Fábrica (a árvore origem usa `04_SKILLS`).
- **17_RUNTIME:** é onde o engine executaria; logs e estado de execução pertencem aqui.
- **00_GOVERNANCA:** o `HallucinationGuard` (fail-closed) e os limites `MAX_STEPS` são controles que devem ser registrados/auditados pela governança.
- **02_WORKFLOWS:** o ciclo ReAct é, por natureza, um workflow cognitivo orquestrável; integraria como motor de execução de workflows.
- **16_SISTEMAS:** dependências externas (LLM router, memória) seriam catalogadas aqui.

**O que precisa ser adaptado:** remapear toda a topologia de diretórios (`01_CORE`, `02_MEMORY`, `04_SKILLS`, `12_CONFIG`, `09_LOGS` → estrutura da Fábrica), parametrizar `_ROOT` e os `sys.path.insert` por configuração injetável, e desacoplar os imports diretos (`from llm_router import ...`) para imports relativos ou injeção de dependência.

## 6. Classificação
**ADAPTAR** — ativo valioso e de baixo risco intrínseco, mas com forte acoplamento à estrutura/imports do Agente-X que exige parametrização antes de rodar na Fábrica.

## 7. Plano de Extração (sem código)
1. **Confirmar dependências pendentes** (somente leitura): existência real de `context_manager.py`, `skill_manager.py`, `hallucination_guard.py`, `director_profile.py`, `llm_router.py` (conteúdo) e config files (`SOUL.md`, `AGENTS.md`).
2. **Inventariar a cadeia de import completa** — montar o grafo de dependências antes de extrair (evitar importar o engine sem seus ativos críticos).
3. **Sanitização de PII** — revisar `director_profile.py`/`SOUL.md` e remover/parametrizar dados pessoais do Diretor.
4. **Sanitização de segredos** — auditar `llm_router.py` por chaves/tokens; externalizar para variáveis de ambiente/secret store.
5. **Parametrização de paths** — substituir cálculo de `_ROOT` e `sys.path.insert` hardcoded por config injetável compatível com a árvore da Fábrica; tornar destino de log configurável.
6. **Desacoplamento de imports** — converter imports planos em imports relativos de pacote ou injeção de dependência (LLMRouter, ToolRegistry, ContextManager, SkillManager, HallucinationGuard).
7. **Adaptar mapeamento de diretórios** — `04_SKILLS`→`03_SKILLS`, memória, logs, config conforme convenção da Fábrica.
8. **Testes** — criar testes do ciclo ReAct com LLM/tools mockados; validar o fail-closed do HallucinationGuard; validar limites `MAX_STEPS`/`MAX_RETRIES`; teste de fumaça end-to-end isolado.
9. **Registro em governança** — documentar controles (fail-closed, limites) em 00_GOVERNANCA antes de promover a 17_RUNTIME.

## 8. Status do Dossiê
DOSSIÊ COMPLETO — código NÃO importado (Zero Ghost Law)
