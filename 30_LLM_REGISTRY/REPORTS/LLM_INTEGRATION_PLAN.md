# LLM_INTEGRATION_PLAN
**Versão:** 1.0.0  
**Data:** 2026-06-05  
**Missão:** LLM_DISCOVERY_AND_INTEGRATION_V1

---

## OBJETIVO

Integrar o conhecimento descoberto sobre LLMs do ecossistema E:\ dentro da Fábrica de Sistemas como uma camada oficial de conhecimento — **sem alterar sistemas existentes**.

---

## PRINCÍPIOS

1. **Read-Only sobre sistemas existentes** — apenas observar, nunca modificar
2. **Camada de abstração** — a Fábrica consulta o Registry, não os sistemas diretamente
3. **Referência por mecanismo seguro** — nunca copiar credenciais
4. **Reality First** — apenas o que existe, nada inventado

---

## ARQUITETURA DA INTEGRAÇÃO

```
FÁBRICA DE SISTEMAS
        │
        ▼
┌───────────────────────────────────┐
│         30_LLM_REGISTRY/          │
│                                   │
│  PROVIDERS/   ─── catálogo       │
│  MODELS/      ─── specs           │
│  ROUTING/     ─── hierarquia     │
│  EMBEDDINGS/  ─── vetores        │
│  FALLBACKS/   ─── políticas      │
│  INVENTORY/   ─── inventário     │
│  REPORTS/     ─── relatórios     │
└────────────────┬──────────────────┘
                 │ referencia (não copia)
                 ▼
         ECOSSISTEMA E:\
    (Agente X, Nexus, PHANDORA...)
```

---

## INTEGRAÇÃO POR COMPONENTE

### Mission Engine
**O que precisa:** Saber qual LLM usar para cada tipo de missão

**Integração proposta:**
```yaml
# 30_LLM_REGISTRY/ROUTING/mission_model_map.yaml
mission_types:
  coding:    { primary: deepseek-v4-pro, fallback: claude-sonnet }
  reasoning: { primary: claude-opus,     fallback: gpt-4o }
  writing:   { primary: gemini-pro,      fallback: claude-haiku }
  research:  { primary: claude-sonnet,   fallback: gemini-pro }
  simple:    { primary: groq-llama3,     fallback: gemini-flash }
  local:     { primary: ollama-local,    fallback: deepseek-v4-pro }
```

**Sem alterar:** Mission Engine existente — apenas consulta o arquivo YAML

---

### Orchestrator
**O que precisa:** Hierarquia de fallback quando um modelo falha

**Integração proposta:**
```yaml
# 30_LLM_REGISTRY/FALLBACKS/fallback_chain.yaml
fallback_chain:
  - tier: 0
    providers: [ollama]
    models: [llama3]
  - tier: 1
    providers: [groq, deepseek]
    models: [groq-llama3, deepseek-v4-pro]
  - tier: 2
    providers: [anthropic, google]
    models: [claude-haiku, gemini-flash]
  - tier: 3
    providers: [anthropic, openai]
    models: [claude-opus, gpt-4o]
```

---

### Knowledge Engine
**O que precisa:** Qual modelo de embedding usar para RAG

**Integração proposta:**
```yaml
# 30_LLM_REGISTRY/EMBEDDINGS/embedding_config.yaml
embeddings:
  primary:
    provider: voyage-ai
    model: voyage-2
    dimensions: 1024
  fallback:
    provider: openai
    model: text-embedding-3-small
    dimensions: 1536
  local:
    provider: ollama
    model: nomic-embed-text
    dimensions: 768
```

---

### Agent Runtime
**O que precisa:** Inventário completo de modelos disponíveis

**Integração proposta:**
- Apontar para `30_LLM_REGISTRY/INVENTORY/LLM_INVENTORY.md`
- Consultar `30_LLM_REGISTRY/PROVIDERS/` para status atual

---

### System Factory Engine
**O que precisa:** Registry de provedores para instanciar agentes

**Integração proposta:**
```yaml
# 30_LLM_REGISTRY/PROVIDERS/provider_registry.yaml
providers:
  anthropic:
    env_var: ANTHROPIC_API_KEY   # referência, nunca o valor
    base_url: https://api.anthropic.com
    models: [claude-opus, claude-sonnet, claude-haiku]
    sdk: anthropic==0.97.0
  openai:
    env_var: OPENAI_API_KEY
    base_url: https://api.openai.com/v1
    models: [gpt-4o, gpt-4o-mini]
  ollama:
    env_var: null
    base_url: http://localhost:11434
    models: [llama3, ollama-local]
    cost: 0
```

---

## ROADMAP DE IMPLEMENTAÇÃO

### Fase 1 — Documentação (COMPLETA ✓)
- [x] LLM_DISCOVERY_REPORT.md
- [x] LLM_INVENTORY.md
- [x] LLM_HIERARCHY.md
- [x] LLM_INTEGRATION_PLAN.md
- [x] LLM_SECURITY_AUDIT.md

### Fase 2 — Configuração YAML (PRÓXIMA)
- [ ] mission_model_map.yaml
- [ ] fallback_chain.yaml
- [ ] embedding_config.yaml
- [ ] provider_registry.yaml (sem credenciais)

### Fase 3 — Integração Passiva
- [ ] README nos diretórios de cada componente da Fábrica apontando para 30_LLM_REGISTRY
- [ ] Validação de que nenhum sistema existente foi alterado

### Fase 4 — Validação
- [ ] Auditoria de segurança final
- [ ] Teste de referências YAML
- [ ] Commit + Push

---

## REGRAS DE OURO

```
1. NUNCA copiar API keys para o Registry
2. SEMPRE referenciar variáveis de ambiente por NOME
3. NUNCA modificar código existente em E:\
4. SEMPRE usar 30_LLM_REGISTRY como fonte para a Fábrica
5. SEMPRE atualizar INVENTORY quando novos provedores forem descobertos
```

---

_Gerado por LLM_DISCOVERY_AND_INTEGRATION_V1 · 2026-06-05_
