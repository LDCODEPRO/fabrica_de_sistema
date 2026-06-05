# DOSSIÊ TÉCNICO — ATIVO 08: Pipeline Cognitivo 5 Fases

> ZERO GHOST LAW — Documento APENAS de planejamento. Nenhum código foi importado, copiado ou modificado. Leitura somente-leitura em E:\ para confirmação de fatos.

## 1. Identificação
- **ID:** 08
- **Nome:** Pipeline Cognitivo 5 Fases (PLANEJAR > DECIDIR > EXECUTAR > VALIDAR > RELATAR)
- **Tipo:** Workflow / Padrão de execução (contrato cognitivo)
- **Origem (caminho real confirmado em E:\):**
  - `E:\NIVEL 2\NEXUSPREMIUM\core\cognitive\skills_registry.json` (754 bytes) — CONFIRMADO
  - Orquestrador associado (confirmado, NÃO faz parte do escopo deste ativo, mas o consome): `E:\NIVEL 2\NEXUSPREMIUM\core\cognitive\cognitive_pipeline.py` (19068 bytes)
  - Prompts de sistema por fase (confirmados): `E:\NIVEL 2\NEXUSPREMIUM\core\cognitive\system_prompts\{PLANEJAR,DECIDIR,EXECUTAR,VALIDAR,RELATAR}.txt` + `base_prompt.txt`

## 2. Finalidade
O ativo é um **contrato de execução cognitiva em 5 fases**, codificado de forma declarativa em `skills_registry.json`. Cada fase é uma chave do JSON cujo valor é uma lista de sub-skills atômicas. Estrutura real confirmada:

- **PLANEJAR:** `decompor_missao`, `identificar_objetivo`, `identificar_restricoes`, `mapear_dependencias`, `estimar_risco`
- **DECIDIR:** `escolher_acao`, `escolher_agente`, `classificar_intencao_operacional`, `verificar_permissao`, `definir_prioridade`
- **EXECUTAR:** `acionar_executor`, `acionar_agente`, `consultar_memoria`, `ler_arquivo_seguro`, `escrever_relatorio_seguro`
- **VALIDAR:** `checar_resultado`, `comparar_objetivo_resultado`, `verificar_log`, `verificar_arquivo`, **`detectar_fantasma`**
- **RELATAR:** `gerar_resumo_executivo`, `gerar_json_final`, `registrar_log`, `apontar_riscos`, `recomendar_proxima_acao`

**Por que importa para a Fábrica:** define um esqueleto de governança cognitiva reutilizável por qualquer automação. A presença de `detectar_fantasma` na fase VALIDAR alinha o pipeline diretamente à Zero Ghost Law da Fábrica (validação anti-código-fantasma como etapa obrigatória). O JSON em si é puro dado declarativo, sem lógica, o que o torna um ativo de baixo risco e alta portabilidade.

## 3. Dependências
O **ativo central** (`skills_registry.json`) é um JSON puro, **sem dependências de runtime, bibliotecas ou serviços** — é apenas dados.

Para ser *executável* (ou seja, para que as fases/sub-skills tenham efeito), o registry depende do orquestrador `cognitive_pipeline.py`, cujas dependências reais confirmadas por leitura são:

- **Runtime:** Python 3 (uso de `pathlib`, `json`, `re`, `time`, `os`, `sys`, `traceback`).
- **Módulo `tool_executor`** — função `executar_tool(...)` importada via `sys.path` apontando para `D:\NEXUSPREMIUM\core\tools` (path hardcoded). **CRÍTICO / a confirmar** se virá junto.
- **Módulo `base_nexus_manager`** — usa a constante `PRECOS` (ex.: chave `local_llama`) e a classe `BaseNexusManager` (citada como `self.brain` do agente). **a confirmar** disponibilidade.
- **Instância de agente** com método `processar_livre(prompt)` — é a ponte para o **LLM** (modelo padrão referenciado: `local_llama`, sugere LLM local). **a confirmar** o motor/modelo exato.
- **Filesystem:** logs em `D:\NEXUSPREMIUM\logs\nexus_cognitive.log`; raiz hardcoded `D:\NEXUSPREMIUM`.
- **Outros ativos críticos da Fábrica relacionados:** ativo de detecção de fantasma (sub-skill `detectar_fantasma`) — vínculo com a Zero Ghost Law. **a confirmar** se é ativo separado.
- **Banco de dados / serviços externos:** nenhum confirmado no trecho lido (sem credenciais, sem conexões de rede aparentes). **a confirmar** em leitura completa.

## 4. Riscos (do ativo e do orquestrador associado)
- **Segurança / credenciais:** Nenhuma credencial, API key, token ou senha encontrada por busca dedicada no `cognitive_pipeline.py`. O `skills_registry.json` não contém segredos. **Risco do ativo central: BAIXO** (confirma a avaliação da auditoria).
- **Paths hardcoded (orquestrador):** `D:\NEXUSPREMIUM` aparece fixo em múltiplos pontos (raiz, logs, `D:\NEXUSPREMIUM\core\tools`). Quebra portabilidade — precisa parametrização.
- **Acoplamento:** o orquestrador acopla-se fortemente a `tool_executor`, `base_nexus_manager` e ao contrato `processar_livre` do agente. O JSON em si tem acoplamento implícito: cada string de sub-skill precisa de um handler correspondente, que NÃO está no registry (risco de "skill fantasma" se um handler não existir).
- **Mocks / fallbacks frágeis:** parser de JSON com `except` amplo que injeta resposta default (`{"skill":"auto",...}`) — pode mascarar falhas.
- **Dados pessoais:** nenhum dado pessoal identificado no ativo.
- **LLM/custo:** contabilização de tokens/custo embutida (`PRECOS`, `chamadas_llm`); depende de constante externa.

## 5. Compatibilidade com a Fábrica
- **02_WORKFLOWS:** encaixe natural — o ativo É um workflow de 5 fases; deve residir como definição de workflow padrão.
- **03_SKILLS:** as 25 sub-skills mapeiam diretamente para entradas no catálogo de skills da Fábrica; cada uma precisa de handler registrado em 03_SKILLS.
- **00_GOVERNANCA:** `detectar_fantasma` (VALIDAR) e `verificar_permissao` (DECIDIR) são pontos de governança — alinhados à Zero Ghost Law.
- **05_AGENTS:** o orquestrador espera uma instância de agente com `processar_livre` — mapear para o contrato de agentes da Fábrica.
- **16_SISTEMAS / 17_RUNTIME:** o JSON declarativo serve como asset de runtime carregável; este dossiê reside em `17_RUNTIME\CORE_ASSETS`.
- **O que precisa ser adaptado:** (a) remover paths hardcoded `D:\NEXUSPREMIUM` → variáveis/config da Fábrica; (b) garantir que cada sub-skill do registry tenha handler real em 03_SKILLS (evitar skills fantasma); (c) abstrair a ponte LLM (`processar_livre`/`local_llama`) para o provedor de LLM da Fábrica.

## 6. Classificação
**ADAPTAR** — o contrato JSON de 5 fases é valioso e de baixo risco, mas sua execução depende de paths hardcoded e módulos acoplados (`tool_executor`, `base_nexus_manager`) que exigem parametrização e mapeamento às skills da Fábrica antes do uso.

## 7. Plano de Extração (sem código)
1. **Reconstruir, não copiar:** recriar o `skills_registry.json` como asset declarativo nativo da Fábrica (o conteúdo é dado público de estrutura, não código proprietário) — validar contra este dossiê.
2. **Inventário de handlers:** para cada uma das 25 sub-skills, confirmar/criar o handler correspondente em 03_SKILLS; marcar como pendente qualquer skill sem handler (anti-fantasma).
3. **Parametrização:** substituir todos os paths `D:\NEXUSPREMIUM` por configuração da Fábrica (root, logs, tools) — nenhum caminho fixo.
4. **Abstração de dependências:** definir interface da Fábrica para `executar_tool` (executor) e para a ponte LLM (`processar_livre`), desacoplando de `tool_executor`/`base_nexus_manager`.
5. **Sanitização:** auditar o orquestrador (se reconstruído) para remover fallbacks que mascaram erros e confirmar ausência de segredos.
6. **Testes:** teste unitário de carga do registry; teste de cada fase com agente mock; teste de integração da sequência completa COMPLEXA (5 fases) e SIMPLES (DECIDIR>EXECUTAR>VALIDAR); teste específico de `detectar_fantasma` validando o gate Zero Ghost.
7. **Governança:** registrar o workflow em 02_WORKFLOWS e os pontos de controle em 00_GOVERNANCA antes de promover a runtime.

## 8. Status do Dossiê
DOSSIÊ COMPLETO — código NÃO importado (Zero Ghost Law)
