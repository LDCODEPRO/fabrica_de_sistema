# DOSSIÊ TÉCNICO 03 — Governance / Risk Engine

> ZERO GHOST LAW — Documento de planejamento. Nenhum código foi copiado, importado ou modificado. Leitura somente-leitura de E:\ realizada para confirmação factual.

---

## 1. Identificação

| Campo  | Valor |
|--------|-------|
| **ID** | 03 |
| **Nome** | Governance / Risk Engine (4 níveis de risco + keyword block) |
| **Tipo** | Engine Python (orquestrador de governança modular) |
| **Origem (caminho real confirmado em E:\)** | `E:\SISTEMA_ONE\01_CORE\governance\governance_engine.py` (2.479 bytes, LastWrite 15/05/2026) |
| **Cópias adicionais detectadas** | `E:\Biblioteca\SISTEMA_ONE\01_CORE\governance\`; `E:\Sistema_open_claude\Biblioteca\SISTEMA_ONE\01_CORE\governance\`. Há também uma variante distinta em `...\ZEUS_COMMAND_CENTER\core\governance_engine.py` (3.468 bytes) — **conteúdo diferente, a confirmar separadamente; NÃO é a mesma classe.** |

**Confirmação de existência:** CONFIRMADO. Ambos `E:\SISTEMA_ONE` e `E:\SISTEMA ONE` existem; o ativo canônico está em `E:\SISTEMA_ONE\01_CORE\governance\`.

---

## 2. Finalidade

`GovernanceEngine.evaluate(director_input, mission_id)` é um **gate de governança** que, para cada entrada do diretor/missão:

1. **Policy gate (bloqueio duro):** via `PolicyEngine`, verifica `blocked_keywords`. Se houver match, retorna imediatamente `allowed=False`, `risk="CRITICAL"`, `reason="blocked_keyword"`. Keywords destrutivas confirmadas no config: `delete database`, `drop database`, `wipe`, `format`, `destroy`.
2. **Risk gate (4 níveis):** via `RiskEngine.calculate_risk`, classifica em **CRITICAL → HIGH → MEDIUM → LOW** por ordem de prioridade de match de keywords. Default = `LOW`.
3. **Validation gate:** via `ValidationGate`, se risco for `HIGH` ou `CRITICAL`, exige validação por um validador nomeado `"PHANDORA"`.
4. **Registro forense:** via `GovernanceRegistry`, persiste cada avaliação na tabela SQLite `governance_history` e em log de arquivo `governance.log`.

**Por que importa para a Fábrica:** fornece um ponto único de decisão "permitir / classificar risco / exigir validação humana" que pode atuar como o **gate de governança padrão de 00_GOVERNANCA**, interceptando inputs antes da execução de workflows/agents. As "86 entradas de auditoria forense" citadas na auditoria correspondem ao histórico acumulado no SQLite (`governance_history`) — **número exato a confirmar via contagem na DB, não verificado nesta leitura.**

---

## 3. Dependências

**Bibliotecas (stdlib apenas — confirmado nos imports):**
- `datetime`, `os`, `logging`, `json`, `sqlite3`. Nenhuma dependência de terceiros (pip) detectada. Runtime: Python 3.x.

**Módulos internos co-dependentes (confirmados no mesmo diretório):**
- `policy_engine.py` (`PolicyEngine`) — 566 B
- `risk_engine.py` (`RiskEngine`) — 1.157 B
- `validation_gate.py` (`ValidationGate`) — 256 B
- `governance_registry.py` (`GovernanceRegistry`) — 1.571 B

> Importação por **imports planos** (`from policy_engine import PolicyEngine`) — exigem estar no mesmo `sys.path`; não é package com `__init__.py` (a confirmar).

**Artefatos de dados / config (paths hardcoded, confirmados):**
- Config: `E:\SISTEMA_ONE\03_CONFIG\governance_rules.json` (existe — keywords confirmadas)
- Banco: `E:\SISTEMA_ONE\02_DATABASE\sistema_one.db` (SQLite, existe)
- Log: `E:\SISTEMA_ONE\08_LOGS\governance.log`

**Serviços externos:** Nenhum LLM, API externa ou serviço de rede. **Não há chamadas a LLM nem a bancos remotos** — apenas SQLite local. O validador `"PHANDORA"` é apenas uma string/rótulo no fluxo; **não há integração de código com um sistema PHANDORA neste ativo** (acoplamento conceitual apenas — a confirmar onde PHANDORA é consumido).

---

## 4. Riscos

- **Paths hardcoded absolutos (ALTO impacto de portabilidade):** `config_path`, `db_path`, `log_path` fixos em `E:\SISTEMA_ONE\...` dentro do `__init__`. Bloqueia execução fora daquela máquina/drive. **Bloqueador principal para importação direta.**
- **Credenciais:** NÃO encontradas no código nem no config. Sem secrets hardcoded, sem API keys. (Risco baixo — confirmado.)
- **Dados pessoais:** `director_input` (texto livre da missão) é persistido integralmente em SQLite e em log. Pode conter dados sensíveis dependendo do uso. Risco de retenção a tratar (LGPD) — **a confirmar conteúdo real da DB.**
- **Acoplamento:** alto entre os 5 módulos via imports planos; rótulo `PHANDORA` fixo no `validation_gate.py` e no config (`mandatory_validation`). Acoplamento a um validador específico.
- **Mocks / falhas silenciosas:** `GovernanceRegistry.save` engole TODA exceção (`except Exception: pass`) — falha de persistência é silenciosa. Risco de perda de auditoria sem alerta. Não é mock, mas é "failsafe" cego.
- **Detecção de keyword por substring** (`kw in text_lower`): sujeita a falsos positivos (ex.: "core" casa em "encore", "scoreboard"). Risco de classificação imprecisa.
- **Segurança lógica:** bloqueio é puramente baseado em lista de palavras; não cobre variações/obfuscação. Defesa rasa.

**Risco global:** BAIXO (confirmado) — stdlib pura, sem secrets, sem rede; os riscos são de portabilidade e robustez, não de segurança ofensiva.

---

## 5. Compatibilidade com a Fábrica

| Estrutura da Fábrica | Encaixe |
|----------------------|---------|
| **00_GOVERNANCA** | Encaixe natural e primário. O engine vira o gate central de governança/risk classification da Fábrica. |
| **02_WORKFLOWS** | Pré-hook de workflows: `evaluate()` chamado antes de iniciar execução; `allowed=False` aborta. |
| **03_SKILLS** | Pode ser exposto como skill `governance-gate` invocável. |
| **05_AGENTS** | Agents consultam o gate antes de ações de risco HIGH/CRITICAL (exige validação humana). |
| **16_SISTEMAS** | Origem (SISTEMA_ONE) é um sistema externo; engine seria extraído como subsistema. |
| **17_RUNTIME** | DB de auditoria e logs devem viver sob `17_RUNTIME` (parametrizado), não em `E:\`. |

**Adaptações necessárias:**
1. Externalizar todos os paths (config/db/log) para variáveis de ambiente / arquivo de settings da Fábrica.
2. Reempacotar os 5 módulos como package Python (`__init__.py`) com imports relativos.
3. Substituir o `except: pass` por logging de erro real.
4. Parametrizar o nome do validador (`PHANDORA`) ou mapear ao equivalente de 00_GOVERNANCA.
5. Mover `governance_rules.json` para 00_GOVERNANCA como config versionada da Fábrica.

---

## 6. Classificação

**ADAPTAR** — núcleo limpo (stdlib, sem secrets, risco baixo), mas com paths absolutos hardcoded e imports planos que exigem parametrização e reempacotamento antes do uso na Fábrica.

---

## 7. Plano de Extração (sem código)

1. **Snapshot de referência:** registrar hashes/tamanhos dos 5 arquivos + `governance_rules.json` (somente leitura) para rastreabilidade. Não copiar ainda.
2. **Reescrita parametrizada:** reimplementar (ou portar com sanitização) os 5 módulos em um package sob a Fábrica, removendo os 3 paths `E:\` hardcoded e injetando-os por config/ENV.
3. **Reempacotamento:** criar package com `__init__.py` e imports relativos; eliminar dependência de `sys.path` global.
4. **Robustez:** substituir o `except Exception: pass` de `GovernanceRegistry.save` por log de erro e métrica de falha de persistência.
5. **Config para 00_GOVERNANCA:** mover `governance_rules.json` (blocked/critical/high/medium/low keywords + mandatory_validation) para config versionada; revisar lista de keywords para reduzir falsos positivos por substring.
6. **DB/Log para 17_RUNTIME:** apontar SQLite e log para `17_RUNTIME` com criação automática de diretórios já existente no código.
7. **Testes:** unit tests cobrindo (a) bloqueio por `blocked_keyword`, (b) os 4 níveis de risco, (c) gate de validação HIGH/CRITICAL → validator, (d) persistência e leitura do histórico, (e) default LOW sem match.
8. **Privacidade:** definir política de retenção/anonimização de `director_input` antes de persistir (LGPD).
9. **Validação de auditoria:** confirmar a contagem real de entradas em `governance_history` (citadas como 86) e o consumo real do rótulo PHANDORA antes de assumir integração.

---

## 8. Status do Dossiê

**DOSSIÊ COMPLETO — código NÃO importado (Zero Ghost Law)**
