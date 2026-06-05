# FACTORY PLATFORM REAL DATA AUDIT

Tabela de Origem e Realidade dos Dados baseada na infraestrutura exigida vs a infraestrutura construída:

| Tela | Componente | Dado exibido | Fonte Exigida | Fonte Atual | Classificação | Evidência |
|------|------------|--------------|---------------|-------------|---------------|-----------|
| Painel Inicial | Dashboard Cards | Projetos, Custos, Saúde | API `/dashboard` | Nenhum (Front não existe) | NÃO CONECTADO / QUEBRADO | Falta de repositório front |
| Central de IA | Provider Registry | Status DeepSeek, Gemini | API `/llm/status` | Nenhum (Front não existe) | NÃO CONECTADO / QUEBRADO | Falta de repositório front |
| Projetos | Lista de Projetos | `projects` do SQLite | DB Core / API | Nenhum (Front não existe) | NÃO CONECTADO / QUEBRADO | Falta de repositório front |
| Missões | Fila e Status | `missions` e `tasks` | DB Core / API | Nenhum (Front não existe) | NÃO CONECTADO / QUEBRADO | Falta de repositório front |

*Nota da Auditoria:* O dado em si existe no banco de dados e as rotas REST (`18_FACTORY_ENGINE/API`) retornam JSON real. O que está QUEBRADO é a camada que exibe o componente na tela para um ser humano. Sob a ótica do "Navegador Real", os componentes visuais são Inexistentes.
