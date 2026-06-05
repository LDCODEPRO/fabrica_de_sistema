# DATA_ENGINEER_AGENT — TOOLS AND STANDARDS

## Purpose
Real tools and standards used by the DATA_ENGINEER_AGENT for data storage, transformation, orchestration, and quality management.

---

## Relational Databases

### PostgreSQL
- **URL:** https://www.postgresql.org/
- **Type:** Open-source ORDBMS (Object-Relational Database Management System)
- **Version (current stable):** 16.x
- **Key features:** Full SQL:2016 compliance, MVCC (Multi-Version Concurrency Control), JSONB (binary JSON with indexing), full-text search, range types, table partitioning, logical replication, row-level security (RLS), `pgvector` extension for vector similarity search.
- **Extensions relevant to this project:** `pgvector` (vector search), `pg_stat_statements` (query stats), `pgaudit` (audit logging), `postgis` (geospatial), `pg_cron` (scheduled jobs).
- **Connection pooling:** PgBouncer (transaction-mode pooling for high concurrency).
- **Backup:** `pg_dump`, `pg_basebackup`, `pgBackRest`, Barman (continuous WAL archiving + PITR).

### SQLite
- **URL:** https://www.sqlite.org/
- **Type:** Embedded, serverless relational database
- **Use cases:** Local development, testing, edge deployments, single-user applications, prototyping.
- **Key properties:** Single file database, zero-configuration, ACID-compliant (WAL mode), serverless (library embedded in application).
- **Limitations:** Not suitable for high-concurrency write workloads; no built-in network access.

---

## Caching and Key-Value Stores

### Redis
- **URL:** https://redis.io/
- **Type:** In-memory data structure store
- **Data structures:** Strings, Hashes, Lists, Sets, Sorted Sets, Streams, HyperLogLog, Bitmaps, Geospatial indexes.
- **Use cases:** Caching (LRU/LFU eviction), session storage, rate limiting (Sliding window + Redis sorted sets), pub/sub messaging, job queues (Redis Streams, BullMQ).
- **Persistence:** RDB (point-in-time snapshots) and AOF (Append-Only File, durable log).
- **Clustering:** Redis Cluster for horizontal sharding + replication.

---

## Vector Databases

### Pinecone
- **URL:** https://www.pinecone.io/
- **Type:** Managed vector database (SaaS)
- **Key features:** Serverless and pod-based tiers, namespaces for multi-tenancy, metadata filtering alongside vector search, hybrid search (sparse + dense vectors).
- **Use cases:** RAG (Retrieval-Augmented Generation) knowledge bases, semantic search, recommendation systems.

### pgvector
- **URL:** https://github.com/pgvector/pgvector
- **Type:** PostgreSQL extension for vector similarity search
- **Key features:** Store vectors as columns in PostgreSQL tables, `<->` (L2 distance), `<#>` (inner product), `<=>` (cosine distance) operators.
- **Index types:** IVFFlat (inverted file index — faster to build), HNSW (Hierarchical Navigable Small World — faster to query, added in pgvector 0.5.0).
- **Best for:** Projects already using PostgreSQL that want to avoid an additional vector DB dependency.

### Chroma
- **URL:** https://www.trychroma.com/
- **Type:** Open-source embedding database
- **Key features:** Embeddable (in-process) or client/server mode, Python and JavaScript clients, built-in embedding functions, metadata filtering.
- **Best for:** Local development and prototyping for RAG applications.

### Weaviate
- **URL:** https://weaviate.io/
- **Type:** Open-source vector database
- **Key features:** GraphQL API, multi-modal (text, images), hybrid search (BM25 + vector), built-in vectorization modules.

---

## Data Transformation

### dbt (data build tool)
- **Vendor:** dbt Labs (open source + cloud offering)
- **URL:** https://docs.getdbt.com/
- **Type:** SQL-based data transformation framework
- **Key concepts:** Models (`.sql` files that define transformations), sources (raw data declarations), tests (schema tests + singular data tests), documentation (auto-generated), seeds (CSV-to-table loaders), snapshots (SCD Type 2 automation).
- **Execution:** Runs SQL against the target data warehouse; not a data mover.
- **Best for:** ELT transformations in SQL within data warehouses (Snowflake, BigQuery, Redshift, PostgreSQL).

---

## Data Orchestration

### Apache Airflow
- **URL:** https://airflow.apache.org/
- **Type:** Workflow orchestration platform
- **Key concepts:** DAGs (Directed Acyclic Graphs), Operators (PythonOperator, BashOperator, SQLOperator, etc.), Hooks (database connections), XComs (inter-task data passing), TaskGroups, dynamic DAGs.
- **Deployment:** Docker Compose for dev; Kubernetes (KubernetesExecutor or CeleryExecutor) for production.
- **Managed options:** Google Cloud Composer, AWS MWAA (Managed Workflows for Apache Airflow), Astronomer.

---

## Database Clients

### DBeaver
- **URL:** https://dbeaver.io/
- **Type:** Universal database GUI client (open source + enterprise edition)
- **Supports:** PostgreSQL, MySQL, SQLite, Oracle, SQL Server, MongoDB, Redis, Cassandra, and 80+ databases.
- **Key features:** SQL editor with autocomplete, ER diagrams, data export (CSV, Excel, JSON), query history, SSH tunneling, JDBC-based driver system.

---

## Standards

### SQL:2016 (ISO/IEC 9075:2016)
- Current SQL standard. Introduced JSON table functions, row pattern recognition, polymorphic table functions.

### ACID Properties
- Atomicity, Consistency, Isolation, Durability — the foundational properties of relational database transactions.

### Normalization Forms (1NF through BCNF)
- 1NF, 2NF, 3NF, BCNF — formal mathematical framework for eliminating data anomalies.

### CAP Theorem
- Eric Brewer (2000): Consistency, Availability, Partition Tolerance — choose two.

### PACELC
- Extension of CAP by Daniel Abadi (2012): when no partition (normal operation), systems trade off Latency vs. Consistency.

---

*Last reviewed: 2026-06. Maintained by DATA_ENGINEER_AGENT.*
