# LLM_COST_POLICY — Política de Economia
**Versão:** 1.0.0 | **Data:** 2026-06-05

---

## LIMITES OPERACIONAIS

| Escopo | Limite Suave | Limite Duro |
|--------|-------------|------------|
| Por missão | $0.25 | $0.50 |
| Diário | $2.00 | $5.00 |
| Semanal | $10.00 | $20.00 |

*Baseado em evidências encontradas em `E:\Agente X\.env` e `E:\PHANDORA\04_CONFIG\cost_policy.json`*

---

## BILLING GUARD — REGRAS

Antes de qualquer chamada a API paga:

```
1. verificar limite_por_missao
2. verificar limite_diario
3. verificar se existe assinatura disponível (preferir)
4. SE custo desconhecido → BLOQUEAR
5. SE limite excedido → usar fallback local
6. SEMPRE registrar decisão no log
```

---

## PRIORIDADE ECONÔMICA

### Custo Zero
- Ollama local (llama3, gemma3)
- Assinaturas ativas (Claude Code, ChatGPT Plus)

### Custo Baixo (< $0.01/1K tokens)
- DeepSeek V4 Pro
- Groq (llama3)
- Gemini Flash

### Custo Médio ($0.01–$0.10/1K tokens)
- Claude Haiku
- GPT-4o-mini
- Gemini Pro

### Custo Alto (> $0.10/1K tokens)
- Claude Opus
- GPT-4o
- Claude Sonnet

---

## ROTEAMENTO POR COMPLEXIDADE

```
COMPLEXIDADE BAIXA  → Local ou econômico (< $0.01)
COMPLEXIDADE MÉDIA  → Haiku / Flash / mini ($0.01–$0.10)
COMPLEXIDADE ALTA   → Opus / GPT-4o (> $0.10, com aprovação)
```

---

## ALERTAS AUTOMÁTICOS

O billing_guard deve emitir alertas quando:
- Gasto diário > 50% do limite suave
- Gasto por missão > 80% do limite
- Três fallbacks consecutivos (sinal de problema)

---

_Fábrica de Sistemas · LLM_COST_POLICY · 2026-06-05_
