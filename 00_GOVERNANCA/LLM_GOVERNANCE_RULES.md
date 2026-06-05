# LLM_GOVERNANCE_RULES

Versao: 2.0.0  
Data: 2026-06-05  
Autoridade: Diretoria da Fabrica

## Regra Principal

A Fabrica de Sistemas opera com custo baixissimo.

Prioridade oficial:

1. Assinaturas ja pagas
2. DeepSeek V4 Pro
3. Ollama local
4. APIs pagas somente como ultimo recurso autorizado

## Leis

- ZERO GHOST LAW: nenhuma IA pode ser marcada como ativa sem evidencia real.
- REALITY FIRST LAW: nao inventar custos, tokens, health check ou disponibilidade.
- BILLING GUARD LAW: API paga exige controle de custo e autorizacao.
- SECRET GUARD LAW: nenhuma chave, token ou segredo pode entrar em log, relatorio ou Git.
- PRODUCTION READY BY DEFAULT: a configuracao deve ser segura por padrao.

## Tipos Oficiais

| Tipo | Uso | Custo incremental | Billing por token | Automacao |
|---|---|---:|---|---|
| Assinatura | Interface/conector assistido | R$ 0,00 | Nao aplicavel | Somente se houver conector real |
| Local | Ollama e modelos locais | R$ 0,00 | Nao | Direta apos health real |
| API Paga | API externa | Variavel | Sim, com base real | Direta somente autorizada |

## Hierarquia

1. DeepSeek V4 Pro: motor principal assistido para arquitetura, codigo e raciocinio.
2. Claude Pro: engenharia assistida, escrita tecnica e revisao.
3. ChatGPT Plus / GPT: validacao, raciocinio e apoio estrategico.
4. Gemini Advanced: pesquisa, documentacao e multimodal.
5. Ollama Local: automacao continua e fallback sem custo incremental.
6. APIs Pagas: fallback especial com autorizacao da Diretoria.

## Regras De Bloqueio

- Assinatura nao pode ser cobrada por token.
- Local nao pode ser cobrado por token.
- API paga fica bloqueada por padrao.
- API paga so pode executar se:
  - `director_approved = true`
  - `billing_guard_ok = true`
  - `secret_guard_ok = true`
  - `provider_health = active_real`

## Interface

A FORJA OS deve mostrar somente dados reais, configuracoes reais ou status explicitamente desconhecido.

Proibido:

- Tokens inventados para assinatura.
- Custo ficticio de assinatura/local.
- Provider verde sem health real.
- Tratar assinatura como API.
- Tratar API como assinatura.
