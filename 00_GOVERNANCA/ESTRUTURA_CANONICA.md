# ESTRUTURA CANONICA DA FABRICA

**Status:** REFERENCIA OFICIAL
**Problema documentado:** Conflitos de numeracao nas pastas da raiz

---

## Estrutura Oficial (numeracao sem conflitos)

| Numero | Pasta Canonica | Proposito |
|---|---|---|
| 00 | 00_GOVERNANCA | Governanca, missao, valores, regras gerais |
| 01 | 01_RULES | Regras tecnicas e operacionais |
| 02 | 02_WORKFLOWS | Workflows e pipelines de cada fase |
| 03 | 03_SKILLS | Skills especializadas dos agentes |
| 04 | 04_CHECKLISTS | Checklists de qualidade |
| 05 | 05_AGENTS | Definicoes de agentes operacionais |
| 06 | 06_CORE_BASE | Base tecnica central (auth, db, deploy, etc) |
| 07 | 07_TEMPLATES | Templates de projetos |
| 08 | 08_CLIENTES | Perfis de clientes |
| 09 | 09_PROJETOS | Projetos modelo |
| 10 | 10_OPERATIONS | Scripts operacionais e de manutencao |
| 11 | 11_AUDITORIA | Auditoria e rastreabilidade |
| 12 | 12_TESTES | Testes e validacoes |
| 13 | 13_BACKUPS | Backups |
| 14 | 14_DOCUMENTACAO | Documentacao tecnica e de usuario |
| 15 | 15_PROJETOS | Projetos ativos em execucao |
| 16 | 16_SISTEMAS | Sistemas integrados (CLI, Orchestrator, etc) |
| 17 | 17_RUNTIME | Motores de execucao em tempo real |
| 18 | 18_EXPORTS | Exportacoes e entregas |
| 19 | 19_RELATORIOS | Relatorios e certificacoes |

---

## Pastas com Conflito de Numeracao (heranca historica)

Estas pastas existem na raiz com numeros duplicados.
Funcionalmente corretas, mas com prefixo fora do padrao.
A correcao de nomes requer atualizacao de referencias — a ser feita em revisao futura.

| Pasta Existente | Conflito com | Classificacao Correta |
|---|---|---|
| 05_HOSTING_PROFILE | 05_AGENTS | Deveria ser 05b ou renomeada para area de infraestrutura |
| 07_AGENTES | 07_TEMPLATES | Subdivisao de 05_AGENTS (agentes gerentes) |
| 08_PROMPTS | 08_CLIENTES | Deveria ser numerada fora do bloco 08 |
| 09_MEMORY | 09_PROJETOS | Deveria ser numerada fora do bloco 09 |
| 10_QA | 10_OPERATIONS | QA pertence ao fluxo de 12_TESTES |
| 12_DEPLOY | 12_TESTES | Deploy pertence a 16_SISTEMAS |
| 13_CERTIFICACOES | 13_BACKUPS | Certificacoes pertencem a 19_RELATORIOS |
| 15_COMMAND_CENTER | 15_PROJETOS | Command center e area de operacoes |
| 16_GITHUB | 16_SISTEMAS | Github e parte de 16_SISTEMAS |
| 17_AUTOMACOES | 17_RUNTIME | Automacoes pertencem a 10_OPERATIONS |
| 17_OBSIDIAN | 17_RUNTIME | Obsidian e integracao externa |
| 18_MODELOS | 18_EXPORTS | Modelos sao templates (07) |

---

## Plano de Correcao

As pastas com conflito NAO foram renomeadas automaticamente para evitar quebrar referencias.
Para corrigir: renomear cada pasta e atualizar todas as referencias nos scripts e documentos.
Prioridade: BAIXA (nao afeta funcionamento do runtime atual).

Responsavel: a definir
Data alvo: proxima revisao estrutural
