# LLM_COST_POLICY

## Regra

Nao inventar custo.

## Assinatura

- Custo incremental: R$ 0,00
- Billing por token: nao aplicavel
- Nao exibir tokens como consumo financeiro
- Nao bloquear por limite de token/custo

## Local

- Custo incremental: R$ 0,00
- Billing por token: nao
- Custo operacional: energia/hardware local
- Health real obrigatorio para marcar ativo

## API Paga

- Custo incremental: variavel
- Billing por token: somente com tabela real ou medicao real
- Exige Billing Guard
- Exige autorizacao da Diretoria
- Bloqueada por padrao

## Interface

A FORJA OS deve mostrar:

- `R$ 0,00 incremental` para assinatura/local
- `Controlado pelo Billing Guard` para API paga
- `Nao validado` quando nao houver health check real
