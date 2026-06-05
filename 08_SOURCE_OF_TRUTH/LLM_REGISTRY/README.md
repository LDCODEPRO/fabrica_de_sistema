# LLM_REGISTRY — Source of Truth
**Versão:** 1.0.0  
**Data:** 2026-06-05  
**Autoridade:** Fábrica de Sistemas

---

## PROPÓSITO

Registro oficial e imutável das regras, hierarquia, políticas e status de todos os provedores LLM autorizados pela Fábrica de Sistemas.

> As LLMs são os **motores cognitivos principais** do sistema.  
> Nenhuma LLM pode ser usada de forma fantasma, simulada ou sem registro real.

---

## HIERARQUIA OFICIAL

| Posição | Provider | Função Principal |
|---------|----------|-----------------|
| 1º | DeepSeek V4 Pro | Motor principal — arquitetura, código, raciocínio |
| 2º | Gemini | Pesquisa, documentação, multimodal |
| 3º | OpenAI GPT / Codex | Validação, código crítico, revisão |
| 4º | Claude / Claude Code | Engenharia assistida, escrita técnica |
| 5º | Gemma 4 (local) | Motor local / fallback leve |
| 6º | Llama / Ollama | Fallback gratuito / offline |

---

## ARQUIVOS DESTE REGISTRY

| Arquivo | Conteúdo |
|---------|----------|
| [LLM_HIERARCHY.md](LLM_HIERARCHY.md) | Hierarquia completa e regras de roteamento |
| [DEEPSEEK_V4_PRO.md](DEEPSEEK_V4_PRO.md) | Especificação do motor principal |
| [GEMINI.md](GEMINI.md) | Especificação Gemini |
| [OPENAI_GPT_CODEX.md](OPENAI_GPT_CODEX.md) | Especificação OpenAI |
| [CLAUDE_CODE.md](CLAUDE_CODE.md) | Especificação Claude / Claude Code |
| [GEMMA4.md](GEMMA4.md) | Especificação Gemma 4 local |
| [LLAMA_OLLAMA.md](LLAMA_OLLAMA.md) | Especificação Llama/Ollama |
| [LLM_PROVIDER_POLICY.md](LLM_PROVIDER_POLICY.md) | Política de uso de providers |
| [LLM_COST_POLICY.md](LLM_COST_POLICY.md) | Política de economia e custo |
| [LLM_SECURITY_POLICY.md](LLM_SECURITY_POLICY.md) | Política de segurança e segredos |

---

## PROIBIÇÕES ABSOLUTAS

```
❌ Usar cookies de navegador para autenticação
❌ Roubar token de sessão
❌ Automatizar login escondido
❌ Burlar limite de plataforma
❌ Fingir que assinatura é API
❌ Registrar chave em log
❌ Salvar segredo no GitHub
❌ Marcar provider como ativo sem teste real
❌ Simular resposta de LLM como execução real
```

---

_Fábrica de Sistemas · Source of Truth · 2026-06-05_
