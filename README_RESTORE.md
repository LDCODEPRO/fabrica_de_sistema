# Política de Restore FORJA OS

1. Desligue os containeres (`docker-compose down`).
2. Substitua o `nexus.db` antigo pelo backup.
3. Restaure a pasta `19_RELATORIOS`.
4. Inicie novamente (`docker-compose up -d`).
