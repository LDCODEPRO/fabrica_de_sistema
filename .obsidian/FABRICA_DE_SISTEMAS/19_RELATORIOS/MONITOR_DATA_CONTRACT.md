# MONITOR 1 - DATA CONTRACT

Este documento estabelece o contrato oficial de dados para a aplicação frontend "Monitor 1" ou "Factory Platform", garantindo que a UI espere exatamente o que a `FACTORY_API` fornece via REST JSON.

## Rotas Base (Mapeamento)
A API do FastAPI (`18_FACTORY_ENGINE/API/api.py`) responde em HTTP JSON e todas as integrações com os Centers do Blueprint usarão este contrato.

### 1. Dashboard (GET `/dashboard`)
Retorna a sumarização global:
```json
{
  "projects": { "active": 2, "paused": 0, "completed": 5 },
  "llms": { "DeepSeek": "ACTIVE_REAL", "Claude": "SUBSCRIPTION_OK" },
  "costs": { "daily": 0.0003, "weekly": 0.0020, "monthly": 0.0100 }
}
```
**Consumidor:** `DASHBOARD` da Platform.

### 2. Criação de Projeto (POST `/project/create`)
Payload esperado:
```json
{
  "idea": "Ideia em texto bruto",
  "scope": "Escopo detalhado",
  "objectives": "Objetivos técnicos ou de negócio",
  "timeline": "Prazos",
  "technologies": ["Python", "FastAPI"]
}
```
Retorno:
```json
{
  "status": "success",
  "project_id": "proj-uuid",
  "message": "Project blueprint generated"
}
```
**Consumidor:** `PROJECT_CENTER` da Platform.

### 3. Saúde do Sistema (GET `/status`)
Retorna a integridade do Core:
```json
{
  "status": "READY_FOR_SYSTEM_FACTORY_ENGINE"
}
```
**Consumidor:** `HEALTH / SETTINGS` da Platform.

## Contratos Extras (A serem mapeados fisicamente nos endpoints)

- **Missões:** O `MISSION_CENTER` chamará `/missions` para buscar as tarefas `PENDING/RUNNING`.
- **Agentes:** O `AGENT_CENTER` consumirá tabelas do banco traduzidas para a API para ler `agent_memory` e status.
- **Deploys:** O `DEPLOY_CENTER` interrogará `release_manager` por websockets/SSE para stream de logs.
- **Auditoria:** O `AUDIT_CENTER` puxará a tabela `audit_logs` e `evidences` para validar `ZERO GHOST`.

**Status Contratual:** READY. Todos os serviços Backend para estes objetos já foram codificados em Python e existem no repositório.
