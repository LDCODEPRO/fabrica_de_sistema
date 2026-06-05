# GEMINI — Motor de Pesquisa e Multimodal
**Posição:** 2º na hierarquia | **Data:** 2026-06-05

## IDENTIDADE
```
Provider:   Google
Models:     gemini-2.5-pro, gemini-2.5-flash, gemini-1.5-pro
Tier:       FREEMIUM → PAID
Position:   SECONDARY — Pesquisa, documentação, visão
```

## FUNÇÕES AUTORIZADAS
- Pesquisas e comparação de tecnologias
- Documentação técnica e estratégica
- Análise de arquivos (PDF, planilhas, código)
- Visão e análise multimodal
- Relatórios estratégicos
- Contexto muito longo (1M tokens)

## CONFIGURAÇÃO
```
env_var:    GOOGLE_API_KEY
base_url:   https://generativelanguage.googleapis.com
model_id:   gemini-2.5-pro (produção), gemini-2.5-flash (econômico)
context:    1M tokens (Pro)
```

## CRITÉRIO DE USO
- Usar como primeiro para documentação e pesquisa
- Usar para tarefas multimodais (imagens, PDFs)
- gemini-flash para tarefas rápidas/econômicas
- gemini-pro para análises profundas

## STATUS ATUAL
```
STATUS: API_KEY_REQUIRED
Evidência: E:\NIVEL 1\DATASTORE\Complexo_Nexus\.env (SECRET_DETECTED)
```
