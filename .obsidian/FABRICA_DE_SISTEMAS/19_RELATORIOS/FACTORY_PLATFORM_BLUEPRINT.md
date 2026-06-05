# FACTORY PLATFORM BLUEPRINT

**Versão:** 1.0.0
**Módulo Alvo:** `21_FACTORY_PLATFORM` (Novo Frontend / App)

A Fábrica de Sistemas consolidou o backend perfeito no `18_FACTORY_ENGINE`. Agora, precisamos de uma UI de controle supremo chamada `FACTORY PLATFORM V1`, que irá abrigar o `MONITOR 1`.

## Estrutura Obrigatória da Plataforma

A aplicação cliente será dividida nas seguintes zonas estratégicas:

1. **FACTORY_PLATFORM** (App Shell)
   - Contém a navegação central, autenticação e state management.
   - Design System: Luxuoso, Dinâmico, Responsivo e High-End (Glassmorphism e Dark Mode premium).

2. **MONITOR_1**
   - O cockpit em tempo real. Uma tela com as views consolidadas (talvez SSE / WebSockets para piscar na tela a criação de códigos e custos em tempo real).

3. **DASHBOARD**
   - Gráficos consumindo os `costs`, contadores e visão histórica dos projetos operados.

4. **PROJECT_CENTER**
   - Formulário de Inteligência de Intake. Aceita a "Ideia" do usuário e bate no `/project/create`, listando cards de projetos ativos.

5. **MISSION_CENTER**
   - Visão Kanban ou Lista de todas as Missões (Architecture, Implementation, Deploy).
   - Tasks rolando sob os Agentes.

6. **AGENT_CENTER**
   - Gerenciamento dos Agents (`ARCHITECT`, `DEVELOPER`, `QA`).
   - Visão de prompts alocados, memórias e evidências isoladas de cada um.

7. **LLM_CENTER**
   - Provider Registry interativo (Ligar/Desligar DeepSeek, OpenAI).
   - Gerenciamento visual do Billing Guard (hard limit/soft limit overrides).

8. **DEPLOY_CENTER**
   - Botão vermelho de "Ship It". 
   - Verifica `environment_validator` e libera os releases com logs explodindo na tela.

9. **AUDIT_CENTER**
   - Inspeção de segurança (Logs, Evidences, Zero Ghost Law). Se um LLM criar algo falso, será denunciado aqui.

10. **SETTINGS**
    - Chaves do sistema (cofre interface), limpezas de DB, reindexações.

## Próximo Passo
Construir o Frontend.
**Status:** READY TO BUILD.
