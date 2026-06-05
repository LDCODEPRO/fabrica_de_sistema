# 07_KNOWLEDGE_ENGINE

Motor de conhecimento da Fabrica de Sistemas.
Busca, roteamento, ranking e validacao das bibliotecas de conhecimento dos agentes.
Sem LLM. Apenas busca baseada em arquivos.

---

## Modulos

| Arquivo | Funcao |
|---|---|
| `knowledge_router.py` | Roteia queries para o agente correto via keywords |
| `knowledge_search.py` | Busca em todos os arquivos das KNOWLEDGE_LIBRARYs |
| `knowledge_ranker.py` | Classifica resultados por autoridade e relevancia |
| `knowledge_cache.py` | Cache local com TTL de 5 minutos |
| `knowledge_validator.py` | Valida estrutura e integridade das bibliotecas |
| `knowledge_manifest_loader.py` | Carrega manifestos YAML dos agentes |
| `knowledge_config.yaml` | Configuracao centralizada do motor |
| `manifests/` | Manifestos YAML por agente |

---

## Uso rapido

```python
# Rotear uma query
from knowledge_router import route_primary
result = route_primary("Como aplicar DDD em microservices?")
print(result.agent)  # ARCHITECT

# Buscar conteudo
from knowledge_search import search
hits = search("Martin Fowler")
print(hits.total_hits)  # 50

# Validar bibliotecas
from knowledge_validator import validate_all
report = validate_all()
print(report.score)  # 100
```

---

## Manifests

7 manifestos YAML em `manifests/` com campos obrigatorios:
agent_name, description, masters, books, frameworks, patterns, tools, domains, priority, version, last_review, source_count, validation_status.
