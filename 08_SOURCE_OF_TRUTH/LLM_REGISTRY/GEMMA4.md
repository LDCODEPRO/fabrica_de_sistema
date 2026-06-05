# GEMMA 4 — Motor Local / Fallback Leve
**Posição:** 5º na hierarquia | **Data:** 2026-06-05

## IDENTIDADE
```
Provider:   Google (via Ollama)
Model:      gemma3:12b, gemma3:4b (disponíveis no Ollama)
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
base_url:   http://localhost:11434
model_id:   gemma3:12b (padrão), gemma3:4b (leve)
runtime:    Ollama
```

## CRITÉRIO DE USO
- Usar quando nenhuma API cloud estiver disponível
- Usar para tarefas de baixa complexidade
- Não usar para tarefas que requerem raciocínio profundo
- Não usar para multimodal (versão local limitada)

## STATUS ATUAL
```
STATUS: LOCAL_OK (se Ollama instalado com gemma3)
Verificação: ollama list | grep gemma
```
