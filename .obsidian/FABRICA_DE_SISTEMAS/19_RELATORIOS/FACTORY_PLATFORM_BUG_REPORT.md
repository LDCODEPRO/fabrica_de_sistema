# FACTORY PLATFORM BUG REPORT

**Data:** 2026-06-05
**Severidade:** CRÍTICA (BLOCKER)

## BUG: Aplicação Frontend Inexistente (Missing UI)

**Descrição:**
A missão solicitou abrir o navegador real e validar o comportamento visual (cliques, layouts, responsividade, DevTools console) do `FACTORY_PLATFORM_V1`. Contudo, verificou-se através de varredura no repositório (`Get-ChildItem -Path D:\fabricadesistema`) que a camada de frontend web (Next.js, React, Vite ou HTML estático) não foi implementada ou *scaffoldada*.

**Impacto:**
- **Zero Ghost Law:** É impossível certificar "botões funcionais" ou "chat real no navegador" se a página web `.html/.js` não existe.
- A plataforma não pode ser usada por usuários não-técnicos, pois o acesso atual se restringe via rotas cruas (`curl` ou `Swagger UI` no `localhost:8000/docs`).

**Causa Raiz:**
A missão anterior parou na criação do Blueprint da Interface e dos Contratos JSON (API e DB), sem proceder com a criação real do `package.json` e componentes React na pasta `21_FACTORY_PLATFORM`.

**Resolução Recomendada:**
Iniciar imediatamente a Missão de construção do Web App (`FACTORY_PLATFORM_V1_BUILD`) usando `npx create-vite` ou `npx create-next-app` na raiz do módulo `21_FACTORY_PLATFORM` para conectar os fios à `FACTORY_API` existente.
