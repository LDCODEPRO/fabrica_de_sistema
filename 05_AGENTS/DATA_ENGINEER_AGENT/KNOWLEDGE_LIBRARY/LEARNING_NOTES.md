# DATA_ENGINEER_AGENT — LEARNING NOTES

## Purpose
Evolving notes capturing lessons, trade-offs, and practical insights from applying database and data engineering knowledge. Updated as patterns are refined through real usage.

---

## Note 001 — NULL Is Not Zero or Empty String
**Date:** 2026-06
**Source:** Joe Celko, "SQL for Smarties" (4th ed.); C.J. Date, "Database in Depth"

NULL in SQL represents the absence of a value — it is not zero, not an empty string, and not false. Three-valued logic applies: TRUE, FALSE, and UNKNOWN. Any comparison with NULL returns UNKNOWN, not TRUE or FALSE.

```sql
-- All of these return no rows, even if a row has a NULL age:
SELECT * FROM users WHERE age = NULL;   -- wrong
SELECT * FROM users WHERE age != NULL;  -- wrong

-- Correct:
SELECT * FROM users WHERE age IS NULL;
SELECT * FROM users WHERE age IS NOT NULL;
```

**Practical implication:** Aggregation functions (`SUM`, `AVG`, `COUNT(col)`) ignore NULLs. `COUNT(*)` counts all rows; `COUNT(column)` counts non-NULL values in that column.

---

## Note 002 — Index on Foreign Keys in PostgreSQL
**Date:** 2026-06
**Source:** PostgreSQL documentation; personal experience with missing FK indexes

PostgreSQL does NOT automatically create an index on a foreign key column (unlike MySQL/InnoDB). This means joins on FK columns and cascading deletes on parent tables will scan the child table.

```sql
-- After creating the FK constraint:
ALTER TABLE orders ADD CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id);

-- Must manually add the index:
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
```

**Impact:** Missing FK indexes are a common source of slow JOIN queries and table locks during deletions of parent records.

---

## Note 003 — MVCC and Why PostgreSQL VACUUM Matters
**Date:** 2026-06
**Source:** "Database Management Systems" (Ramakrishnan & Gehrke); PostgreSQL internals documentation

PostgreSQL uses MVCC (Multi-Version Concurrency Control) for isolation. Reads never block writes; writes never block reads. The mechanism: each UPDATE creates a new row version (with `xmax` marking the old version as deleted). Old row versions (dead tuples) accumulate and must be physically removed by `VACUUM`.

Without regular vacuuming:
1. Table grows unboundedly (bloat).
2. Query performance degrades (more pages to scan).
3. `pg_stat_statements` visibility is affected.
4. Transaction ID wraparound can cause database shutdown (every PostgreSQL integer ID is 32-bit, ~2 billion).

**Lesson:** Enable `autovacuum`. Monitor `pg_stat_user_tables.n_dead_tup`. For write-heavy tables, tune `autovacuum_vacuum_scale_factor` downward (e.g., 0.01) so vacuum triggers more frequently.

---

## Note 004 — Choosing Between IVFFlat and HNSW in pgvector
**Date:** 2026-06
**Source:** pgvector GitHub documentation; Pinecone engineering blog

| Aspect | IVFFlat | HNSW |
|--------|---------|------|
| Build time | Faster | Slower (memory-intensive) |
| Query speed | Slower | Faster |
| Memory use | Lower | Higher |
| Recall | Lower by default | Higher by default |
| Tuning | `lists` (number of clusters) | `m` (connections per layer), `ef_construction` |

**Recommendation:** Use HNSW for production workloads where query latency matters. Use IVFFlat during development or when memory is constrained.

**HNSW tuning rule of thumb:**
- `m = 16` is a good default (higher = better recall, more memory).
- `ef_construction = 64` balances build time and index quality.
- Set `SET hnsw.ef_search = 100;` at query time for better recall.

---

## Note 005 — dbt Tests as Data Quality Gates
**Date:** 2026-06
**Source:** dbt documentation; dbt-labs blog

dbt's built-in schema tests (`not_null`, `unique`, `accepted_values`, `relationships`) are data quality assertions that run against the data warehouse after each transformation. Failing tests can block deployment pipelines.

```yaml
# models/schema.yml
models:
  - name: dim_customer
    columns:
      - name: customer_id
        tests:
          - not_null
          - unique
      - name: email
        tests:
          - not_null
      - name: status
        tests:
          - accepted_values:
              values: ["active", "inactive", "suspended"]
  - name: fact_orders
    columns:
      - name: customer_id
        tests:
          - relationships:
              to: ref('dim_customer')
              field: customer_id
```

**Lesson:** Run `dbt test` in the CI pipeline after `dbt run`. Treat test failures as build failures.

---

## Note 006 — Connection Pool Sizing
**Date:** 2026-06
**Source:** PgBouncer documentation; Percona blog; Brandon Sanderson (Citus/Microsoft) research

Each PostgreSQL connection is a separate OS process (~5-10 MB RAM). Allowing 100+ direct connections from an application tier is common but wasteful. PgBouncer in transaction-mode pooling allows thousands of application connections to share a small pool of actual PostgreSQL connections.

**Formula for pool size:**
```
Optimal connections ≈ (number of CPU cores * 2) + effective spindle count
```
For a 4-core server: 8–10 actual PostgreSQL connections are often sufficient for high throughput.

**PgBouncer modes:**
- **Session pooling:** Connection assigned for the full client session. Safe but low multiplexing.
- **Transaction pooling:** Connection assigned only during a transaction. High multiplexing; incompatible with prepared statements and advisory locks.

---

## Note 007 — Redis Key Expiration for Cache Invalidation
**Date:** 2026-06
**Source:** Redis documentation; Martin Fowler's "Patterns of Enterprise Application Architecture"

Cache invalidation is famously hard. For read-through caches in Redis, always set TTL (Time to Live) on every key. Never store cache entries without expiry — they will accumulate indefinitely until memory is exhausted.

```python
# Set value with 15-minute TTL
redis.setex(f"user:{user_id}:profile", 900, json.dumps(user_data))

# For cache-aside pattern: check cache first, populate on miss
def get_user(user_id):
    cached = redis.get(f"user:{user_id}:profile")
    if cached:
        return json.loads(cached)
    user = db.query("SELECT * FROM users WHERE id = %s", user_id)
    redis.setex(f"user:{user_id}:profile", 900, json.dumps(user))
    return user
```

**Lesson:** Add a small random jitter to TTL values (e.g., `900 + random.randint(0, 60)`) to prevent cache stampede (all keys expiring simultaneously under load).

---

*Last updated: 2026-06. Maintained by DATA_ENGINEER_AGENT.*
