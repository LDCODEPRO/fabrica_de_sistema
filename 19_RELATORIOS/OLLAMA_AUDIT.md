# OLLAMA_AUDIT

Data: 2026-06-06

## Servico

- `GET /api/tags`: HTTP 200.
- Executavel `ollama` no PATH: NAO ENCONTRADO.
- O servico HTTP estava ativo independentemente do PATH.

## Modelos instalados

| Modelo | Tamanho |
| --- | ---: |
| qwen3:8b | 5.225.388.164 bytes |
| llama3:latest | 4.661.224.676 bytes |
| llama3.2:latest | 2.019.393.189 bytes |

## Inferencia real

### qwen3:8b

- Tempo: 15.950 ms.
- Prompt tokens: 16.
- Tokens gerados: 32.
- Resposta textual: vazia.
- Resultado: NAO FUNCIONANDO para o prompt pedido.

### llama3.2:latest

- Tempo: 5.181 ms.
- Tokens estimados pelo adapter: 22.
- Resposta: texto de recusa, diferente de `PROVIDER_OK`.
- Resultado: FUNCIONANDO PARCIALMENTE.

### Missao real da FORJA

- Provider: Ollama / `llama3.2:latest`.
- Evidencia e arquivo foram gravados.
- A resposta afirmou que todos os agentes executaram, embora apenas QA tenha sido acionado.
- Resultado semantico: REPROVADO PELA ZERO GHOST LAW.

## Memoria

`GET /api/ps` retornou lista vazia apos o teste. Nenhum modelo permaneceu carregado; uso de RAM/VRAM nao foi medido.

## Integracao com Router

- `provider_router.py`: consegue chamar Ollama.
- `LLMRouter`: bloqueia Ollama porque o registry diz `health_status=unknown`.

OLLAMA_STATUS: PARCIAL

