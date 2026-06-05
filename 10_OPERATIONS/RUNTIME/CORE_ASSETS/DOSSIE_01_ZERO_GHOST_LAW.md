# DOSSIÊ TÉCNICO 01 — ZERO GHOST LAW / LEI MARCIAL ZERO GHOST

> Gerado sob ZERO GHOST LAW. Missão de PLANEJAMENTO. Nenhum código foi copiado, importado ou modificado de E:\. Arquivos de E:\ foram apenas LIDOS (somente leitura) para confirmar existência real e dependências.

---

## 1. Identificação

- **ID:** 01
- **Nome:** Zero Ghost Law / Lei Marcial Zero Ghost
- **Tipo:** Doutrina / Regra constitucional (princípio-mãe anti-alucinação) + 1 implementação de runtime associada (`HallucinationGuard`)
- **Origem (caminhos reais CONFIRMADOS em E:\):**
  - Doutrina (texto):
    - `E:\Agente X\04_SKILLS\governance\ZERO_GHOST_MARTIAL_LAW.md` — CONFIRMADO
    - `E:\Agente X\00_GOVERNANCE\RULES\REGRA_INTEGRIDADE_ABSOLUTA.md` — CONFIRMADO
    - `E:\Agente X\12_CONFIG\SOUL.md` — CONFIRMADO (contém a lei como prioridade máxima)
  - Cópia espelhada (mesmos 3 arquivos): `E:\Sistema_open_claude\Agente X\...` — CONFIRMADO
  - Implementação de runtime (código real): `E:\Agente X\01_CORE\validation\hallucination_guard.py` — CONFIRMADO
  - Teste de runtime: `E:\Agente X\01_TESTS\runtime\hallucination_runtime_test.py` — CONFIRMADO
  - Evidência/auditoria: `E:\Agente X\08_AUDITS\HALLUCINATION_GUARD_RUNTIME.md` — CONFIRMADO
  - **PHANDORA:** os 3 arquivos nominais (SOUL.md / REGRA_INTEGRIDADE_ABSOLUTA.md / ZERO_GHOST_MARTIAL_LAW.md) **NÃO foram localizados** em `E:\PHANDORA`. Existem apenas memórias relacionadas (`E:\PHANDORA\05_MEMORY\REGRA_REGRA_1_INTEGRIDADE_ABSOLUTA.json` e variantes). O cabeçalho de `hallucination_guard.py` declara "Portado do PHANDORA — Fase 2", mas a origem PHANDORA da doutrina escrita fica **a confirmar**.

---

## 2. Finalidade

Princípio constitucional anti-alucinação do ecossistema (AGENTE-X / COMPLEXO_ZEUS). A lei proíbe criar, citar, registrar, prometer, simular ou declarar a existência de qualquer artefato (arquivo, pasta, banco, função, módulo, API, integração, log, relatório, teste, resultado) que não exista de forma real, verificável e funcional.

Elementos doutrinários confirmados na leitura:
- **Lei Suprema** e **Regra Zero Ghost**: checklist obrigatório de 8 verificações antes de afirmar existência; resposta padrão na ausência de prova: "NÃO VALIDADO AINDA. PRECISO VERIFICAR ANTES DE CONFIRMAR."
- **Fluxo obrigatório de execução:** `CRIAR > TESTAR > VALIDAR > REGISTRAR > SALVAR > REPORTAR`.
- **Safe Gate complementar:** em dúvida, assumir "NÃO VALIDADO", nunca "EXECUTADO COM SUCESSO".
- **Penalidades:** resposta inválida descartada; registro do erro como `VIOLATION_ZERO_GHOST`.
- **Declaração de conformidade** ao fim de cada missão: `CONFORMIDADE ZERO GHOST: [APROVADA / PENDENTE / VIOLAÇÃO DETECTADA]`.

**Por que importa para a Fábrica:** é a única doutrina que aparece tanto como regra escrita quanto **codificada** (módulo `HallucinationGuard`), servindo de fundamento de confiabilidade para todo workflow, agente e relatório. É a regra-mãe sobre a qual a governança da Fábrica deve se apoiar.

---

## 3. Dependências

- **Doutrina (.md):** sem dependências técnicas — texto puro Markdown. Aplicável a qualquer runtime.
- **Implementação `hallucination_guard.py` (CONFIRMADO por leitura):**
  - Runtime: **Python** — bytecode presente para **CPython 3.10 e 3.11** (`__pycache__/*.cpython-310.pyc`, `*.cpython-311.pyc`). CONFIRMADO.
  - Biblioteca: apenas `re` (regex, biblioteca padrão). **Zero dependências externas.** CONFIRMADO.
  - Não usa LLM, banco de dados, rede ou arquivos — é função pura sobre `(response, context)`. CONFIRMADO.
- **Acoplamento a outros ativos críticos:**
  - O docstring afirma ser chamado "após cada resposta do LLM no `react_engine` antes de entregar ao usuário" → existe acoplamento esperado a um `react_engine` — **a confirmar** (não inspecionado nesta missão).
  - Penalidade `VIOLATION_ZERO_GHOST` pressupõe um **banco/log de violações** para registro — **a confirmar** (não verificado).
- **Serviços (LLMs, bancos):** o guard em si não chama nenhum; a integração ao pipeline LLM e ao banco de log é **a confirmar**.

---

## 4. Riscos

- **Segurança / credenciais:** NENHUMA credencial, chave ou segredo nos arquivos lidos. Baixo risco.
- **Dados pessoais:** `SOUL.md` contém o nome do Diretor ("Luiz Cipolari"). Dado pessoal leve a sanitizar/parametrizar antes de importar.
- **Paths hardcoded:** não há paths no `hallucination_guard.py`. A doutrina referencia "COMPLEXO_ZEUS" e "AGENTE-X" como nomes próprios do sistema de origem — precisam ser neutralizados/renomeados para a Fábrica.
- **Mocks / simulação:** nenhum mock. (Ironia coerente: o ativo anti-fantasma não contém fantasmas.)
- **Risco funcional (atenção):** a premissa "FAIL CLOSED" do briefing é **parcialmente imprecisa**. O `HallucinationGuard` lido **não lança exceção nem bloqueia** a resposta — ele apenas **retorna um dict de status/risk_score** (`SAFE` / `WARNING` / `RESTRICTED_MODE` / `SAFE_MODE_ACTIVATED`). O comportamento "fail closed" depende de quem consome o retorno (o `react_engine`, a confirmar). A detecção é heurística (match morfológico de keywords por substring + checagem de negações), sujeita a falsos positivos/negativos.
- **Acoplamento:** baixo no código; conceitual alto — a doutrina se propõe a sobrepor automações, workflows, agentes e prompts.
- **Risco global conhecido:** BAIXO (é princípio + função pura sem efeitos colaterais).

---

## 5. Compatibilidade com a Fábrica

Estrutura atual confirmada em `D:\FABRICA_DE_SISTEMAS`: inclui `00_GOVERNANCA`, `01_RULES`, `02_WORKFLOWS`, `03_SKILLS`, `05_AGENTS`, `16_SISTEMAS`, `17_RUNTIME`, entre outras.

Encaixe proposto:
- **Doutrina (texto)** → `00_GOVERNANCA` e/ou `01_RULES` como regra constitucional de prioridade máxima da Fábrica.
- **Versão "skill" da lei** → `03_SKILLS` (espelhando a origem `04_SKILLS/governance`).
- **Aplicação a agentes** → referência obrigatória em `05_AGENTS` (cláusula no system prompt de cada agente).
- **Gate em pipelines** → `02_WORKFLOWS` deve invocar a verificação antes de declarar etapa concluída.
- **Implementação `HallucinationGuard`** → `17_RUNTIME` (junto a este dossiê em `CORE_ASSETS`) quando/se adaptada.

**O que precisa ser adaptado:**
1. Renomear "AGENTE-X" / "COMPLEXO_ZEUS" / "Diretor Luiz Cipolari" para termos genéricos da Fábrica.
2. Definir explicitamente o comportamento FAIL CLOSED no consumidor (bloquear entrega quando `risk_score` acima do limiar), pois o módulo atual só reporta.
3. Parametrizar limiares (0.1 / 0.4 / 0.8) e a lista de negações via config.
4. Definir destino real do registro `VIOLATION_ZERO_GHOST` (log/banco) dentro de `17_RUNTIME`.

---

## 6. Classificação

**ADAPTAR** — Doutrina deve ser importada como regra-mãe da Fábrica; o `HallucinationGuard` é útil mas exige sanitização de nomes próprios, parametrização de limiares e implementação explícita do FAIL CLOSED no consumidor.

---

## 7. Plano de Extração (sem código)

1. **Aprovar a doutrina** como regra constitucional da Fábrica; reescrever o texto removendo nomes próprios de origem (AGENTE-X, COMPLEXO_ZEUS, Diretor) → versão neutra para `00_GOVERNANCA`/`01_RULES`.
2. **Confirmar dependências pendentes** antes de portar código: localizar e inspecionar o `react_engine` consumidor e o mecanismo de registro `VIOLATION_ZERO_GHOST` (marcados "a confirmar").
3. **Sanitizar** `hallucination_guard.py`: remover/atualizar docstring de origem ("Portado do PHANDORA"), eliminar referências a sistemas externos.
4. **Parametrizar** limiares de risco (0.1/0.4/0.8), lista de negações e idioma via arquivo de config da Fábrica.
5. **Implementar o FAIL CLOSED real** no ponto de consumo: bloquear/segurar a resposta quando o status for `RESTRICTED_MODE`/`SAFE_MODE_ACTIVATED`, em vez de apenas reportar.
6. **Testar:** portar/recriar `hallucination_runtime_test.py` como suíte de testes da Fábrica; validar contra Python 3.10 e 3.11 (versões confirmadas no bytecode de origem); cobrir falsos positivos/negativos da heurística.
7. **Registrar evidências** da execução real dos testes (saída real, não estimada) conforme a própria lei exige (`CRIAR > TESTAR > VALIDAR > REGISTRAR > SALVAR > REPORTAR`).
8. **Integrar** como gate obrigatório em `02_WORKFLOWS` e cláusula em `05_AGENTS`; só então marcar como ativo na Fábrica.

---

## 8. Status do Dossiê

**DOSSIÊ COMPLETO — código NÃO importado (Zero Ghost Law)**
