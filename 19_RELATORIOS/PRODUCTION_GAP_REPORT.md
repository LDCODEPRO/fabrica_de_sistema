# PRODUCTION_GAP_REPORT

Data: 2026-06-06

## Sistemas prontos hoje

- Leitura local de missões, agentes e auditoria pelo FastAPI consolidado.
- Servico HTTP Ollama e inventario de modelos.
- Adapters diretos de DeepSeek API, Gemini API e OpenAI API.
- Banco SQLite com integridade estrutural basica.
- Truth-status e painel sem as metricas falsas antigas.

## Sistemas parciais

- FORJA OS frontend.
- Runtime de missões.
- LLM Router.
- Billing.
- Agent Execution Engine.
- Docker/Compose.
- Database Core.

## Sistemas bloqueados

- Certificacao visual das telas em navegador.
- Execucao comprovada dos 11 agentes.
- DeepSeek V4 Pro exato.
- Assinaturas Gemini Advanced e ChatGPT Plus.
- Claude Pro nesta maquina.
- Deploy Docker real.

## Gaps

| Problema | Impacto | Prioridade | Estimativa | Responsavel |
| --- | --- | --- | --- | --- |
| Router oficial bloqueia Ollama com health `unknown` | Agentes automaticos nao recebem LLM | CRITICA | 4-8 h | AI Engineer |
| Resposta de agente nao possui validacao semantica | Evidencia pode certificar fatos falsos | CRITICA | 1-2 dias | QA + AI Engineer |
| Docker inicia API antiga | Deploy nao entrega FORJA consolidada | CRITICA | 4-8 h | DevOps |
| Healthchecks Docker usam rota errada | Containers ficam unhealthy | ALTA | 1-2 h | DevOps |
| `npm run build` padrao falha | Build local nao reproduzivel | ALTA | 2-4 h | Developer |
| Modo Vite dev nao existe | Decisao de arquitetura nao implementada | ALTA | 4-8 h | Frontend |
| `/api/audits` e `/api/billing` ausentes | Contrato exigido nao atendido | MEDIA | 1-2 h | Backend |
| FK orfa no `nexus.db` | Integridade referencial quebrada | ALTA | 1-2 h | Data Engineer |
| Billing nao registra chamadas atuais | Custo e tokens nao auditaveis | CRITICA | 1 dia | Backend + AI Engineer |
| Ordem real diverge da ordem definida | Provider incorreto pode ser usado | ALTA | 2-4 h | AI Engineer |
| Caminhos rigidos D:/E: | Portabilidade Windows/USB/VPS quebrada | ALTA | 1-2 dias | DevOps + Developer |
| Explorer sem backend | Tela nao representa filesystem real | MEDIA | 1 dia | Backend + Frontend |
| Projetos sem tabela | Centro de projetos vazio | ALTA | 1 dia | Data Engineer |
| Dependencia `httpx` ausente | Suite completa nao coleta | MEDIA | 30 min | QA |
| Navegador headless falha por GPU | Certificacao visual bloqueada no ambiente | MEDIA | 2-4 h | DevOps |

## O que falta para uso real

1. Unificar os dois routers e a classificacao dos providers.
2. Propagar health real do Ollama para o Router oficial.
3. Validar conteudo das respostas antes de marcar missao como concluida.
4. Integrar tokens/custos reais ao Billing Guard.
5. Corrigir Docker para iniciar `forja_os_server.py`.
6. Tornar build e desenvolvimento frontend reproduziveis.
7. Corrigir schema e chave estrangeira do banco.
8. Remover caminhos absolutos.
9. Executar e comprovar cada agente individualmente.
10. Repetir teste visual em ambiente de navegador funcional.

