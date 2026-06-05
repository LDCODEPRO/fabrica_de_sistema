# CHECKLIST_LLM_PROVIDER_VALIDATION

## Antes De Marcar Um Provider Como Ativo

- [ ] Provider existe no `provider_registry.json`.
- [ ] Tipo declarado: `subscription`, `local` ou `paid_api`.
- [ ] Nao ha segredo gravado no registry.
- [ ] Health real executado quando houver automacao direta.
- [ ] `active_real` somente com evidencia executada.

## Assinatura

- [ ] Custo incremental exibido como R$ 0,00.
- [ ] Billing por token marcado como nao aplicavel.
- [ ] Automacao direta nao presumida.

## Local

- [ ] Endpoint local respondeu.
- [ ] Modelo local foi listado ou executado.
- [ ] Billing por token desativado.

## API Paga

- [ ] Chave presente fora do Git.
- [ ] Protecao de Segredos aprovada.
- [ ] Billing Guard aprovado.
- [ ] Autorizacao da Diretoria registrada.
- [ ] Health check real passou.
