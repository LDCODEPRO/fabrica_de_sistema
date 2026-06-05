# SYSTEM FACTORY ENGINE ARCHITECTURE

**Versão:** 1.0.0
**Módulos Ativos:** 10

## Componentes

1. **PROJECT INTAKE:** Classifica ideias, seleciona a tech stack e gera Blueprints estruturados.
2. **AUTO ORCHESTRATOR:** Consome Blueprints, gera Missões baseadas no escopo e quebra em Tarefas atribuíveis aos Agentes da Fábrica.
3. **EXECUTION ENGINE V2:** Dispara tarefas reais via LLM Router, gravando logs oficiais e Evidências no Database Core.
4. **QA GATE:** Verifica os artefatos de código, audita conformidade (Zero Ghost) e emite certificados.
5. **DEPLOY GATE:** Valida ambiente e provisiona logs de release.
6. **FACTORY DASHBOARD:** Analisa saúde global, uso de APIs e custos.
7. **FACTORY API:** Motor FastAPI expondo endpoints integrados (`/project/create`, `/dashboard`, etc).
8. **FACTORY DATABASE:** Extensão do `22_DATABASE_CORE` (Tasks, Artifacts, Deployments).
9. **TEST & GOVERNANCE:** Suíte de validações e políticas operacionais (Pytest).

## Fluxo de Dados
[Ideia] -> **API** -> **Intake** -> Blueprint -> **Orchestrator** -> Missions/Tasks -> **Execution Engine** -> Artifacts -> **QA Gate** -> Certified -> **Deploy Gate** -> Production.
