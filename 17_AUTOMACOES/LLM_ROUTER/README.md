# LLM_ROUTER — Roteador Oficial
**Versão:** 1.0.0 | **Data:** 2026-06-05

---

## PROPÓSITO

Roteador inteligente de LLMs da Fábrica de Sistemas.  
Seleciona o provider correto por tipo de tarefa, aplica billing_guard e secret_guard.

---

## ESTRUTURA

```
LLM_ROUTER/
├── llm_router.py              — Roteador principal
├── billing_guard.py           — Controle de custos
├── secret_guard.py            — Proteção de segredos
├── provider_health_check.py   — Verificação de disponibilidade
├── provider_registry.json     — Registry de providers
├── providers/
│   ├── deepseek_provider.py
│   ├── gemini_provider.py
│   ├── openai_api_provider.py
│   ├── openai_codex_provider.py
│   ├── anthropic_api_provider.py
│   ├── claude_code_provider.py
│   ├── gemma4_ollama_provider.py
│   └── llama_ollama_provider.py
├── tests/
│   ├── test_secret_guard.py       (6 testes - PASSED)
│   ├── test_billing_guard.py      (5 testes - PASSED)
│   ├── test_provider_registry.py  (6 testes - PASSED)
│   ├── test_llm_hierarchy.py      (7 testes - PASSED)
│   └── test_no_fake_provider.py   (5 testes - PASSED)
└── reports/
    ├── LLM_ROUTER_STATUS.md
    └── LLM_PROVIDER_VALIDATION_REPORT.md
```

---

## USO RÁPIDO

```python
from llm_router import LLMRouter

router = LLMRouter(mission_id="missao_001")
result = router.route(task_type="coding", prompt="Crie uma função Python que...")

if result.success:
    print(result.response)
else:
    print(f"Falhou: {result.reason}")
```

---

## HIERARQUIA POR TASK TYPE

| Task Type | Ordem de Providers |
|-----------|-------------------|
| architecture | deepseek → anthropic → openai → gemini → gemma4 → ollama |
| coding | deepseek → openai → anthropic → gemini → gemma4 → ollama |
| audit | deepseek → openai → anthropic → gemini → gemma4 → ollama |
| documentation | gemini → anthropic → openai → deepseek → gemma4 → ollama |
| research | gemini → openai → deepseek → gemma4 → ollama |
| multimodal | gemini → openai → anthropic |
| simple | gemma4 → ollama → deepseek |
| fallback | gemma4 → ollama |

---

## RODAR TESTES

```bash
cd 17_AUTOMACOES/LLM_ROUTER
python tests/test_secret_guard.py
python tests/test_billing_guard.py
python tests/test_provider_registry.py
python tests/test_llm_hierarchy.py
python tests/test_no_fake_provider.py
```

**Resultado:** 29/29 testes passando.

---

## SOURCE OF TRUTH

`08_SOURCE_OF_TRUTH/LLM_REGISTRY/` — documentação oficial  
`30_LLM_REGISTRY/` — inventário de descoberta

---

_Fábrica de Sistemas · LLM_ROUTER · 2026-06-05_
