# HOME_API_CONTRACTS

**Data:** 07 de Junho de 2026
**Etapa 7:** API Contracts
**Propósito:** Definir estritamente os contratos JSON (schemas) para a futura Home Executiva. Qualquer campo sem preenchimento real no banco deve obrigatoriamente retornar `0`, `[]`, ou `status: "not_configured"`. **É expressamente proibida a geração de dummy data no frontend.**

---

### `GET /api/home/overview`
Resumo central dos componentes da FORJA.
```json
{
  "status": "ok",
  "active_missions": 0,
  "idle_agents": 0,
  "system_alerts": 0,
  "latest_deployment": "not_configured",
  "source": "reality_engine"
}
```

### `GET /api/home/health`
Status de ping real e integridade dos bancos e conexões externas.
```json
{
  "status": "ok",
  "database": {"status": "connected", "latency_ms": 12},
  "runtime": {"status": "active", "uptime_seconds": 120},
  "filesystem": {"status": "writable"}
}
```

### `GET /api/home/providers`
Disponibilidade em tempo real dos serviços LLM.
```json
{
  "status": "ok",
  "items": [
    {"name": "openrouter", "status": "CONFIGURADO", "latency_ms": 300},
    {"name": "ollama", "status": "FAILED", "latency_ms": 2000}
  ]
}
```

### `GET /api/home/missions`
Missões ativas, completas ou em falha (direto de `missions`).
```json
{
  "status": "ok",
  "total": 0,
  "items": []
}
```

### `GET /api/home/teams`
Agentes ativos e suas alocações (direto de `agents`).
```json
{
  "status": "ok",
  "total": 0,
  "items": []
}
```

### `GET /api/home/github`
Atividade de Pull Requests e Commits. Se o Webhook não estiver setado, reportar ausência de configuração.
```json
{
  "status": "not_configured",
  "recent_events": [],
  "message": "Nenhum webhook configurado para github_events."
}
```

### `GET /api/home/timeline`
Timeline consolidada de eventos (missões + sistema).
```json
{
  "status": "ok",
  "events": []
}
```

### `GET /api/home/alerts`
Lista de erros críticos do sistema que exigem atenção manual (`alerts` table).
```json
{
  "status": "ok",
  "total_unresolved": 0,
  "items": []
}
```

### `GET /api/home/evidence`
Artefatos físicos ou lógicos levantados pelas missões (`evidences` table).
```json
{
  "status": "ok",
  "total": 0,
  "items": []
}
```

### `GET /api/home/deployments`
Histórico de infraestrutura implantada (Staging/Production).
```json
{
  "status": "not_configured",
  "environments": [],
  "message": "Sem dados de CI/CD em deployments."
}
```
