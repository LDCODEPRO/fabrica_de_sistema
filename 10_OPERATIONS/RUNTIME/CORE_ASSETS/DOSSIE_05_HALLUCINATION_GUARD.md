# DOSSIÊ TÉCNICO 05 — HallucinationGuard (anti-alucinação, FAIL CLOSED)

> ZERO GHOST LAW ATIVA — Missão APENAS de planejamento. Código NÃO importado.
> Fonte lida em modo somente-leitura. Nenhum detalhe técnico inventado.
> Data: 2026-06-04

---

## 1. Identificação

| Campo  | Valor |
|--------|-------|
| **ID** | 05 |
| **Nome** | HallucinationGuard (anti-alucinação, FAIL CLOSED) |
| **Tipo** | Engine Python (classe pura, sem estado persistente) |
| **Origem (caminho real confirmado em E:\)** | `E:\Agente X\01_CORE\validation\hallucination_guard.py` |
| **Cópias/baselines confirmadas** | `E:\Agente X\03_BASELINES\AGENT_X_FASE4_CERTIFIED_BASELINE_V1\01_CORE\validation\hallucination_guard.py` e backups diários em `E:\Agente X\13_BACKUPS_DIARIOS\backup_2026-05-2X\...` (5 cópias idênticas confirmadas) |
| **Linhagem documentada (cabeçalho do arquivo)** | "Portado do PHANDORA — Fase 2 Hallucination Guard Soberano." (PHANDORA é a origem ancestral; o artefato real e em uso vive em E:\Agente X) |
| **Evidência de teste real** | `E:\Agente X\08_AUDITS\HALLUCINATION_GUARD_RUNTIME.md` — veredicto "Multinível Fail Closed confirmado. Nenhuma exceção 'except pass' na blindagem." |

---

## 2. Finalidade

Materialização técnica da **Zero Ghost Law**. É a barreira em tempo real que valida a fidelidade da resposta do LLM ao **contexto realmente observado**, antes da entrega ao usuário/missão.

O que faz (confirmado no código):
- **`extract_claims`** — fragmenta a resposta em sentenças (split por `.!?\n`, descartando trechos < 10 chars).
- **`check_claims`** — para cada claim, extrai palavras-chave (≥ 4 chars) e calcula um `match_ratio` por sobreposição morfológica (substring bidirecional) com as palavras do contexto. Detecta também **contradições** comparando presença de negações (`nao, nunca, jamais, fail, erro, impediu, bloqueado, negado`) entre claim e contexto.
- **`risk_score`** — proporção de claims não suportados; contradição força risco ≥ 0.7; resposta sem claims validáveis → risco 1.0.
- **Classificação multinível:** `SAFE` → `WARNING` (>0.1) → `RESTRICTED_MODE` (>0.4) → `SAFE_MODE_ACTIVATED` (>0.8).
- **`guard`** — fachada pública que delega para `check_claims`.

**Comportamento FAIL CLOSED (confirmado):** em `E:\Agente X\01_CORE\orchestrator\react_engine.py` (linhas 188-194), quando o status é `SAFE_MODE_ACTIVATED` o engine **retorna missão bloqueada** (`"[SAFE_MODE] Missão bloqueada por Hallucination Guard. Requer liberação humana."`) e emite alerta `HALLUCINATION_GUARD_FAILURE / ACTION REQUIRED: HUMAN REVIEW`. Nega por padrão; não há `except: pass` na blindagem.

**Por que importa para a Fábrica:** é o único guard *real e conectado* (diferente dos guards mock de PHANDORA que o OPERATIONAL_MAP admite desconectados). É o que transforma a Zero Ghost Law de política em mecanismo executável.

---

## 3. Dependências

| Dependência | Detalhe | Status |
|-------------|---------|--------|
| **Stdlib `re`** | Única biblioteca importada no arquivo. Sem dependências externas / pip. | **Confirmado** |
| **Runtime Python** | Bytecode confirmado para CPython **3.10 e 3.11** (`__pycache__` com `.cpython-310.pyc` e `.cpython-311.pyc`). | **Confirmado** |
| **Consumidor: `react_engine.py`** | `E:\Agente X\01_CORE\orchestrator\react_engine.py` importa `from hallucination_guard import HallucinationGuard`, instancia singleton `_HGUARD` e chama `_HGUARD.guard(llm_response, ctx_text)` no loop ReAct. Acoplamento por **import flat** (mesmo dir no path). | **Confirmado** |
| **Teste de runtime** | `E:\Agente X\01_TESTS\runtime\hallucination_runtime_test.py` | **Confirmado (existe; conteúdo não auditado em detalhe)** |
| **LLM / provedor** | O guard NÃO chama LLM. Ele apenas inspeciona texto já gerado + contexto. Provedor LLM é responsabilidade do `react_engine`. | **Confirmado (sem dependência de LLM no guard)** |
| **Banco de dados / serviços externos** | Nenhum. Classe pura sem I/O, sem rede, sem disco. | **Confirmado** |
| **Credenciais / API keys** | Nenhuma no arquivo. | **Confirmado** |

---

## 4. Riscos

| Categoria | Avaliação |
|-----------|-----------|
| **Segurança / credenciais** | Nenhum segredo, key ou token no arquivo. Sem I/O de rede/disco. Risco de exfiltração: nulo. |
| **Paths hardcoded** | Nenhum path absoluto no guard. **Porém** o `react_engine` importa por nome flat (`from hallucination_guard import ...`), dependendo do diretório estar no `sys.path` — frágil fora da estrutura original. (a confirmar como será resolvido na Fábrica) |
| **Mocks** | O guard em si **não é mock** (confirmado pela auditoria de runtime). Os guards mock são os de PHANDORA, não este. |
| **Dados pessoais (LGPD)** | Não persiste nem loga conteúdo bruto da resposta; expõe apenas métricas (`risk_score`, contagens) e trechos truncados (`claim[:80/100]`) em estruturas de retorno. Logs do consumidor podem conter trechos — revisar política de log do `react_engine`. |
| **Cobertura semântica (risco principal — BAIXO)** | A validação é **morfológica/substring**, não semântica real (sem embeddings/NLP). Substring bidirecional (`kw in cw or cw in kw`) pode gerar **falsos positivos** (palavras curtas casando por coincidência) e **falsos negativos** (sinônimos, paráfrases). Negações em PT sem acento (`nao`) — sensível a acentuação do input. **Validar cobertura semântica antes de elevar criticidade.** |
| **Acoplamento** | Baixo. Classe autocontida; acoplamento real só no ponto de chamada do `react_engine`. |
| **Idioma** | Lista de negações é PT-BR fixa; comportamento degrada para outros idiomas. (a confirmar se há necessidade multilíngue na Fábrica) |

**Risco geral: BAIXO.** Ressalva única e dominante: cobertura semântica limitada por design (match morfológico).

---

## 5. Compatibilidade com a Fábrica

Estrutura de destino confirmada em `D:\FABRICA_DE_SISTEMAS\`.

| Camada da Fábrica | Encaixe |
|-------------------|---------|
| **00_GOVERNANCA / 01_RULES** | É a **implementação executável da Zero Ghost Law**. Deve ser referenciado como controle obrigatório da governança. |
| **17_RUNTIME** | Destino natural do engine em si (runtime ativo). Dossiê já reside em `17_RUNTIME\CORE_ASSETS\`. |
| **05_AGENTS / 07_AGENTES** | Consumido por agentes no ponto pós-geração de resposta (equivalente ao `react_engine`). Precisa de adaptador de integração. |
| **02_WORKFLOWS** | Pode ser etapa de gate em workflows (bloqueio antes de entrega). |
| **03_SKILLS** | Não é skill; é guard transversal. Não encaixa aqui. |
| **16_SISTEMAS** | Aplicável como dependência de qualquer sistema gerado que use LLM. |
| **10_QA / 12_TESTES** | Migrar o teste de runtime para cá; ampliar cobertura. |

**O que precisa ser adaptado:**
1. Substituir o **import flat** por import de pacote estável (ex.: módulo dentro de um pacote de runtime da Fábrica).
2. Parametrizar listas hoje fixas (negações, thresholds 0.1/0.4/0.8, limites de chars) via config — sem hardcode.
3. Normalização de acentos/idioma para reduzir falsos negativos.
4. Definir política de log alinhada à LGPD no ponto de consumo.

---

## 6. Classificação

**ADAPTAR** — engine real, fail-closed e sem segredos/dependências externas; precisa apenas de parametrização (thresholds/negações), import de pacote e reforço de cobertura semântica antes de entrar em produção na Fábrica.

---

## 7. Plano de Extração (sem código)

1. **Confirmar baseline única:** comparar `01_CORE\validation\hallucination_guard.py` com a cópia em `03_BASELINES\...FASE4...` e os 5 backups diários; eleger a versão certificada como fonte de verdade. (a confirmar diffs)
2. **Sanitização:** confirmar ausência de segredos/paths (já confirmado: apenas `import re`); remover artefatos `__pycache__`.
3. **Parametrização:** externalizar para config — lista de negações, thresholds de risco (0.1/0.4/0.8), tamanhos mínimos de claim/keyword.
4. **Empacotamento:** reescrever o ponto de import (eliminar import flat) para módulo de pacote sob o runtime da Fábrica.
5. **Normalização linguística:** adicionar des-acentuação e revisar match morfológico para mitigar falsos positivos/negativos (avaliar upgrade futuro para validação semântica por embeddings — backlog).
6. **Testes:** migrar e ampliar `hallucination_runtime_test.py` para `12_TESTES`/`10_QA`, cobrindo os 4 níveis (SAFE/WARNING/RESTRICTED/SAFE_MODE), contradição, NO_CONTEXT e casos de fronteira dos thresholds.
7. **Integração:** definir o ponto de gate equivalente ao `react_engine` nos agentes da Fábrica, preservando o comportamento FAIL CLOSED (bloqueio + human review).
8. **Certificação:** registrar evidência de runtime em `13_CERTIFICACOES`/`11_AUDITORIA` antes de marcar como ativo de produção.

---

## 8. Status do Dossiê

**DOSSIÊ COMPLETO — código NÃO importado (Zero Ghost Law)**
