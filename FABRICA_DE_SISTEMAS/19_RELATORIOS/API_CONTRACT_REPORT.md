# API CONTRACT REPORT

**Status:** VALIDATED
**Módulo Avaliado:** `18_FACTORY_ENGINE/API`
**Framework:** FastAPI
**Data da Auditoria:** 2026-06-05

A Fábrica de Sistemas opera atualmente com os seguintes endpoints confirmados em código:

### Rotas de Leitura (GET)

1. `GET /status`
   - **Módulo Responsável:** `routes_agents.py`
   - **Descrição:** Retorna a prontidão básica da Fábrica.
   - **Status:** Operacional

2. `GET /dashboard`
   - **Módulo Responsável:** `routes_llm.py` (via DashboardEngine)
   - **Descrição:** Retorna a consolidação métrica (projetos ativos, llms, custos).
   - **Status:** Operacional

3. `GET /llm/status`
   - **Módulo Responsável:** `routes_llm.py`
   - **Descrição:** Retorna a saúde e disponibilidade real dos provedores (DeepSeek, Gemini, OpenAI, Claude, etc).
   - **Status:** Operacional

### Rotas de Escrita (POST)

4. `POST /project/create`
   - **Módulo Responsável:** `routes_projects.py`
   - **Descrição:** Recebe ideia, escopo, tecnologias e aciona o Intake Engine para geração de Blueprint.
   - **Status:** Operacional

5. `POST /mission/create`
   - **Módulo Responsável:** `routes_missions.py`
   - **Descrição:** Transforma o blueprint em alocação física de tarefas e missões (via Auto Orchestrator).
   - **Status:** Operacional
