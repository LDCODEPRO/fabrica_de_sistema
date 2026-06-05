# WORKFLOW_LLM_ROUTING
**Versão:** 1.0.0 | **Data:** 2026-06-05

---

## FLUXO DE ROTEAMENTO LLM

```
MISSÃO RECEBIDA
      │
      ▼
┌─────────────────────┐
│  1. Identificar     │  → task_type: architecture|coding|audit|
│     tipo de tarefa  │              documentation|research|multimodal|simple
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  2. Billing Guard   │  → verificar limite diário e por missão
│     check_before_call│  → BLOQUEAR se custo desconhecido
└──────────┬──────────┘
           │ OK
           ▼
┌─────────────────────┐
│  3. Buscar chain    │  → provider_registry.json routing_table
│     para task_type  │  → ex: architecture = [deepseek, anthropic, ...]
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  4. Para cada       │  → verificar env_var presente
│     provider        │  → verificar status != FAILED_VALIDATION
│     na chain:       │  → verificar capabilities
└──────────┬──────────┘
           │ provider disponível
           ▼
┌─────────────────────┐
│  5. Executar via    │  → adapter específico do provider
│     adapter         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  6. Secret Guard    │  → mask_secrets() em toda resposta/log
│     em todo output  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  7. Registrar custo │  → record_cost() se API paga
│     e audit entry   │  → to_audit_entry() no log
└──────────┬──────────┘
           │
           ▼
    RESULTADO ENTREGUE
```

---

## FLUXO DE FALLBACK

```
Provider falhou (qualquer razão)
           │
           ▼
    Tentar próximo na chain
           │
    Todos falharam?
           │
     ┌─────┴──────┐
    SIM           NÃO
     │             │
     ▼             ▼
  Ollama/       Provider
  Gemma4        disponível
  (local)
     │
     ▼
  Registrar FALLBACK_USED=True
  NÃO quebrar o sistema
```

---

## WORKFLOW DE VALIDAÇÃO DE PROVIDER NOVO

```
1. Adicionar ao provider_registry.json com status=API_KEY_REQUIRED
2. Configurar variável de ambiente no cofre E:\
3. Rodar provider_health_check.py
4. Executar CHECKLIST_LLM_PROVIDER_VALIDATION.md
5. Atualizar status para ACTIVE_REAL
6. Commit + Push
```

---

_Fábrica de Sistemas · Workflows · 2026-06-05_
