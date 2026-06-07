# Deploying FORJA OS

## Docker Compose (Recomendado)
1. Copie `.env.production.example` para `.env.production`.
2. Preencha as chaves de API.
3. Execute `docker-compose up -d --build`.

## Bancos de Dados
A aplicação roda por padrão com SQLite montado no volume `nexus.db`.
Para utilizar PostgreSQL, altere a variável `DATABASE_URL` no `.env.production`.
