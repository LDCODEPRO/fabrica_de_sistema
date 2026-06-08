import os

files = {
    "Dockerfile.backend": """FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "forja_os_server:app", "--host", "0.0.0.0", "--port", "8000"]
""",

    "Dockerfile.frontend": """FROM node:20-alpine AS build
WORKDIR /app
COPY 16_SISTEMAS/FORJA_OS_PLATFORM/package*.json ./
RUN npm install
COPY 16_SISTEMAS/FORJA_OS_PLATFORM .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
""",

    "docker-compose.yml": """version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    volumes:
      - ./nexus.db:/app/nexus.db
      - ./19_RELATORIOS:/app/19_RELATORIOS
    env_file:
      - .env.production
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    restart: unless-stopped
""",

    ".env.example": """# FORJA OS Environment
OLLAMA_URL=http://host.docker.internal:11434
OPENROUTER_API_KEY=
ANTHROPIC_API_KEY=
DATABASE_URL=sqlite:///./nexus.db
""",

    ".env.production.example": """# FORJA OS Production Environment
OLLAMA_URL=http://host.docker.internal:11434
OPENROUTER_API_KEY=your_production_key_here
ANTHROPIC_API_KEY=your_production_key_here
# DATABASE_URL=postgresql://user:password@db_host:5432/forja
DATABASE_URL=sqlite:///./nexus.db
""",

    "README_DEPLOY.md": """# Deploying FORJA OS

## Docker Compose (Recomendado)
1. Copie `.env.production.example` para `.env.production`.
2. Preencha as chaves de API.
3. Execute `docker-compose up -d --build`.

## Bancos de Dados
A aplicação roda por padrão com SQLite montado no volume `nexus.db`.
Para utilizar PostgreSQL, altere a variável `DATABASE_URL` no `.env.production`.
""",

    "README_BACKUP.md": """# Política de Backup FORJA OS

1. Realize uma cópia do arquivo `nexus.db`.
2. Realize a cópia da pasta `19_RELATORIOS` para preservar artefatos.
""",

    "README_RESTORE.md": """# Política de Restore FORJA OS

1. Desligue os containeres (`docker-compose down`).
2. Substitua o `nexus.db` antigo pelo backup.
3. Restaure a pasta `19_RELATORIOS`.
4. Inicie novamente (`docker-compose up -d`).
"""
}

for name, content in files.items():
    with open(name, "w", encoding="utf-8") as f:
        f.write(content)
