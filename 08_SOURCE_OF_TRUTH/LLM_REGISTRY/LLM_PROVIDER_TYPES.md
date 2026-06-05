# LLM_PROVIDER_TYPES

## Campos Obrigatorios

Todo provider deve declarar:

```json
{
  "provider_name": "",
  "display_name": "",
  "provider_type": "subscription | local | paid_api",
  "automation_mode": "assisted | direct | connector | unavailable",
  "billing_mode": "fixed_subscription | local_zero_incremental | token_based | not_applicable",
  "cost_incremental": 0,
  "requires_api_key": true,
  "requires_director_approval": true,
  "health_status": "unknown | active_real | inactive | missing_key | unavailable",
  "last_health_check": "",
  "allowed_for_agents": true,
  "notes": ""
}
```

## Tipos

### subscription

Assinatura ja paga. Nao possui billing por token.

### local

Execucao na maquina local. Custo incremental zero; health check real obrigatorio.

### paid_api

API externa paga. Bloqueada por padrao; exige autorizacao e Billing Guard.
