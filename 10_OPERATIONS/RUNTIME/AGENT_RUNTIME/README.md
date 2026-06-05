# AGENT_RUNTIME

Runtime de agentes da Fabrica de Sistemas — Modo HUMAN_ASSISTED.
Prepara prompts, registra respostas e gera evidencias de interacoes com LLMs.
NAO usa APIs externas. NAO simula respostas.

---

## Arquivos

| Arquivo | Funcao |
|---|---|
| `agent_runtime.ps1` | Entry point. Modos: Generate, Ingest, Status. |
| `agent_loader.ps1` | Carrega identidade do agente de 05_AGENTS. Retorna JSON. |
| `agent_prompt_builder.ps1` | Constroi o prompt operacional completo. |
| `agent_response_ingestor.ps1` | Le resposta do operador, valida e grava evidencia. |
| `agent_evidence_writer.ps1` | Grava arquivo de evidencia para respostas validas. |

---

## Como usar

### Ver status de todos os agentes de um projeto

```powershell
.\agent_runtime.ps1 -ProjectName "PROJETO_002_TESTE_SAAS" -Mode Status
```

### Gerar prompt para um agente especifico

```powershell
.\agent_runtime.ps1 -ProjectName "PROJETO_002_TESTE_SAAS" -AgentName "ARCHITECT_AGENT" -Mode Generate
```

### Gerar prompt automatico (seleciona primeiro agente pendente)

```powershell
.\agent_runtime.ps1 -ProjectName "PROJETO_002_TESTE_SAAS" -Mode Generate
```

### Ingerir resposta colada pelo operador

```powershell
.\agent_runtime.ps1 -ProjectName "PROJETO_002_TESTE_SAAS" -AgentName "ARCHITECT_AGENT" -Mode Ingest
```

---

## Fluxo HUMAN_ASSISTED

```
1. agent_runtime.ps1 -Mode Generate
   |
   |- agent_loader.ps1          -> le identidade de 05_AGENTS
   |- agent_prompt_builder.ps1  -> constroi prompt estruturado
   |
   -> Salva em: _AGENT_RUNTIME/PROMPTS/AGENTNAME_PROMPT.md
   -> Cria template em: _AGENT_RUNTIME/RESPONSES/AGENTNAME_RESPONSE.md
   -> Atualiza status: -> PROMPT_GERADO

2. OPERADOR:
   - Abre o PROMPT e copia para ChatGPT/Claude
   - Cola a resposta no arquivo RESPONSE

3. agent_runtime.ps1 -Mode Ingest
   |
   |- Valida: resposta nao e vazia nem placeholder
   |- agent_evidence_writer.ps1 -> grava EVIDENCE
   |- status_updater.ps1        -> atualiza status para AGENT_RESPONSE_RECEIVED
   -> Registra no AGENT_LOG.md
```

---

## Estrutura criada por projeto

```
15_PROJETOS/PROJETO_X/_AGENT_RUNTIME/
  PROMPTS/
    ARCHITECT_AGENT_PROMPT.md
    DEVELOPER_AGENT_PROMPT.md
    ...
  RESPONSES/
    ARCHITECT_AGENT_RESPONSE.md   <- operador cola resposta aqui
    ...
  EVIDENCE/
    ARCHITECT_AGENT_EVIDENCE.md   <- gerado automaticamente
    ...
  AGENT_LOG.md                    <- log de todos os eventos
```

---

## Status do agente

| Status | Significado |
|---|---|
| AGUARDANDO | Tarefa pendente |
| EM EXECUCAO | Despachada pelo MISSION_EXECUTOR |
| PROMPT_GERADO | Prompt criado, aguardando resposta do operador |
| AGENT_RESPONSE_RECEIVED | Resposta recebida e evidencia registrada |
| EM_VALIDACAO | Resposta sendo validada pelo operador |
| CONCLUIDO | Tarefa encerrada |
| BLOQUEADO | Tarefa bloqueada |

---

## Zero Ghost Law

Nenhuma resposta e simulada.
Nenhuma evidencia e gerada sem resposta real.
Respostas com menos de 50 caracteres ou com placeholder sao rejeitadas.

---

## Proxima evolucao

Quando APIs estiverem disponíveis, o modo LLM_CONNECTED substituira o HUMAN_ASSISTED:
o prompt sera enviado diretamente via API e a resposta sera ingerida automaticamente.
O fluxo de evidencias e status permanece identico.
