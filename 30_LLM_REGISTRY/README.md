# 30_LLM_REGISTRY
**Versão:** 1.0.0  
**Criado:** 2026-06-05  
**Missão:** LLM_DISCOVERY_AND_INTEGRATION_V1

---

## PROPÓSITO

Camada oficial de conhecimento de LLMs da Fábrica de Sistemas.

Centraliza o inventário, hierarquia, configuração e plano de integração de todos os provedores e modelos de LLM descobertos no ecossistema.

> **IMPORTANTE:** Este registry é **read-only** em relação aos sistemas externos.  
> Nunca modifica código em `E:\`. Apenas documenta e referencia.

---

## ESTRUTURA

```
30_LLM_REGISTRY/
├── PROVIDERS/
│   └── provider_registry.yaml    — Catálogo de provedores (sem credenciais)
│
├── MODELS/
│   └── model_catalog.yaml        — Catálogo por categoria de uso
│
├── ROUTING/
│   ├── LLM_HIERARCHY.md          — Hierarquia operacional descoberta
│   └── fallback_chain.yaml       — Cadeia de fallback por tier
│
├── EMBEDDINGS/
│   └── (ver model_catalog.yaml → embeddings)
│
├── FALLBACKS/
│   └── (ver fallback_chain.yaml)
│
├── INVENTORY/
│   └── LLM_INVENTORY.md          — Inventário completo de provedores
│
└── REPORTS/
    ├── LLM_DISCOVERY_REPORT.md   — Relatório de descoberta
    ├── LLM_INTEGRATION_PLAN.md   — Plano de integração
    └── LLM_SECURITY_AUDIT.md     — Auditoria de segurança
```

---

## PROVEDORES ATIVOS

| Provider | Tier | Hierarquia |
|----------|------|-----------|
| Ollama | FREE (local) | TIER 0 — SEMPRE PRIMEIRO |
| Groq | Freemium | TIER 1 — Econômico |
| DeepSeek | Low Cost | TIER 1 — Coding |
| Anthropic (Claude) | Paid | TIER 2-3 — Produção |
| Google (Gemini) | Freemium/Paid | TIER 2 — Pesquisa |
| OpenAI | Paid | TIER 3 — Alta Complexidade |
| OpenRouter | Gateway | TIER 4 — Fallback |

---

## REGRAS DE SEGURANÇA

```
🔒 NUNCA incluir API keys neste registry
🔒 SEMPRE referenciar por nome de variável de ambiente
🔒 NUNCA copiar conteúdo de .env
🔒 SECRET_DETECTED = apenas flag, nunca valor
```

---

## INTEGRAÇÃO COM A FÁBRICA

| Componente | Arquivo de Referência |
|------------|----------------------|
| Mission Engine | ROUTING/fallback_chain.yaml |
| Orchestrator | ROUTING/LLM_HIERARCHY.md |
| Knowledge Engine | MODELS/model_catalog.yaml → embeddings |
| Agent Runtime | INVENTORY/LLM_INVENTORY.md |
| System Factory Engine | PROVIDERS/provider_registry.yaml |

---

## STATUS

```
LLMs DESCOBERTAS ............ OK
MODELOS INVENTARIADOS ...... OK
HIERARQUIA MAPEADA ......... OK
INTEGRAÇÃO PLANEJADA ....... OK
SEGREDOS PRESERVADOS ....... OK
SAVE LAW ................... OK

STATUS: READY_FOR_LLM_INTEGRATION
```

---

_Fábrica de Sistemas · LLM_DISCOVERY_AND_INTEGRATION_V1 · 2026-06-05_
