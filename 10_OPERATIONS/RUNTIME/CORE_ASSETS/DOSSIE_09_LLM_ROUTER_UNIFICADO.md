# DOSSIÊ TÉCNICO 09 — Router LLM Unificado (ONE Router 5-provider + Multi-LLM cost-aware)

> ZERO GHOST LAW ATIVA — Documento de PLANEJAMENTO. Nenhum código foi copiado, importado ou modificado. Leituras em E:\ feitas apenas para confirmação (somente leitura).

---

## 1. Identificação

| Campo | Valor |
|---|---|
| **ID** | 09 |
| **Nome** | Router LLM Unificado (ONE Router 5-provider + Multi-LLM cost-aware) |
| **Tipo** | Engine Python (fusão de 2 ativos) |
| **Origem A (ONE Router)** | `E:\SISTEMA_ONE\01_CORE\llm_router\` (CONFIRMADO) — módulo modular com 13 arquivos |
| **Origem B (Multi-LLM cost-aware)** | `E:\Agente X\01_CORE\orchestrator\llm_router.py` (CONFIRMADO) — arquivo único 12.834 bytes |
| **Risco conhecido** | BAIXO |

**Confirmação física (leitura realizada):**
- Origem A — arquivos reais confirmados: `llm_router.py` (13.435 B), `task_classifier.py`, `complexity_engine.py`, `privacy_engine.py`, `routing_policy.py`, `fallback_engine.py`, `llm_governance.py`, `provider_registry.py`, `provider_health.py`, `benchmark_engine.py`, `system_one_benchmark.py`, mais JSONs de baseline (`llm_benchmark.json`, `llm_health.json`).
- Origem B — confirmada em `E:\Agente X\01_CORE\orchestrator\llm_router.py` (mais cópias em `03_BASELINES` e `13_BACKUPS_DIARIOS`, ignoradas).

---

## 2. Finalidade

Roteador soberano de inferência LLM que decide, para cada prompt, **qual provider/modelo executar**, equilibrando qualidade, custo, privacidade e resiliência. A fusão combina as duas melhores metades confirmadas no código:

**Da Origem A (ONE Router) — pipeline de governança em 6 camadas (`route_and_execute`):**
1. **TaskClassifier** — classificação híbrida (keywords + semântica + estrutura + risco). Confirmado: `ALLOWED_TYPES` com **14 tipos** (`GENERAL_CHAT, FAST_SUMMARY, CLASSIFICATION, ARCHITECTURE, CODING, FORENSIC, PRIVACY, OFFLINE, DEBUGGING, MISSION_EXECUTION, GOVERNANCE, MEMORY, MONITORING, SYNC`).
2. **ComplexityEngine** — score + tier de complexidade.
3. **PrivacyEngine** — detecção de dados sensíveis e `force_local`.
4. **RoutingPolicy** — escolha do provider preferido por tipo/privacidade.
5. **Health Check + FallbackEngine** — loop de seleção com fallback automático (cache de saúde; Ollama como salvaguarda final).
6. **Evidence Logging** — histórico em `llm_routing_history.json` com `evidence_id`.

**Da Origem B (Multi-LLM cost-aware) — cascata econômica e resiliência (`route`):**
- Cascata de prioridade confirmada: **Ollama (local/custo zero) > DeepSeek > Claude > OpenAI > Gemini**, sem fallback simulado (Zero Ghost: falha com `RuntimeError` real).
- **FinanceEngine** — circuit breaker financeiro (`finance_preflight` antes de chamadas pagas; `record_usage` para contabilizar tokens).
- **AntiLoopGuard + TraceContext** — preflight contra recursão/rajadas.
- `status()` / `test_connection()` para diagnóstico.

**Por que importa para a Fábrica:** é a porta única e auditável de toda inferência LLM dos agentes. Centraliza classificação superior (98/100 forense citado), economia (cascata cost-aware + breaker financeiro), privacidade (roteamento local forçado) e resiliência (fallback multi-camada) num só ativo.

---

## 3. Dependências

### Bibliotecas Python (CONFIRMADO no código)
- **Origem A:** `os`, `time`, `json`, `re`, `urllib.request`, `python-dotenv`; SDKs importados dinamicamente: `openai` (usado p/ DeepSeek e OpenAI), `anthropic` (Claude), `google.genai` (Gemini). Ollama via HTTP puro (`urllib`).
- **Origem B:** `os`, `json`, `time`, `logging`, `pathlib`, `typing`, `python-dotenv`, **`requests`** (HTTP de todos os providers). SDKs nativos NÃO usados — chamadas REST diretas.

### Outros ativos críticos da Fábrica (acoplamento interno)
- **Origem A (módulo completo):** depende dos 12 submódulos irmãos em `llm_router/` (classifier, complexity, privacy, policy, fallback, governance, registry, health). Importação via package relativo (`from .module`) com fallback flat.
- **Origem B (acoplamento externo via `sys.path.insert`):**
  - `finance_engine.py` em `E:\Agente X\01_CORE\finance\` — **CONFIRMADO existente**.
  - `anti_loop_guard.py`, `trace_context.py` em `E:\Agente X\01_CORE\validation\` — **CONFIRMADO existente** (também há `hallucination_guard.py`).
  - `task_classifier.py` (versão própria da Origem B) — import flat; a confirmar se é idêntico ao da Origem A (provável divergência — a confirmar na extração).

### Runtime / Serviços externos
- **Ollama local** — Origem A default `http://127.0.0.1:11434` (`/api/generate`); Origem B `http://localhost:11434` (`/api/chat`, e `/api/tags` p/ healthcheck). Modelo default Origem B: `llama3`. (Divergência de endpoint/endpoint-de-API a unificar.)
- **APIs pagas:** DeepSeek (`api.deepseek.com`), Anthropic Claude (`api.anthropic.com`), OpenAI (`api.openai.com`), Google Gemini (`generativelanguage.googleapis.com`).
- **Credenciais (env):** `DEEPSEEK_API_KEY`, `CLAUDE_API_KEY`/`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `OLLAMA_HOST`/`OLLAMA_MODEL`.
- **Bancos de dados:** nenhum. Persistência em arquivos JSON (history, benchmark, health) + log em texto.

---

## 4. Riscos

| Categoria | Achado (CONFIRMADO no código) | Severidade |
|---|---|---|
| **Path hardcoded** | Origem A: `load_dotenv(r"D:\BIBLIOTECA_COMPLEXO_ZEUS\91_CONFIGS\.env")` — caminho absoluto cravado, alheio à Fábrica. **Deve ser parametrizado.** | MÉDIO |
| **Path hardcoded** | Origem B: log fixo em `_ROOT/"09_LOGS"/"llm_router.log"` e `load_dotenv(_ROOT/".env")` derivado da estrutura do Agente X. | MÉDIO |
| **Acoplamento frágil** | Origem B usa `sys.path.insert` para achar `finance/` e `validation/` por caminho relativo — quebra fora da árvore original do Agente X. | MÉDIO |
| **Credenciais** | Lidas via env (correto). Origem B valida placeholder `SK-PLACEHOLDER` e tamanho mínimo de chave (bom). Nenhuma chave hardcoded encontrada. | BAIXO |
| **Dados pessoais** | PrivacyEngine inspeciona prompts; modo compacto local suprime trechos para privacidade. Sem PII gravada em claro além dos prompts no history JSON — **history pode conter prompts sensíveis**. | MÉDIO |
| **Mocks/simulação** | NENHUM. Ambos seguem Zero Ghost (falha real, sem resposta fake). | NULO |
| **Divergência de fusão** | Dois `task_classifier.py` distintos; dois endpoints Ollama (`/api/generate` vs `/api/chat`); duas assinaturas de entrada (`route_and_execute` vs `route`). Risco de conflito na fusão. | MÉDIO |
| **Robustez de I/O** | `_write_log` (Origem A) reescreve JSON inteiro sem lock — possível corrupção sob concorrência. | BAIXO |

Risco global: **BAIXO** (sem segredos vazados, sem mocks; riscos são de portabilidade/parametrização, plenamente resolvíveis na extração).

---

## 5. Compatibilidade com a Fábrica

| Pasta da Fábrica | Encaixe |
|---|---|
| **17_RUNTIME** | Destino natural do engine em execução (runtime de inferência) e dos artefatos JSON (history/health/benchmark). |
| **05_AGENTS** | Consumidores: todos os agentes chamam o router via entrypoint padronizado (`route_llm_request(payload)` da Origem A é o contrato ideal). |
| **02_WORKFLOWS** | Workflows invocam o router para etapas cognitivas; classificação de task alimenta decisões de orquestração. |
| **00_GOVERNANCA** | `LLMGovernance` (timeouts dinâmicos por task) e `RoutingPolicy` pertencem à governança; políticas de custo/privacidade devem viver aqui como config. |
| **03_SKILLS** | Skills que precisam de LLM consomem o mesmo router (ponto único). |
| **16_SISTEMAS** | Onde o ativo fundido será catalogado como sistema "Router LLM Unificado". |

**O que precisa ser adaptado:**
1. Remover os dois `.env` hardcoded → carregar via config central da Fábrica.
2. Substituir `sys.path.insert` por imports de pacote/registro de dependências da Fábrica.
3. Unificar endpoint Ollama, contrato de entrada e o `task_classifier` duplicado.
4. Mover políticas (cost map, fallback chain, timeouts, privacy) para `00_GOVERNANCA` como arquivos de configuração.
5. Padronizar caminhos de log/history para a estrutura da Fábrica (relativos à raiz da Fábrica, não do Agente X).

---

## 6. Classificação

**ADAPTAR** — ativo de alto valor e sem mocks/segredos, porém com paths hardcoded e acoplamentos por `sys.path` que exigem parametrização e fusão controlada antes de importar.

---

## 7. Plano de Extração (sem código)

1. **Inventário de fusão:** mapear os 13 módulos da Origem A + as 3 dependências da Origem B (`finance_engine`, `anti_loop_guard`, `trace_context`) e decidir quais entram (a Origem A é o esqueleto; Origem B contribui FinanceEngine, AntiLoopGuard e cascata cost-aware).
2. **Sanitização de paths:** eliminar `D:\BIBLIOTECA_COMPLEXO_ZEUS\...`, `_ROOT/09_LOGS`, `localhost`/`127.0.0.1` literais → tudo via config injetada.
3. **Parametrização de config:** externalizar para `00_GOVERNANCA` — cascata de providers, cost map (`_TASK_MODEL_MAP`), timeouts por task (LLMGovernance), regras de privacidade, limites do circuit breaker financeiro.
4. **Resolução de credenciais:** padronizar nomes de env (unificar `CLAUDE_API_KEY` vs `ANTHROPIC_API_KEY`), garantir validação de placeholder, nunca persistir chaves.
5. **Unificação de contrato:** definir um único entrypoint (base no `route_llm_request(payload)`) e um único endpoint/API Ollama; reconciliar os dois `task_classifier`.
6. **Privacidade do history:** decidir mascaramento/retención de prompts sensíveis no `llm_routing_history.json`; tornar a escrita concorrente-segura (lock).
7. **Testes:** suíte com providers mockados (sem chamadas reais) cobrindo: classificação 14 tipos, fallback offline→Ollama, bloqueio do FinanceEngine, bloqueio do AntiLoopGuard, force_local por privacidade, exaustão de cascata (RuntimeError real).
8. **Validação Zero Ghost:** confirmar que nenhum caminho retorna resposta simulada; toda falha propaga erro real.
9. **Gravação controlada:** somente após aprovação, importar o código fundido sob o destino oficial — fora desta missão de planejamento.

---

## 8. Status do Dossiê

**DOSSIÊ COMPLETO — código NÃO importado (Zero Ghost Law)**
