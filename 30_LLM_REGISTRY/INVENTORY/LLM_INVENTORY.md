# LLM_INVENTORY
**Versão:** 1.0.0  
**Data:** 2026-06-05  
**Missão:** LLM_DISCOVERY_AND_INTEGRATION_V1

---

## INVENTÁRIO COMPLETO DE PROVEDORES E MODELOS

---

### PROVIDER: Anthropic (Claude)
```
Provider:  Anthropic
Models:    claude-opus, claude-sonnet, claude-haiku, claude-haiku-4-5-20251001
SDK:       anthropic==0.97.0 (Python)
Extras:    bedrock, vertex
Purpose:   Reasoning, Coding, Architecture, Writing
Tier:      PAID — Paid (production)
Status:    ACTIVE
Location:  E:\Agente X\, E:\NIVEL 1\DATASTORE\Complexo_Nexus\
Hierarchy: SECONDARY (after local), PRIMARY for complex tasks
Notes:     Suporte nativo a AWS Bedrock e Google Vertex AI
```

---

### PROVIDER: OpenAI
```
Provider:  OpenAI
Models:    gpt-4o, gpt-4o-mini
SDK:       via HTTP / OpenAI SDK
Purpose:   Coding, Research, Writing, Fallback
Tier:      PAID
Status:    ACTIVE
Location:  E:\Agente X\, E:\NIVEL 1\DATASTORE\Complexo_Nexus\
Hierarchy: SECONDARY / FALLBACK
Notes:     gpt-4o-mini como fallback econômico
```

---

### PROVIDER: Google (Gemini)
```
Provider:  Google
Models:    gemini-pro, gemini-flash
SDK:       via API
Purpose:   Research, Writing, Vision
Tier:      FREEMIUM → PAID
Status:    ACTIVE
Location:  E:\NIVEL 1\DATASTORE\Complexo_Nexus\, E:\PHANDORA\
Hierarchy: SECONDARY
Notes:     gemini-flash como opção econômica
```

---

### PROVIDER: DeepSeek
```
Provider:  DeepSeek
Models:    deepseek-v4-pro
SDK:       via API
Purpose:   Coding, Reasoning
Tier:      LOW COST
Status:    ACTIVE
Location:  E:\Agente X\
Hierarchy: PRIMARY LOCAL FALLBACK (após Ollama)
Notes:     Priorizado por custo-benefício no Agente X
```

---

### PROVIDER: Groq
```
Provider:  Groq
Models:    groq-llama3, llama3
SDK:       via API
Purpose:   Inference rápida, tarefas simples
Tier:      FREEMIUM
Status:    ACTIVE
Location:  E:\NIVEL 1\DATASTORE\Complexo_Nexus\
Hierarchy: PRIMARY ECONOMIA (Complexo Nexus)
Notes:     Velocidade alta, custo baixo, ideal para tarefas simples
```

---

### PROVIDER: Ollama (Local)
```
Provider:  Ollama
Models:    llama3, ollama-local
SDK:       Ollama HTTP API (localhost)
Purpose:   Privacidade, Zero Custo, Offline
Tier:      FREE (local)
Status:    ACTIVE
Location:  E:\Agente X\, E:\NIVEL 1\DATASTORE\Complexo_Nexus\, E:\PHANDORA\
Hierarchy: PRIMARY (todos os sistemas priorizam)
Notes:     Zero custo, zero privacidade risk, fallback offline
```

---

### PROVIDER: OpenRouter
```
Provider:  OpenRouter
Models:    Múltiplos (gateway)
SDK:       via API
Purpose:   Gateway / Agregador de múltiplos provedores
Tier:      VARIÁVEL
Status:    CONFIGURADO
Location:  E:\PHANDORA\, E:\Antigravity\
Hierarchy: GATEWAY
Notes:     Roteamento para múltiplos provedores via API única
```

---

### PROVIDER: xAI (Grok)
```
Provider:  xAI
Models:    grok
SDK:       via API
Purpose:   Research, Reasoning
Tier:      PAID
Status:    CONFIGURADO
Location:  E:\Antigravity\, E:\NIVEL 1\DATASTORE\Complexo_Nexus\
Hierarchy: SECONDARY
Notes:     Configurado mas não roteado ativamente
```

---

### PROVIDER: Together AI
```
Provider:  Together AI
Models:    Múltiplos open-source
SDK:       via API
Purpose:   Open-source models, alternativa econômica
Tier:      PAID
Status:    CONFIGURADO
Location:  E:\Antigravity\, E:\NIVEL 1\DATASTORE\Complexo_Nexus\
Hierarchy: FALLBACK
Notes:     Backup para Groq/DeepSeek
```

---

### PROVIDER: Voyage AI
```
Provider:  Voyage AI
Models:    voyage-* (embeddings)
SDK:       via API
Purpose:   Embeddings, RAG, Semantic Search
Tier:      PAID
Status:    CONFIGURADO
Location:  E:\Antigravity\, E:\NIVEL 1\DATASTORE\Complexo_Nexus\
Hierarchy: EMBEDDINGS
Notes:     Especializado em embeddings de alta qualidade
```

---

### PROVIDER: AWS Bedrock
```
Provider:  AWS Bedrock
Models:    Via SDK Anthropic (extra)
SDK:       anthropic[bedrock]
Purpose:   Cloud enterprise gateway
Tier:      ENTERPRISE
Status:    DISPONÍVEL (não ativo)
Location:  E:\NIVEL 1\DATASTORE\MultiAgent_App\ (SDK metadata)
Hierarchy: ENTERPRISE GATEWAY
Notes:     SDK instalado com suporte, não configurado ativamente
```

---

### PROVIDER: Google Vertex AI
```
Provider:  Google Vertex AI
Models:    Via SDK Anthropic (extra)
SDK:       anthropic[vertex]
Purpose:   Cloud enterprise gateway
Tier:      ENTERPRISE
Status:    DISPONÍVEL (não ativo)
Location:  E:\NIVEL 1\DATASTORE\MultiAgent_App\ (SDK metadata)
Hierarchy: ENTERPRISE GATEWAY
Notes:     SDK instalado com suporte, não configurado ativamente
```

---

## RESUMO ESTATÍSTICO

| Métrica | Valor |
|---------|-------|
| Total Provedores | 11 ativos + 2 disponíveis |
| Total Modelos Nomeados | 12+ |
| Provedores Locais | 1 (Ollama) |
| Provedores Gratuitos/Freemium | 2 (Ollama, Groq) |
| Provedores Pagos Ativos | 6 |
| Gateways | 3 (OpenRouter, Bedrock, Vertex) |
| Especialistas em Embeddings | 1 (Voyage) |
| Sistemas com SECRET_DETECTED | 5 arquivos .env |

---

_Gerado por LLM_DISCOVERY_AND_INTEGRATION_V1 · 2026-06-05_
