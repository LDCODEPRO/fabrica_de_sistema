# FORJA CHAT AGENT MEMORY REPORT

## 1. Estratégia de Sessão
Para que o `COMMUNICATION_AGENT` possua memória de contexto com o usuário, implementamos a arquitetura de *Chat Sessions*.

## 2. Tabelas
- **chat_sessions**: Agrupa o diálogo garantindo continuidade se o usuário fechar/abrir a aba.
- **chat_messages**: Grava timestamp estrito e armazena os papéis (`USER` / `AGENT`).

## 3. Próximos Passos (Agent Memories)
Com as fundações do banco sólidas, o `COMMUNICATION_AGENT` poderá usar sumarização periódica para preencher pastas lógicas de memória a longo prazo nas próximas iterações. Atualmente a persistência SQL nativa garante memória de curto e médio prazo na tabela `chat_messages`.
