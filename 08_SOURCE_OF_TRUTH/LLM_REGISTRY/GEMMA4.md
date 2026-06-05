# GEMMA 4 — Motor Local / Fallback Leve
**Posição:** 5º na hierarquia | **Data:** 2026-06-05

## IDENTIDADE
```
Provider:   Ollama (local)
Model:      llama3.2:latest (validado), llama3:latest (validado), qwen3:8b (parcial)
Tier:       FREE (local)
Position:   LOCAL PRIMARY — fallback econômico
```

## FUNÇÕES AUTORIZADAS
- Tarefas locais sem necessidade de API
- Respostas rápidas e simples
- Fallback econômico quando APIs indisponíveis
- Operação sem internet
- Testes locais

## CONFIGURAÇÃO
```
env_var:    null (local, sem autenticação)
base_url:   http://127.0.0.1:11434
model_id:   llama3.2:latest (padrão validado)
runtime:    Ollama
```

## CRITÉRIO DE USO
- Usar quando nenhuma API cloud estiver disponível
- Usar para tarefas de baixa complexidade
- Não usar para tarefas que requerem raciocínio profundo
- Não usar para multimodal (versão local limitada)

## STATUS ATUAL
```
STATUS: LOCAL_OK — VALIDADO em 2026-06-05 (OLLAMA_REVALIDATION_V1)
Modelos confirmados: llama3.2:latest (OK), llama3:latest (OK), qwen3:8b (parcial)
Verificação: ollama list
```
