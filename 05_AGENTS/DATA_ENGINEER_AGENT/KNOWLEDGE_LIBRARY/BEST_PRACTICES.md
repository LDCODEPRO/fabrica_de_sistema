# DATA_ENGINEER_AGENT — BEST PRACTICES

## Purpose
Core best practices for database design, data modeling, SQL development, ETL pipelines, and data quality used by the DATA_ENGINEER_AGENT within the Fábrica de Sistemas project.

---

## 1. Data Modeling

- Normalize OLTP schemas to at least 3NF (Third Normal Form) to eliminate update anomalies.
- Denormalize deliberately for OLAP/reporting workloads — use star or snowflake schemas (Kimball methodology).
- Always define primary keys; use surrogate keys (auto-increment integers or UUIDs) for application entities.
- Foreign keys must be explicitly declared; rely on the database to enforce referential integrity, not application logic.
- Choose data types precisely: use `INTEGER` not `VARCHAR(10)` for numbers; use `DATE`/`TIMESTAMP WITH TIME ZONE` for temporal data; use `DECIMAL`/`NUMERIC` not `FLOAT` for monetary values.
- Document every table, column, and relationship in a data dictionary.

## 2. SQL Development

- Write queries that are readable first, then optimize. Never sacrifice readability for premature optimization.
- Use explicit column lists in `SELECT` — never `SELECT *` in production queries.
- Always use table aliases for multi-table queries; use meaningful aliases, not single letters for complex queries.
- Prefer set-based operations over row-by-row cursor loops.
- Use CTEs (Common Table Expressions) with `WITH` clauses to decompose complex queries into readable steps.
- Avoid scalar subqueries in `SELECT` lists for large datasets (N+1 problem in SQL).
- Use window functions (`ROW_NUMBER`, `RANK`, `LAG`, `LEAD`, `SUM OVER`) instead of self-joins for ranking and running totals.

## 3. Indexing Strategy

- Index foreign key columns automatically (most ORMs do not do this by default in PostgreSQL).
- Create indexes for columns appearing frequently in `WHERE`, `JOIN ON`, and `ORDER BY` clauses.
- Avoid over-indexing: each index slows down `INSERT`/`UPDATE`/`DELETE`. Aim for the minimum index set that satisfies query SLAs.
- Use partial indexes (`WHERE condition`) for filtered access patterns (e.g., `WHERE deleted_at IS NULL`).
- Use composite indexes; column order matters — most selective column first for equality predicates.
- Regularly run `EXPLAIN ANALYZE` to verify query plans and detect sequential scans on large tables.
- Monitor index bloat in PostgreSQL; `REINDEX` or `VACUUM ANALYZE` on a schedule.

## 4. Query Optimization

- Analyze slow query logs; use `pg_stat_statements` in PostgreSQL to identify the highest total-duration queries.
- Use `EXPLAIN (ANALYZE, BUFFERS)` before assuming an index will be used.
- Avoid implicit type casts in `WHERE` clauses — they prevent index use.
- Avoid `OR` conditions across different columns in `WHERE` — they often cause full table scans; consider `UNION ALL` instead.
- Use connection pooling (PgBouncer for PostgreSQL) to prevent connection exhaustion.

## 5. ETL / ELT Pipeline Design

- Prefer ELT over ETL when the target database is powerful enough (modern data warehouses): load raw data first, transform in-database.
- Idempotent loads: running a pipeline twice should produce the same result (upsert, not blind insert).
- Partition large fact tables by date for efficient time-range queries and data retention management.
- Implement watermarks and checkpoints for incremental loads — never full-reload multi-million-row tables unnecessarily.
- Validate data quality at ingestion: null checks, type checks, range checks, referential integrity checks.
- Log pipeline run metadata: start time, end time, rows processed, rows rejected, error details.

## 6. Backup and Recovery

- Follow the 3-2-1 rule: 3 copies, 2 different media, 1 offsite.
- Test restores regularly — a backup you have never restored is a backup you do not have.
- For PostgreSQL: use `pg_dump` for logical backups; use continuous WAL archiving (WAL-E, pgBackRest, Barman) for PITR (Point-In-Time Recovery).
- Define and enforce RTO (Recovery Time Objective) and RPO (Recovery Point Objective) per system.
- Encrypt backups at rest; restrict access to backup storage.

## 7. Vector Database Usage

- Use vector databases (Pinecone, pgvector, Chroma, Weaviate) specifically for similarity search — not as replacements for relational databases.
- Choose embedding model consistently: all vectors in a collection must come from the same model (dimension and distance metric must match).
- Index choice for pgvector: IVFFlat is faster to build; HNSW is faster to query. Use HNSW for production workloads.
- Always store the original text/content alongside vectors for retrieval — vectors alone are not human-readable.
- Define namespaces/collections per use case to avoid semantic mixing.

## 8. Data Security

- Apply column-level encryption for PII (Personally Identifiable Information).
- Use row-level security (RLS) in PostgreSQL to enforce tenant isolation at the database level.
- Audit access to sensitive tables with `pgaudit` extension or database audit logging.
- Never store plaintext passwords in user tables; store only password hashes.
- Apply GDPR/LGPD data minimization: only store personal data that is necessary.

---

*Last reviewed: 2026-06. Maintained by DATA_ENGINEER_AGENT.*
