# LLM_HIERARCHY — Hierarquia Oficial
**Versão:** 1.0.0 | **Data:** 2026-06-05 | **Status:** OFFICIAL

---

## HIERARQUIA POR TIPO DE MISSÃO

### ARQUITETURA
```
1. DeepSeek V4 Pro  (raciocínio complexo, design de sistemas)
2. Claude           (revisão estrutural, escrita técnica)
3. GPT/Codex        (validação, compatibilidade)
4. Gemini           (documentação, pesquisa de patterns)
--- FALLBACK ---
5. Gemma 4 (local)
6. Llama/Ollama (local)
```

### CÓDIGO / PROGRAMAÇÃO
```
1. DeepSeek V4 Pro  (geração, refatoração, auditoria)
2. GPT/Codex        (revisão final, código crítico)
3. Claude Code      (refatoração assistida, análise de repo)
4. Gemini           (análise de arquivos, contexto amplo)
--- FALLBACK ---
5. Gemma 4 (local)
6. Llama/Ollama (local)
```

### AUDITORIA
```
1. DeepSeek V4 Pro  (análise profunda, raciocínio)
2. GPT/Codex        (validação cruzada)
3. Claude           (revisão de regras)
4. Gemini           (análise de documentos)
--- FALLBACK ---
5. Gemma 4 (local)
6. Llama/Ollama (local)
```

### DOCUMENTAÇÃO
```
1. Gemini           (geração ampla, documentação técnica)
2. Claude           (escrita refinada, estruturada)
3. GPT              (revisão fina)
4. DeepSeek         (contexto técnico)
--- FALLBACK ---
5. Gemma 4 (local)
6. Llama/Ollama (local)
```

### PESQUISA
```
1. Gemini           (motor de pesquisa, comparação)
2. GPT              (análise, síntese)
3. DeepSeek         (raciocínio sobre dados)
--- FALLBACK ---
4. Gemma 4 (local)
5. Llama/Ollama (local)
```

### MULTIMODAL / VISÃO
```
1. Gemini           (nativo multimodal)
2. GPT              (GPT-4o vision)
3. Claude           (análise de imagens)
--- FALLBACK ---
4. Sem modelo local disponível
```

### TAREFAS SIMPLES / RÁPIDAS
```
1. Gemma 4 (local)  (zero custo, rápido)
2. Llama/Ollama     (offline, gratuito)
3. Groq/DeepSeek    (econômico)
```

---

## STATUS OFICIAIS

| Status | Significado |
|--------|-------------|
| `ACTIVE_REAL` | Testado, funcionando, credencial verificada |
| `SUBSCRIPTION_OK` | Assinatura ativa, sem necessidade de API key |
| `API_KEY_REQUIRED` | Chave necessária, não configurada |
| `LOCAL_OK` | Serviço local funcionando |
| `CONFIG_REQUIRED` | Falta configuração, não tentativa de uso |
| `TEMPORARILY_UNAVAILABLE` | Indisponível temporariamente |
| `BLOCKED_BY_TERMS` | Uso bloqueado por termos de serviço |
| `FAILED_VALIDATION` | Falhou no teste de validação real |

---

## REGRA DE FALLBACK

```
SE provider_primario.status != ACTIVE_REAL:
    tentar próximo na hierarquia para aquele tipo de missão
    SE nenhum disponível:
        usar Gemma4/Ollama local
        registrar FALLBACK_USED no log
        NÃO quebrar o sistema
```

---

## PRIORIDADE DE ECONOMIA

```
1. Assinatura oficial Claude Code (se disponível)
2. Assinatura oficial ChatGPT/Codex (se disponível)
3. Plano Gemini disponível
4. APIs pagas (com autorização explícita)
5. Ollama/Gemma4 local (fallback gratuito)
```

---

_Fábrica de Sistemas · LLM_HIERARCHY · 2026-06-05_
