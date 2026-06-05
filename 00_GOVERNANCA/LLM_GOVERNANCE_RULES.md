# LLM_GOVERNANCE_RULES — Governança Oficial de LLMs
**Versão:** 1.0.0 | **Data:** 2026-06-05 | **Autoridade:** Diretoria da Fábrica

---

## DECLARAÇÃO

As LLMs são os **motores cognitivos principais** da Fábrica de Sistemas.  
Todo uso deve ser: **autorizado · rastreável · seguro · econômico · validado**.

---

## HIERARQUIA OFICIAL

| # | Provider | Função |
|---|----------|--------|
| 1 | DeepSeek V4 Pro | Motor principal — arquitetura, código, raciocínio |
| 2 | Gemini | Pesquisa, documentação, multimodal |
| 3 | OpenAI GPT/Codex | Validação, código crítico |
| 4 | Claude/Claude Code | Engenharia assistida, escrita técnica |
| 5 | Gemma 4 (local) | Fallback leve local |
| 6 | Llama/Ollama | Fallback gratuito offline |

---

## REGRAS INVIOLÁVEIS

### R1 — ZERO GHOST
Nenhuma LLM pode ser usada de forma simulada.  
Toda resposta deve ser de execução real e verificável.

### R2 — VALIDAÇÃO ANTES DO USO
Nenhum provider pode ser usado sem passar pelo `provider_health_check.py`.

### R3 — BILLING GUARD OBRIGATÓRIO
Todo uso de API paga deve passar pelo `billing_guard.py`.  
Limites: $0.25/missão (soft), $0.50 (hard) | $2.00/dia (soft), $5.00 (hard).

### R4 — SECRET GUARD OBRIGATÓRIO
Todo log deve passar pelo `secret_guard.py`.  
Nenhuma credencial pode aparecer em logs ou relatórios.

### R5 — HIERARQUIA É LEI
O roteador deve seguir `LLM_HIERARCHY.md`.  
Desvios exigem registro de motivo.

### R6 — ASSINATURA ANTES DE API
Preferir assinatura oficial sobre API paga sempre que disponível.

---

## REFERÊNCIAS

| Documento | Localização |
|-----------|-------------|
| Source of Truth | `08_SOURCE_OF_TRUTH/LLM_REGISTRY/` |
| Roteador | `17_AUTOMACOES/LLM_ROUTER/` |
| Registry anterior | `30_LLM_REGISTRY/` |

---

_Fábrica de Sistemas · Governança · 2026-06-05_
