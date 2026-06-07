# Walkthrough - Governanca de IA com Custo Zero

Data: 2026-06-05

## Como a Fabrica deve escolher IA

1. Para trabalho assistido, usar primeiro DeepSeek V4 Pro.
2. Para pesquisa/documentacao, usar Gemini Advanced quando fizer sentido.
3. Para automacao direta, usar Ollama Local somente se o health check confirmar disponibilidade.
4. Usar API paga apenas com autorizacao explicita da Diretoria.

## O que a tela deve mostrar

- Assinaturas: custo incremental R$ 0.
- Ollama Local: custo incremental R$ 0, aguardando health real quando ainda nao testado.
- APIs pagas: bloqueadas ate aprovacao.
- Custos e tokens: mostrar somente quando houver medicao real.

## O que nao pode acontecer

- Mostrar custo ficticio.
- Mostrar tokens ficticios.
- Marcar provider como ativo sem health check.
- Usar assinatura como se fosse API.
- Chamar API paga sem autorizacao.

