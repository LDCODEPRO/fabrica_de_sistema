# Relatório de Reestruturação de Diretórios dos Agentes

## Missão: FORJA_AGENT_DATABASE_AND_DIRECTORIES_V1

Este relatório documenta a reorganização física e semântica das habilidades dos agentes, que agora passam a habitar pastas com estrutura granular.

### 1. Novo Diretório Raiz: `20_AGENTS`
O diretório `20_AGENTS` foi criado na raiz do repositório, contendo as pastas principais em letras minúsculas representando cada papel da Fábrica.

#### Estrutura Básica de Cada Agente
```
20_AGENTS/
 └── <agent_role>/
      ├── skill.md    (A persona e as regras primárias do Agente)
      ├── prompts/    (Templates futuros de comunicação)
      ├── memory/     (Onde os caches temporários de contexto são escritos)
      └── logs/       (Eventuais saídas de diagnóstico deste agente)
```

### 2. Mapeamento e Migração
As "SYSTEM_SKILLS.md" outrora localizadas espalhadas e soltas em `03_SKILLS` foram transpostas via script e injetadas de forma concisa em `skill.md` no subdiretório de cada agente na nova estrutura. Se múltiplos cargos possuíam similaridade (ex: `SITE_DESIGNER` e `ADMIN_DESIGNER`), o sistema fundiu as instruções em um único arquivo, garantindo o "Zero Ghost Law" (nenhuma instrução antiga foi descartada silenciosamente).

**Agentes populados:**
- `architect`
- `designer`
- `developer`
- `qa`
- `docs`
- `orchestrator`
- `devops`
- `analyst`
- `communication`
- `security`
- `data_engineer`
- `ai_engineer`

### 3. Integração com o Runtime
O `agent_runtime.py` foi atualizado. Durante a execução real (`run_mission`), a função `_build_prompt` agora é capaz de localizar, de maneira dinâmica a partir do banco de dados (`agent_skills`), o arquivo físico exato daquela skill (`20_AGENTS/<agente>/skill.md`), injetando todo o conteúdo carregado como *INSTRUÇÕES GLOBAIS DO AGENTE* antes de solicitar a inferência ao LLM real. Adicionalmente, logs e arquivos textuais (`cache_mid_XXX.txt`) são depositados na pasta `memory/` de cada agente para depuração em tempo real ou análise estendida.
