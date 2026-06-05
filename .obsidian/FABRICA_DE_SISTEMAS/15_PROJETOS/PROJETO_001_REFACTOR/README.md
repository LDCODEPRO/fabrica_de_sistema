# LDCODE CMS - Refactored Version

## VisÃ£o Geral
Sistema de site institucional integrado a um painel administrativo (CMS) e chat. Esta versÃ£o refatorada pela FÃ¡brica de Sistemas foca em isolamento arquitetural e prontidÃ£o para produÃ§Ã£o (Ready for Production).

## Estrutura
O backend estÃ¡ centralizado em src/server.js e a interface pÃºblica estÃ¡ em public/.

## InstalaÃ§Ã£o
1. Clone o repositÃ³rio.
2. Execute 
pm install na raiz para baixar as dependÃªncias (package.json).
3. Copie o arquivo .env.example para .env e configure suas portas.

## ConfiguraÃ§Ã£o
Modifique o arquivo .env para o ambiente desejado:
NODE_ENV=development

## Deploy
O projeto pode ser servido via PM2 ou contÃªiner Docker rodando:

ode src/server.js

## Troubleshooting
- **Erro de Porta:** Verifique a variÃ¡vel PORT no seu .env.
- **Arquivos nÃ£o encontrados:** Assegure-se de que o express estÃ¡ servindo a pasta estÃ¡tica apontando para ../public corretamente no arquivo src/server.js.
