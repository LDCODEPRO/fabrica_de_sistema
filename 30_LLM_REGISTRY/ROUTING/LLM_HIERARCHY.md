# LLM_HIERARCHY
**Versão:** 1.0.0  
**Data:** 2026-06-05  
**Fonte:** Evidências diretas do ecossistema E:\  
**Lei:** REALITY FIRST — apenas o que foi encontrado, nada inventado.

---

## HIERARQUIA OPERACIONAL DESCOBERTA

> Esta hierarquia é baseada exclusivamente em código e configurações encontrados em E:\.  
> Não foi inventado nenhum nível — cada camada tem evidência de arquivo.

---

## NÍVEL 0 — LOCAL (Zero Custo, Zero Latência de Rede)

```
┌─────────────────────────────────────────────────────────┐
│                    LOCAL (TIER 0)                       │
│                                                         │
│  Provider:  Ollama                                      │
│  Models:    llama3, ollama-local                        │
│  Cost:      $0.00                                       │
│  Privacy:   MÁXIMA (dados nunca saem da máquina)       │
│  Evidência: llm_router.py (Agente X), PHANDORA         │
│  Prioridade: PRIMEIRA em todos os sistemas             │
└─────────────────────────────────────────────────────────┘
```

**Sistemas que implementam:** Agente X, Complexo Nexus, PHANDORA  
**Estratégia:** Tentar sempre primeiro. Falhar gracefully → próximo nível.

---

## NÍVEL 1 — ECONÔMICO (Baixo Custo, Alta Velocidade)

```
┌─────────────────────────────────────────────────────────┐
│                  ECONÔMICO (TIER 1)                     │
│                                                         │
│  Provider A: DeepSeek — deepseek-v4-pro                │
│  Provider B: Groq — groq-llama3                        │
│  Provider C: Google — gemini-flash                     │
│  Provider D: OpenAI — gpt-4o-mini                      │
│                                                         │
│  Cost:      LOW ($0.001–$0.01/1K tokens)               │
│  Evidência: nexus_router_economia.py, llm_router.py    │
│  Prioridade: SEGUNDA (após local falhar)               │
└─────────────────────────────────────────────────────────┘
```

**Critério de roteamento:** Complexidade BAIXA → Groq; Código → DeepSeek  
**Sistema principal:** Complexo Nexus (Nexus Router Economia)

---

## NÍVEL 2 — PRODUÇÃO (Qualidade Equilibrada)

```
┌─────────────────────────────────────────────────────────┐
│                  PRODUÇÃO (TIER 2)                      │
│                                                         │
│  Provider A: Anthropic — claude-haiku                  │
│  Provider B: Anthropic — claude-haiku-4-5-20251001     │
│  Provider C: Google — gemini-pro                       │
│  Provider D: OpenAI — gpt-4o-mini                      │
│                                                         │
│  Cost:      MEDIUM ($0.01–$0.10/1K tokens)             │
│  Evidência: llm_router.py (Agente X), nexus_router    │
│  Prioridade: TERCEIRA (tarefas médias)                 │
└─────────────────────────────────────────────────────────┘
```

**Critério de roteamento:** Complexidade MÉDIA, precisão requerida

---

## NÍVEL 3 — ALTA COMPLEXIDADE (Máxima Qualidade)

```
┌─────────────────────────────────────────────────────────┐
│              ALTA COMPLEXIDADE (TIER 3)                 │
│                                                         │
│  Provider A: Anthropic — claude-opus                   │
│  Provider B: Anthropic — claude-sonnet                 │
│  Provider C: OpenAI — gpt-4o                           │
│                                                         │
│  Cost:      HIGH ($0.10–$1.00+/1K tokens)              │
│  Evidência: nexus_router_economia.py                   │
│  Prioridade: QUARTA (apenas quando necessário)         │
└─────────────────────────────────────────────────────────┘
```

**Critério de roteamento:** Complexidade ALTA, arquitetura, raciocínio profundo

---

## NÍVEL 4 — GATEWAY (Agregadores)

```
┌─────────────────────────────────────────────────────────┐
│                   GATEWAY (TIER 4)                      │
│                                                         │
│  Provider A: OpenRouter (múltiplos modelos via API)    │
│  Provider B: Together AI (open-source pool)            │
│  Provider C: AWS Bedrock (enterprise)                  │
│  Provider D: Google Vertex AI (enterprise)             │
│                                                         │
│  Cost:      VARIÁVEL                                    │
│  Evidência: PHANDORA provider_router.py, SDK metadata  │
│  Prioridade: FALLBACK / ESPECIAL                       │
└─────────────────────────────────────────────────────────┘
```

---

## NÍVEL ESPECIAL — EMBEDDINGS

```
┌─────────────────────────────────────────────────────────┐
│                  EMBEDDINGS (ESPECIAL)                  │
│                                                         │
│  Provider: Voyage AI — voyage-* models                 │
│  Purpose:  RAG, Semantic Search, Vector Store          │
│  Cost:     PAID                                        │
│  Evidência: .env (Complexo Nexus, Antigravity)         │
└─────────────────────────────────────────────────────────┘
```

---

## MAPA DE ROTEAMENTO POR SISTEMA

### Agente X
```
TAREFA → [Ollama] → FALHOU? → [DeepSeek] → FALHOU? → [Claude Haiku] → FALHOU? → [GPT-4o-mini]
              ↓ Finance Engine monitora custo em cada hop
              ↓ Circuit Breaker: $2/dia soft, $5/dia hard stop
```

### Complexo Nexus (Nexus Router Economia)
```
COMPLEXIDADE BAIXA  → Groq (llama3) — grátis/barato
COMPLEXIDADE MÉDIA  → Claude Haiku / Gemini Flash
COMPLEXIDADE ALTA   → Claude Sonnet / GPT-4o / Claude Opus
                    → Cost monitor em tempo real (llm_monitor.py)
```

### PHANDORA
```
NORMAL MODE  → Ollama → OpenAI → Gemini
QUORUM MODE  → 3 provedores em paralelo (tarefa crítica)
DEGRADED MODE→ Apenas local disponível
Budget: $1.00/dia, $0.25/missão
```

---

## DIAGRAMA COMPLETO

```
                    ┌──────────────────┐
                    │   TASK RECEIVED  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Finance Check   │◄─── Circuit Breaker
                    └────────┬─────────┘
                             │ OK
              ┌──────────────▼──────────────┐
              │      COMPLEXITY ANALYSIS     │
              └──┬──────────┬──────────┬────┘
                 │          │          │
              LOW        MEDIUM      HIGH
                 │          │          │
           ┌─────▼───┐ ┌────▼────┐ ┌──▼──────┐
           │  Groq   │ │ Claude  │ │ Claude  │
           │ llama3  │ │  Haiku  │ │  Opus   │
           └─────┬───┘ └────┬────┘ └──┬──────┘
                 │          │          │
           ┌─────▼──────────▼──────────▼─────┐
           │          RESULT MERGE            │
           └─────────────────────────────────┘

FALLBACK CHAIN (qualquer nível):
Local → Econômico → Produção → Alta Complexidade → Gateway
```

---

_Gerado por LLM_DISCOVERY_AND_INTEGRATION_V1 · 2026-06-05_  
_Fonte: evidências em E:\ — nenhum dado inventado._
