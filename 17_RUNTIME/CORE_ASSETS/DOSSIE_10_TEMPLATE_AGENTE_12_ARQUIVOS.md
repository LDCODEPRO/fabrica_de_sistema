# DOSSIÊ TÉCNICO — ATIVO 10

## 1. Identificação
- **ID:** 10
- **Nome:** Template de Agente NEXUSPREMIUM (12 arquivos de contexto)
- **Tipo:** Template (molde de contexto de agente)
- **Origem (caminho real confirmado em E:\):** `E:\NIVEL 2\NEXUSPREMIUM\managers\<NomeDoAgente>\context\` — ex.: `E:\NIVEL 2\NEXUSPREMIUM\managers\O_Analista\context\`
- **Status de verificação:** EXISTÊNCIA CONFIRMADA por leitura direta (somente leitura).

## 2. Finalidade
O ativo é o **padrão de contexto de 12 arquivos numerados** que materializa a "mente" de cada agente NEXUSPREMIUM. Cada agente (manager) possui uma pasta `context/` com exatamente:

| Arquivo | Função (confirmada por listagem) |
|---|---|
| `01_identity.md` | Identidade do agente |
| `02_role.md` | Papel/responsabilidade |
| `03_skill.md` | Competências |
| `04_workflow.md` | Fluxo de trabalho |
| `05_rules.md` | Regras de comportamento |
| `06_tools.json` | Permissões e ações (allowed/blocked) + ponteiro de DB |
| `07_memory_policy.md` | Política de memória |
| `08_tests.md` | Testes por agente |
| `09_output_schema.json` | Schema de saída estruturada |
| `10_examples.md` | Exemplos |
| `11_agent_docs.md` | Documentação do agente |
| `12_changelog.md` | Histórico de mudanças |

**Por que importa para a Fábrica:** é o molde de agente mais completo da auditoria — inclui contrato de saída (`09_output_schema.json`), testes (`08_tests.md`) e política de permissões (`06_tools.json`). Padroniza os **23 agentes** confirmados em `managers/` (O_Analista, O_Assistente, O_Baixador, O_Designer, O_Ecommerce, O_Engenheiro, O_Engenheiro_Visual, O_Espiao, O_Estrategista, O_Executor, O_Guardiao, O_IA, O_Juridico, O_Maestro, O_Marketeiro, O_Network, O_Pentest_Tool, O_Programador, O_Redes_Sociais, O_Secretario, O_Seguranca, O_Suporte, O_Validador). É candidato natural a virar o template oficial de `05_AGENTS` / `07_TEMPLATES` da Fábrica.

## 3. Dependências
- **Formato/runtime de leitura:** Markdown + JSON puro. O template em si **não tem dependência de biblioteca** — é só conteúdo de contexto.
- **Loader/consumidor:** os arquivos são lidos pelo runtime do agente (`managers/*/run.py` e `core/agent_runtime/specialist_agent.py`) — *acoplamento de consumo a confirmar* (não foi lido o parser).
- **Ponteiro de banco hardcoded:** `06_tools.json` aponta `"database": "D:\\NEXUSPREMIUM\\data\\nexus.db"` (caminho absoluto fixo) — **CONFIRMADO** em O_Analista.
- **Contrato de saída:** `09_output_schema.json` (estrutura a confirmar arquivo-a-arquivo; conteúdo não inteiramente lido).
- **Ativos críticos relacionados (mesma origem):** `config/llm_config.json` (provedores LLM), `vault/secrets/api_vault.py` + `nexus_vault.db` (segredos), `core/orchestrator/*` e `data/agent_registry.json`. **Não fazem parte do template**, mas o agente os usa em runtime — *grau de acoplamento a confirmar*.
- **Provedores LLM / bancos concretos:** a confirmar (definidos fora do template, em `config/llm_config.json`).

## 4. Riscos
- **Paths hardcoded:** `D:\NEXUSPREMIUM\data\nexus.db` embutido em `06_tools.json` — quebra portabilidade; precisa parametrização. **(confirmado)**
- **Credenciais:** nenhum segredo encontrado dentro do template de 12 arquivos. Segredos reais vivem em `vault/secrets/` (fora do ativo). Risco no template = **baixo**; **a confirmar** ausência de chaves nos 12 arquivos dos 23 agentes (só O_Analista foi inspecionado em detalhe).
- **Acoplamento:** o template referencia DB e ações de runtime específicas do NEXUSPREMIUM; importar "cru" arrasta dependência do ecossistema NEXUS.
- **Mocks/dados pessoais:** não identificados no template. **A confirmar** em `10_examples.md` (exemplos podem conter dados ilustrativos).
- **Inconsistência estrutural:** nem todos os 23 agentes têm `context/` com os 12 arquivos completos (vários managers só têm `persona.txt` + `run.py`, ex.: O_Assistente, O_IA, O_Maestro). O template completo **não está 100% aplicado** — risco de cobertura. **(confirmado por listagem)**

## 5. Compatibilidade com a Fábrica
- **Encaixe natural:** o conjunto de 12 arquivos é um excelente **template de agente** para `07_TEMPLATES/` e `05_AGENTS/` (ou `07_AGENTES/`).
- **Governança (`00_GOVERNANCA`/`01_RULES`):** `05_rules.md` + `06_tools.json` (allowed/blocked_actions) mapeiam diretamente para a camada de regras/permissões da Fábrica.
- **Workflows (`02_WORKFLOWS`):** `04_workflow.md` alimenta `02_WORKFLOWS`.
- **Skills (`03_SKILLS`):** `03_skill.md` alimenta `03_SKILLS`.
- **QA/Testes (`10_QA`/`12_TESTES`):** `08_tests.md` + `09_output_schema.json` dão base de validação automatizada.
- **Runtime (`17_RUNTIME`):** este dossiê e os assets ficam aqui; o loader que consome o template seria o componente de runtime.
- **Adaptações necessárias:** (a) remover paths absolutos `D:\NEXUSPREMIUM\...` e substituir por variáveis/placeholders; (b) generalizar nomes próprios (`O_Analista`, "NexusPremium v0.1") para tokens de template; (c) preencher os 12 arquivos para os agentes que estão incompletos; (d) desacoplar referências diretas a `vault`/`nexus.db`.

## 6. Classificação
**ADAPTAR** — molde de alto valor e baixo risco, mas com path hardcoded, nomes próprios e cobertura incompleta que exigem parametrização antes de virar template oficial.

## 7. Plano de Extração (sem código)
1. **Inventário:** mapear, nos 23 agentes, quais possuem `context/` completo (12/12) e quais estão incompletos — só com `persona.txt`/`run.py`.
2. **Seleção do molde de referência:** usar um agente com 12 arquivos completos (ex.: O_Analista) como base canônica.
3. **Sanitização:** varrer os 12 arquivos buscando segredos, dados pessoais e exemplos sensíveis em `10_examples.md` antes de qualquer migração.
4. **Parametrização:** substituir `D:\NEXUSPREMIUM\data\nexus.db` e demais caminhos absolutos por placeholders (`{{DATA_DIR}}`, `{{AGENT_NAME}}`, `{{PROJECT_VERSION}}`); transformar nomes próprios em tokens.
5. **Definição de schema oficial:** validar e versionar `09_output_schema.json` como contrato de saída padrão da Fábrica.
6. **Testes:** adaptar `08_tests.md` para o harness de QA da Fábrica (`10_QA`/`12_TESTES`) e validar o output contra o schema.
7. **Recriação limpa:** materializar o template sanitizado em `07_TEMPLATES`/`05_AGENTS` da Fábrica — **escrita reconstruída, sem copiar bytes de E:\** (Zero Ghost Law).
8. **Cobertura:** gerar os 12 arquivos para os agentes incompletos a partir do molde parametrizado.
9. **Homologação:** rodar um agente de teste end-to-end usando o template adaptado antes de promover a oficial.

## 8. Status do Dossiê
**DOSSIÊ COMPLETO — código NÃO importado (Zero Ghost Law)**
