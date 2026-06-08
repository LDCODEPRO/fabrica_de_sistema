# CHANGELOG

## 2026-06-08 - FORJA_V008_PORTABILITY_AND_CHECKPOINT

- **Portabilidade de LLMs**: Criados templates de configuração `LLM_ENVIRONMENT_TEMPLATE.md` e `.env.llm.example` com placeholders seguros.
- **Script de Diagnóstico**: Criado `scripts/check_llm_environment.py` para verificar e reportar status do ambiente agêntico em qualquer PC.
- **Provider Center / Painel**: Adicionada seção de "Ambiente Atual" (Máquina, Caminho Raiz, Provedores Ativos/Pendentes, Daemon Local e Roteador) e banners de alerta em provedores de assinatura local.
- **Mapeamento de Health Checks**: Atualizado `provider_governance.py` para mapear status finos (`FAILED_CODE`, `ENVIRONMENT_PENDING`, `OFFLINE`, `CERTIFIED`) sem categorizar CLIs não autenticadas como `ERROR`.
- **Database Seeding**: Atualizada a inicialização em `_compat_db.py` para definir o status padrão como `ENVIRONMENT_PENDING` e recuperar automaticamente registros antigos marcados como `ERROR`.
- **Documentação de Setup**: Escrito `README_LLM_SETUP_OTHER_PC.md` com guia passo-a-passo.
- **Global Checkpoint**: Sincronização completa de backups, Obsidian, ZIP de portabilidade e certificação global V008.

## 2026-06-08 - FORJA_V007_STABILIZATION_AND_CERTIFICATION

- Agentic Core auditado antes de iniciar novos agentes.
- Criado teste reproduzivel `tests/test_forja_v007_certification.py`.
- Executada missao real `FORJA_V007_E2E_PROJECT_TEST` com Communication, Analyst, Architect, Developer, QA e Docs.
- Projeto teste criado em `09_PROJETOS/PROJETO_TESTE_V007`.
- Painel auditado e botoes sem acao real foram desativados/limitados.
- Bundle publicado: `app.panel.v012.js`.
- Testes consolidados executados: 23 passed.
- Save Law investigado e classificado como bloqueado por permissao de `.git`.
- Certificacao emitida: `FORJA_V007_BLOCKED_BY_ENVIRONMENT`.

## 2026-06-08 - FORJA_AGENTIC_CORE_V1

- Criado `18_FACTORY_ENGINE/AGENTIC_CORE` com planejador, roteador de ferramentas, permissoes, validacao, rollback e logs.
- Adicionadas tabelas reais `agent_actions` e `mission_events`.
- FastAPI recebeu endpoints reais `/api/agentic-core/*`.
- FORJA OS recebeu area `Nucleo Agentic` no painel, usando banco e API reais.
- Evidencias JSON geradas por acoes do nucleo.
- Testes executados: 10 passed no Agentic Core; 21 passed na suite consolidada.
- Frontend validado com `npm run build` e `npm test`.
- Save Law segue bloqueado por permissao do ambiente em `.git/index.lock`.

## 2026-06-05 - LLM_COST_ZERO_GOVERNANCE_V1

- Adicionada politica central de custo zero para LLMs.
- Separados providers em assinatura, local e API paga.
- DeepSeek V4 Pro priorizado como assinatura assistida.
- Ollama Local definido como automacao direta somente apos health real.
- APIs pagas bloqueadas por padrao.
- Billing Guard atualizado para exigir autorizacao, Secret Guard, health e custo conhecido.
- FORJA OS atualizada para remover custos e tokens simulados.
- Relatorios, Obsidian, Walkthrough, Current State e Roadmap atualizados.
- Commit/push tentados, mas bloqueados por permissao do ambiente em `.git/index.lock`.
