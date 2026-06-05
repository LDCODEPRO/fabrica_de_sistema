# LLM_PROVIDER_POLICY — Política de Uso de Providers
**Versão:** 1.0.0 | **Data:** 2026-06-05 | **Autoridade:** Fábrica de Sistemas

---

## REGRA 1 — VALIDAÇÃO OBRIGATÓRIA ANTES DO USO

Nenhum provider pode ser marcado como `active_real` sem:

1. Detecção de disponibilidade (health check)
2. Teste de chamada real (quando permitido)
3. Teste de erro controlado
4. Teste de bloqueio de custo (billing_guard)
5. Teste de não-vazamento de segredo
6. Registro em relatório de validação

---

## REGRA 2 — HIERARQUIA É OBRIGATÓRIA

O roteador DEVE seguir a hierarquia oficial definida em `LLM_HIERARCHY.md`.

Desvios somente permitidos por:
- Indisponibilidade comprovada do provider primário
- Restrição de custo (billing_guard)
- Restrição de tipo de tarefa (ex: multimodal)

---

## REGRA 3 — ASSINATURA ANTES DE API

```
ORDEM DE PREFERÊNCIA:
1. Claude Code (assinatura) — se disponível
2. ChatGPT Plus/Pro (assinatura) — se disponível
3. Gemini (plano disponível)
4. API paga com billing_guard ativo
5. Local (Ollama/Gemma4) — sem custo
```

---

## REGRA 4 — LOGS OBRIGATÓRIOS

Cada uso de LLM DEVE registrar:
- data/hora ISO 8601
- ID da missão
- Provider escolhido
- Modelo específico
- Motivo da escolha
- Status do provider
- Fallback usado (se houver)
- Custo estimado (quando aplicável)
- Resultado da validação

**NUNCA registrar:** API keys, tokens, senhas, sessões, cookies.

---

## REGRA 5 — COFRE DE SEGREDOS

Credenciais SOMENTE via:
- Variáveis de ambiente (`.env` fora do repositório)
- Cofre em `E:\` (referência por nome, nunca valor)

Se credencial ausente:
- NÃO quebrar o sistema
- Marcar provider como `CONFIG_REQUIRED`
- Registrar recomendação segura no log

---

## REGRA 6 — PROIBIÇÕES ABSOLUTAS

```python
PROIBIDO = [
    "cookies_de_navegador",
    "roubo_de_token_sessao",
    "automacao_login_escondido",
    "burlar_limite_plataforma",
    "fingir_assinatura_eh_api",
    "registrar_chave_em_log",
    "salvar_segredo_github",
    "marcar_ativo_sem_teste_real",
    "simular_resposta_como_real",
]
```

---

_Fábrica de Sistemas · LLM_PROVIDER_POLICY · 2026-06-05_
