# DATABASE_CORE_V1

O **Database Core** é o núcleo oficial de dados da Fábrica de Sistemas. Ele consolida todos os registros de projetos, missões, agentes, LLMs e evidências em um ambiente de produção rigoroso e rastreável.

## Princípios
* **SOURCE OF TRUTH LAW:** Nenhuma métrica ou projeto oficial existe fora deste banco.
* **PRODUCTION READY BY DEFAULT:** Sem "exemplos". Esquema fortemente tipado.
* **SECURITY FIRST:** Sem segredos. Todas as credenciais de provedores ficam em cofres virtuais ou referências cifradas, o banco armazena apenas `secret_ref`.

## Estrutura
- `migrations/`: Scripts DDL versionados.
- `repositories/`: Classes de acesso a dados (CRUD).
- `services/`: Classes de lógica de negócios, controlam integrações.
- `scripts/`: Ferramentas de backup, restore e health check (PowerShell).

## Padrão de Tabelas
Todas as tabelas seguem o padrão mínimo:
- `id`: TEXT (UUID) PRIMARY KEY
- `created_at`: TIMESTAMP (Default: Current UTC Timestamp)
- `updated_at`: TIMESTAMP (Atualizado via trigger ou manager)
- `status`: TEXT
- `metadata_json`: TEXT (Para extensibilidade)
