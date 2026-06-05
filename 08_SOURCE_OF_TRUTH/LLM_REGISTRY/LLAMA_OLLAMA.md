# LLAMA / OLLAMA — Fallback Gratuito Local
**Posição:** 6º na hierarquia | **Data:** 2026-06-05

## IDENTIDADE
```
Provider:   Meta / Ollama (local)
Models:     llama3.2:latest (VALIDADO), llama3:latest (VALIDADO), qwen3:8b (parcial)
Tier:       FREE (local)
Position:   LOCAL FALLBACK — último recurso offline
```

## FUNÇÕES AUTORIZADAS
- Tarefas simples
- Continuidade operacional quando tudo mais falha
- Testes locais
- Operação completamente offline
- Desenvolvimento sem custo

## CONFIGURAÇÃO
```
env_var:    null (local, sem autenticação)
base_url:   http://127.0.0.1:11434
model_id:   llama3.2:latest (padrão), llama3:latest (alternativo)
runtime:    Ollama
```

## STATUS ATUAL
```
STATUS: LOCAL_OK — VALIDADO em 2026-06-05 (OLLAMA_REVALIDATION_V1)
llama3.2:latest → HTTP 200 /api/generate confirmado
llama3:latest   → presente no /api/tags confirmado
qwen3:8b        → parcial (resposta vazia em prompts curtos)
Evidência: E:\Agente X\01_CORE\orchestrator\llm_router.py
```
