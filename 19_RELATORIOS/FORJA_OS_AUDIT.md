# FORJA_OS_AUDIT

Data: 2026-06-06

## Status geral

FORJA_OS_STATUS: PARCIAL

## Frontend

Classificacao: FUNCIONANDO PARCIALMENTE

Evidencias:

- O build isolado compilou em 70 ms e gerou bundle de 248,9 KB.
- A auditoria estatica retornou `STATIC_AUDIT_OK`.
- O comando padrao equivalente a `npm run build` falhou com `EPERM` ao escrever `scripts/generated-entry.jsx`.
- O projeto nao possui script `npm run dev` nem Vite.
- O `dist` existente foi servido pelo FastAPI com HTTP 200.

## Backend FastAPI

Classificacao: FUNCIONANDO

Evidencias:

- `test_forja_os_foundation.py`: 17 testes aprovados, 0 falhas.
- Servidor real iniciado em porta isolada.
- Logs confirmaram startup e requisicoes HTTP.
- O frontend estatico foi montado por `forja_os_server.py`.

## Endpoints obrigatorios

| Endpoint solicitado | HTTP | Classificacao |
| --- | ---: | --- |
| `/api/missions` | 200 | FUNCIONANDO |
| `/api/agents` | 200 | FUNCIONANDO |
| `/api/audits` | 404 | NAO ENCONTRADO |
| `/api/billing` | 404 | NAO ENCONTRADO |

Endpoints equivalentes existentes:

- `/api/audit`: HTTP 200.
- `/api/billing/status`: HTTP 200.

## Integracao real

Classificacao: FUNCIONANDO PARCIALMENTE

- Missões, agentes, auditoria e dashboard leem `nexus.db`.
- Providers leem o registry e consultam Ollama em tempo real.
- O frontend usa API na mesma origem.
- Quando a API falha ou retorna lista vazia, a tela pode manter fallback `window.FORJA`.
- Explorer nao possui endpoint de arquivos real.
- Projetos retornam lista vazia porque nao existe tabela de projetos.

## Telas

| Tela | Evidencia | Status |
| --- | --- | --- |
| Painel inicial | Codigo e endpoint existem; navegador nao renderizou por falha de GPU | FUNCIONANDO PARCIALMENTE |
| Projetos | Endpoint retorna vazio honesto | FUNCIONANDO PARCIALMENTE |
| Missoes | Endpoint real e runtime testado | FUNCIONANDO |
| Equipe | 11 agentes retornados do banco | FUNCIONANDO PARCIALMENTE |
| Central de IA | Registry e health Ollama respondem | FUNCIONANDO PARCIALMENTE |
| Auditoria | `/api/audit` funciona; plural nao existe | FUNCIONANDO PARCIALMENTE |
| Centro de Comandos | Componente existe; interacao nao validada | NAO FUNCIONANDO SEM EVIDENCIA |
| Explorer | Sem backend real de exploracao | NAO FUNCIONANDO |
| Billing | Le arquivo de ledger, mas chamadas atuais nao foram registradas | FUNCIONANDO PARCIALMENTE |

## Browser e logs

- Chrome headless falhou antes da renderizacao por erro fatal de GPU.
- Edge headless falhou antes da renderizacao pelo mesmo motivo.
- Nenhuma screenshot valida foi produzida.
- Logs HTTP do FastAPI foram coletados e confirmam respostas 200/404.

## Mocks, fallback e hardcode

- O frontend mantem fallback estatico deliberado.
- Budget de US$ 1/dia e US$ 30/mes esta hardcoded.
- CORS esta hardcoded no Python.
- O bundle antigo pode continuar servindo quando o novo build falha.

