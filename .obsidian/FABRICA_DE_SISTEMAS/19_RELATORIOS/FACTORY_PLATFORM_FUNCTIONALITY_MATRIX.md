# FACTORY PLATFORM FUNCTIONALITY MATRIX

Esta matriz avalia todas as exigências gráficas de interação da plataforma no navegador.

| Componente Visual | Funciona (UI)? | Dados reais (API/DB)? | Observação Crucial (Status) |
|-------------------|----------------|-----------------------|-----------------------------|
| **Menu: Painel Inicial** | NÃO | SIM | VISUAL SEM BACKEND / INEXISTENTE |
| **Menu: Projetos** | NÃO | SIM | VISUAL SEM BACKEND / INEXISTENTE |
| **Menu: Missões** | NÃO | SIM | VISUAL SEM BACKEND / INEXISTENTE |
| **Menu: Equipe** | NÃO | SIM | VISUAL SEM BACKEND / INEXISTENTE |
| **Menu: Conhecimento**| NÃO | SIM | VISUAL SEM BACKEND / INEXISTENTE |
| **Menu: Central de IA** | NÃO | SIM | VISUAL SEM BACKEND / INEXISTENTE |
| **Menu: Publicações** | NÃO | PARCIAL | VISUAL SEM BACKEND / INEXISTENTE |
| **Menu: Auditoria** | NÃO | SIM | VISUAL SEM BACKEND / INEXISTENTE |
| **Menu: Configurações**| NÃO | SIM | VISUAL SEM BACKEND / INEXISTENTE |
| **Chat Direto** | NÃO | SIM | VISUAL SEM BACKEND / INEXISTENTE |
| **Centro de Comandos** | NÃO | SIM | VISUAL SEM BACKEND / INEXISTENTE |

### Componentes Internos
1. **Cards do Dashboard (Saúde, Projetos Ativos, Custos):** A API `/dashboard` fornece a saúde real (ACTIVE_REAL para LLMs) e custos reais via `metrics_engine.py`. O UI do card, porém, é inexistente.
2. **Central de Missões (Listagem e Execução):** O Orchestrator salva PENDENTE/EM EXECUÇÃO no DB. A interface para clicar e ver a mudança não existe.
3. **Equipe Inteligente:** O Banco possui os agentes mapeados na API. UI não existe.
4. **Chat (Envio via LLM Router):** O `mission_runner` testa o LLM, mas não há um campo `<input>` físico ou botão `Enviar` construído.

**Classificação Predominante da Matriz UI:** INEXISTENTE / QUEBRADO.
**Classificação Predominante da Matriz Backend:** OPERACIONAL REAL.
