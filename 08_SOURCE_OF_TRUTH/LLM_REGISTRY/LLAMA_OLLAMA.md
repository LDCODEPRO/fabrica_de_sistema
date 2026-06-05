# LLAMA / OLLAMA — Fallback Gratuito Local
**Posição:** 6º na hierarquia | **Data:** 2026-06-05

## IDENTIDADE
```
Provider:   Meta (via Ollama)
Models:     llama3.1:8b, llama3.1:70b, llama3.2:3b
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
base_url:   http://localhost:11434
model_id:   llama3.1:8b (padrão), llama3.2:3b (ultra-leve)
runtime:    Ollama
```

## STATUS ATUAL
```
STATUS: LOCAL_OK (se Ollama instalado com llama3)
Verificação: ollama list | grep llama
Evidência: E:\Agente X\01_CORE\orchestrator\llm_router.py
```
