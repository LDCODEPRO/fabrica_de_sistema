# CHECKLIST_LLM_PROVIDER_VALIDATION
**Versão:** 1.0.0 | **Data:** 2026-06-05

Use este checklist antes de marcar qualquer provider como `ACTIVE_REAL`.

---

## PRÉ-VALIDAÇÃO

- [ ] Provider está listado no `provider_registry.json`
- [ ] Campos obrigatórios preenchidos (name, env_var, base_url, model_id, tier, priority, status, capabilities)
- [ ] Status inicial definido como `API_KEY_REQUIRED` ou `CONFIG_REQUIRED`
- [ ] Nenhuma credencial hardcodada no registry

## VALIDAÇÃO DE CREDENCIAL

- [ ] Variável de ambiente existe (apenas verificar existência, nunca valor)
- [ ] Variável tem comprimento adequado (> 8 chars)
- [ ] Credencial vem do cofre em `E:\` (não de outro lugar)

## VALIDAÇÃO DE CONECTIVIDADE

- [ ] Health check passou (provider_health_check.py)
- [ ] Base URL acessível
- [ ] Para Ollama: modelo disponível no `ollama list`

## VALIDAÇÃO FUNCIONAL

- [ ] Chamada de teste real realizada
- [ ] Resposta válida recebida
- [ ] Erros tratados gracefully
- [ ] Billing guard não bloqueou

## VALIDAÇÃO DE SEGURANÇA

- [ ] secret_guard não detectou vazamento
- [ ] Nenhuma chave apareceu no log
- [ ] Relatório de validação gerado sem segredos

## PÓS-VALIDAÇÃO

- [ ] Status atualizado para `ACTIVE_REAL` (ou `SUBSCRIPTION_OK`, `LOCAL_OK`)
- [ ] Resultado registrado em `LLM_PROVIDER_VALIDATION_REPORT.md`
- [ ] Roteador atualizado se necessário

---

## APROVAÇÃO

```
Provider: ________________
Validado por: ____________
Data: ____________________
Status final: ____________
```

---

_Fábrica de Sistemas · 2026-06-05_
