# LLM_COST_ZERO_GOVERNANCE_V1

Data: 2026-06-05
Status: Implementado e validado localmente com restricoes de ambiente.

## Decisao

A Fabrica passa a operar IA com prioridade de custo incremental zero:

1. DeepSeek V4 Pro e demais assinaturas ja pagas em modo assistido.
2. Ollama Local para automacao direta quando health real estiver ativo.
3. APIs pagas somente com autorizacao da Diretoria e Billing Guard.

## Ponto critico

Assinatura nao e API. Nenhuma assinatura pode ser cobrada por token dentro da plataforma.

## Evidencia

- 45 testes locais passaram.
- Build FORJA OS OK.
- Auditoria estatica FORJA OS OK.
- Nenhum provider marcado como ativo sem health real.
