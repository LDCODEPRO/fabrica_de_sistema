# NEXT PHASE BACKLOG

## Prioridades da Próxima Fase

A ordem ideal de execução para assegurar que a Fábrica de Sistemas possa de fato criar e orquestrar projetos com confiabilidade.

### 1. MISSION_EXECUTOR_V1
- **Descrição:** Motor para executar missões estruturadas passo a passo, garantindo que o agente respeite limites e gere saídas previsíveis.
- **Esforço:** Alto (necessita de parser de markdown rigoroso, state machine simples e logs)
- **Risco:** Alto (é o core que rodará qualquer missão e pode causar danos se não validar caminhos)
- **Dependências:** PROJECT_FACTORY_CLI (para interface base), PROJECT_ORCHESTRATOR (planejado)
- **Ordem Ideal:** 1º (Sem um executor de missões, não há como automatizar com segurança as etapas subsequentes)

### 2. STATUS_ENGINE_V1
- **Descrição:** Sistema de rastreamento de estado em tempo real para as missões e componentes da fábrica.
- **Esforço:** Médio (criação de arquivos de lock, snapshots de progresso e JSON/MD status logs)
- **Risco:** Baixo (operações de leitura e gravação leves, risco focado apenas em dessincronização)
- **Dependências:** MISSION_EXECUTOR_V1 (depende do executor para reportar o estado)
- **Ordem Ideal:** 2º (Crucial para não perder o rastreamento do progresso de execuções longas)

### 3. AUDIT_ENGINE_V1
- **Descrição:** Mecanismo de verificação de conformidade e integridade física/lógica da infraestrutura.
- **Esforço:** Médio (scripts de validação, mapeamento de diretórios esperados vs. reais)
- **Risco:** Baixo (apenas leitura e relatórios, não altera código)
- **Dependências:** STATUS_ENGINE_V1
- **Ordem Ideal:** 3º (Garante que a fábrica mantenha sua integridade após cada ciclo de projeto)

### 4. FACTORY_RUNTIME_V1
- **Descrição:** Ambiente de execução unificado, consolida CLI, regras de roteamento de IA, orquestração e runtime.
- **Esforço:** Muito Alto (integração de todas as peças em um loop contínuo)
- **Risco:** Muito Alto (ponto único de falha; qualquer erro compromete a fábrica inteira)
- **Dependências:** MISSION_EXECUTOR_V1, STATUS_ENGINE_V1, AUDIT_ENGINE_V1
- **Ordem Ideal:** 4º (O fechamento do loop; só pode ser construído sobre peças consolidadas)
