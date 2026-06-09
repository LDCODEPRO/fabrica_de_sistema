# VERSION_V008_CHAT_STABLE_MANIFEST

## Metadados Gerais
- **Data:** 09 de Junho de 2026
- **Versão:** FORJA V008 CHAT STABLE
- **Estado Geral:** Operacional e Estável (Validações Verdes)

## Módulos Ativos (Plataforma FORJA OS)
- **Home / Workspace (home, forja):** Integrado e funcional.
- **Auditoria (auditoria):** Funcional (Zero Ghost Law ativa).
- **Roadmap (roadmap):** Visualização ativa da evolução real da plataforma.
- **Projetos, Missões e Equipes (projetos, missoes, equipes):** Estruturas lógicas criadas e visíveis.
- **LLMs, Ferramentas, Integrações e Configurações:** Cofres e mapeamentos de infraestrutura integrados.

## Providers Ativos (Reais e Funcionais)
- **claude_sub:** Ativo (Assinatura Claude CLI, via STDIN com timeout de 90s).
- **gemini_sub:** Ativo (Assinatura Gemini Advanced via script Playwright no navegador invisível).
- **openrouter_api:** Ativo (Gateway pago autorizado com chave e sem dados fictícios).

## Providers Pendentes / Offline
- **codex_sub:** Inativo/Pendente (Falha na automação de login do ChatGPT/Cookies expirados).
- **ollama_local:** Offline (Serviço local indisponível/desligado na máquina atual).
- **openai_api, claude_api, gemini_api, deepseek_api:** Bloqueados por governança (sem chave de API configurada no `.env`).

## Agentes Ativos (Operacionais no Core)
- **Orquestrador (orquestrador):** Coordena e distribui as missões.
- **Chat Elite Agent (chat):** Pair programming e chat direto no workspace.
- **Equipes de IA, Redes, Dados, Segurança e Documentação:** Mapeadas em `20_AGENTS/`.

## Status do Painel
- **Aparência:** Escuro/Claro customizável, paleta HSL e micro-animações ativas.
- **Uso Real:** Sem dados inventados ou fakes no dashboard (Zero Ghost Law).
- **Billing:** Configurado com limites diários de $1.00 USD e mensal de $30.00 USD.

## Status do Chat
- **Status:** ONLINE / FUNCIONAL.
- **Persistência:** Histórico de mensagens gravado diretamente no banco SQLite `nexus.db`.
- **Roteamento:** Provider Router integrado com fallbacks automáticos em caso de falha de conexão.
