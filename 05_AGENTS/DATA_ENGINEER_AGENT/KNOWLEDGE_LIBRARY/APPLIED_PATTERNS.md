# DATA_ENGINEER_AGENT — APPLIED PATTERNS

## Purpose
Concrete, reusable patterns applied by the DATA_ENGINEER_AGENT for database design, SQL optimization, ETL, and vector search within the Fábrica de Sistemas project.

---

## Pattern 1: Soft Delete with Partial Index

**Problem:** Hard deletes (physical row removal) lose audit history. But soft deletes (keeping rows with `deleted_at` column) make every query need `WHERE deleted_at IS NULL`, and indexing the full table wastes space.

**Solution:** Soft delete column + partial index.

```sql
-- Table definition
ALTER TABLE projects ADD COLUMN deleted_at TIMESTAMPTZ;

-- Partial index: only indexes non-deleted rows
CREATE INDEX idx_projects_active ON projects (user_id)
WHERE deleted_at IS NULL;

-- All normal queries automatically benefit:
SELECT * FROM projects WHERE user_id = $1 AND deleted_at IS NULL;
```

---

## Pattern 2: Upsert (INSERT ON CONFLICT) for Idempotent ETL

**Problem:** Re-running an ETL job must not create duplicate rows.

```sql
-- PostgreSQL upsert pattern
INSERT INTO dim_customer (customer_id, name, email, updated_at)
VALUES ($1, $2, $3, NOW())
ON CONFLICT (customer_id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    updated_at = NOW()
WHERE dim_customer.name IS DISTINCT FROM EXCLUDED.name
   OR dim_customer.email IS DISTINCT FROM EXCLUDED.email;
```

The `WHERE` clause prevents unnecessary I/O when the row hasn't actually changed.

---

## Pattern 3: SCD Type 2 Implementation

**Problem:** Track the full history of dimension changes (e.g., customer address changes).

```sql
CREATE TABLE dim_customer (
    sk          SERIAL PRIMARY KEY,  -- surrogate key
    customer_id INTEGER NOT NULL,    -- business/natural key
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    valid_from  DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to    DATE,                -- NULL = current record
    is_current  BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (customer_id, valid_from)
);

-- Expire old record and insert new
BEGIN;
UPDATE dim_customer
SET valid_to = CURRENT_DATE - 1, is_current = FALSE
WHERE customer_id = $1 AND is_current = TRUE;

INSERT INTO dim_customer (customer_id, name, email, valid_from, is_current)
VALUES ($1, $2, $3, CURRENT_DATE, TRUE);
COMMIT;
```

---

## Pattern 4: Window Function for Running Total and Ranking

```sql
-- Running total of sales by month
SELECT
    order_date,
    amount,
    SUM(amount) OVER (
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total
FROM fact_sales;

-- Rank customers by revenue within each region
SELECT
    customer_name,
    region,
    total_revenue,
    RANK() OVER (PARTITION BY region ORDER BY total_revenue DESC) AS revenue_rank
FROM customer_summary;
```

---

## Pattern 5: CTE-Based Query Decomposition

**Problem:** Complex analytical queries become unreadable with deeply nested subqueries.

```sql
-- Find customers who placed orders in both Jan and Feb 2026
WITH jan_customers AS (
    SELECT DISTINCT customer_id
    FROM orders
    WHERE order_date BETWEEN '2026-01-01' AND '2026-01-31'
),
feb_customers AS (
    SELECT DISTINCT customer_id
    FROM orders
    WHERE order_date BETWEEN '2026-02-01' AND '2026-02-28'
),
both_months AS (
    SELECT j.customer_id
    FROM jan_customers j
    INNER JOIN feb_customers f ON j.customer_id = f.customer_id
)
SELECT c.name, c.email
FROM customers c
INNER JOIN both_months b ON c.id = b.customer_id;
```

---

## Pattern 6: pgvector Semantic Search

**Full pattern for storing and querying embeddings in PostgreSQL:**

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Table with vector column
CREATE TABLE documents (
    id          SERIAL PRIMARY KEY,
    content     TEXT NOT NULL,
    source      TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    embedding   vector(1536)  -- OpenAI text-embedding-3-small dimension
);

-- HNSW index for fast ANN search (requires pgvector >= 0.5.0)
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Cosine similarity search (returns top 5 closest documents)
SELECT
    id,
    content,
    source,
    1 - (embedding <=> $1::vector) AS similarity
FROM documents
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

**Python ingestion:**
```python
import psycopg2

def upsert_document(conn, doc_id, content, embedding):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO documents (id, content, embedding)
            VALUES (%s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                content = EXCLUDED.content,
                embedding = EXCLUDED.embedding
        """, (doc_id, content, embedding))
    conn.commit()
```

---

## Pattern 7: Apache Airflow DAG Template for ETL Pipeline

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from datetime import datetime, timedelta

default_args = {
    "owner": "data_engineer",
    "depends_on_past": False,
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
    "email_on_failure": True,
}

with DAG(
    dag_id="etl_orders_daily",
    default_args=default_args,
    description="Daily ETL: load orders from source to DW",
    schedule_interval="0 3 * * *",   # 3 AM daily
    start_date=datetime(2026, 1, 1),
    catchup=False,
    tags=["etl", "orders"],
) as dag:

    def extract(**context):
        hook = PostgresHook(postgres_conn_id="source_db")
        df = hook.get_pandas_df("SELECT * FROM orders WHERE updated_at > %s", parameters=[context["data_interval_start"]])
        context["ti"].xcom_push("row_count", len(df))
        df.to_parquet(f"/tmp/orders_{context['ds']}.parquet", index=False)

    def load(**context):
        # load from parquet to DW
        ...

    t1 = PythonOperator(task_id="extract", python_callable=extract)
    t2 = PythonOperator(task_id="load", python_callable=load)

    t1 >> t2
```

---

## Pattern 8: Query Performance Diagnostic Workflow

```sql
-- 1. Identify slowest queries (requires pg_stat_statements)
SELECT
    LEFT(query, 80) AS query_snippet,
    calls,
    total_exec_time / calls AS avg_ms,
    rows / calls AS avg_rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;

-- 2. Get the full execution plan for a slow query
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT customer_id, SUM(amount)
FROM orders
WHERE created_at >= '2026-01-01'
GROUP BY customer_id;

-- 3. Check table and index sizes
SELECT
    relname AS table_name,
    pg_size_pretty(pg_total_relation_size(oid)) AS total_size
FROM pg_class
WHERE relkind = 'r'
ORDER BY pg_total_relation_size(oid) DESC
LIMIT 10;
```

---

*Last reviewed: 2026-06. Maintained by DATA_ENGINEER_AGENT.*
