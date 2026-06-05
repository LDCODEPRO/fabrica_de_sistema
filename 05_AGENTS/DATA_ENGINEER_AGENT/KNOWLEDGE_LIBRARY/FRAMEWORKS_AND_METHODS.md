# DATA_ENGINEER_AGENT — FRAMEWORKS AND METHODS

## Purpose
Structured methodologies and theoretical frameworks used by the DATA_ENGINEER_AGENT for database design, data architecture, query optimization, and pipeline management.

---

## 1. Normal Forms (Normalization Theory)

**Source:** E.F. Codd (1970–1974); extended by C.J. Date and others.

### First Normal Form (1NF)
- Each column contains atomic (indivisible) values.
- No repeating groups or arrays in cells.
- Each row is uniquely identifiable (primary key exists).

### Second Normal Form (2NF)
- Is in 1NF.
- Every non-key attribute is fully functionally dependent on the whole primary key (eliminates partial dependencies — relevant only for composite keys).

### Third Normal Form (3NF)
- Is in 2NF.
- No transitive dependencies: every non-key attribute depends only on the key, the whole key, and nothing but the key.
- **Target for OLTP schemas.**

### Boyce-Codd Normal Form (BCNF)
- Stronger than 3NF: every determinant is a candidate key.
- Eliminates remaining anomalies not addressed by 3NF in rare cases of overlapping composite candidate keys.

### Denormalization (for OLAP)
- Intentional violation of normal forms to improve read performance.
- Star schema (Kimball): fact tables + dimension tables — denormalized by design for analytical queries.

---

## 2. Dimensional Modeling (Kimball Methodology)

**Source:** Ralph Kimball & Margy Ross, "The Data Warehouse Toolkit" (3rd ed., 2013)

### Star Schema
```
          DIM_DATE
              |
DIM_CUSTOMER — FACT_SALES — DIM_PRODUCT
              |
          DIM_STORE
```
- **Fact table:** Quantitative measurements (sales_amount, quantity, cost). Each row represents an event or transaction.
- **Dimension tables:** Descriptive context (customer name, date, product category). Wide tables with many attributes.
- **Grain:** The most atomic level of detail in the fact table. Define grain before adding measures.

### Slowly Changing Dimensions (SCDs)
| Type | Behavior | Use Case |
|------|----------|----------|
| SCD Type 1 | Overwrite old value | Corrections, non-historical attributes |
| SCD Type 2 | Add new row with date range | Track full history of changes |
| SCD Type 3 | Add "previous value" column | Track one prior value only |
| SCD Type 4 | Mini-dimension for rapidly changing attrs | High-cardinality, volatile attributes |
| SCD Type 6 | Hybrid Type 1+2+3 | Track current + history in same row |

---

## 3. ACID Properties

**Source:** Jim Gray (1981); formalized in "Transaction Processing" by Gray & Reuter (1992)

| Property | Definition |
|----------|-----------|
| **Atomicity** | Transaction is all-or-nothing. On failure, all changes are rolled back. |
| **Consistency** | Transaction brings the database from one valid state to another. Constraints (FK, UNIQUE, CHECK) are respected. |
| **Isolation** | Concurrent transactions behave as if executed serially. Defined by isolation levels (Read Uncommitted → Read Committed → Repeatable Read → Serializable). |
| **Durability** | Once committed, the transaction is permanent even if the system crashes. Guaranteed via WAL/Write-Ahead Logging. |

---

## 4. CAP Theorem

**Source:** Eric Brewer, "Towards Robust Distributed Systems" (PODC 2000 keynote); formally proved by Gilbert & Lynch (2002).

**Theorem:** In a distributed system, you can guarantee at most two of the following three properties simultaneously:
- **Consistency (C):** Every read receives the most recent write or an error.
- **Availability (A):** Every request receives a response (not guaranteed to be the most recent).
- **Partition Tolerance (P):** The system continues operating despite network partitions.

**In practice:** Network partitions always happen → P is mandatory → choice is between C and A during partition events.

**Practical categories:**
- **CP systems:** PostgreSQL (with synchronous replication), HBase, Zookeeper. Sacrifice availability for consistency.
- **AP systems:** Cassandra, DynamoDB (eventual consistency), CouchDB. Sacrifice consistency for availability.

---

## 5. Query Optimization Fundamentals

**Source:** "Database Management Systems" (Ramakrishnan & Gehrke, 2003)

### Steps in query optimization:
1. **Parse:** SQL text → parse tree.
2. **Rewrite:** Logical equivalences applied (predicate pushdown, join reordering).
3. **Cost estimation:** Statistics (row counts, histograms, distinct values) used to estimate plan costs.
4. **Plan selection:** Lowest-cost plan chosen.

### Key techniques:
- **Predicate pushdown:** Apply `WHERE` filters as early as possible.
- **Index Nested Loop Join:** For small outer table, use index on inner table.
- **Hash Join:** For large tables with equality predicates; no index needed.
- **Sort-Merge Join:** For pre-sorted data or when both inputs need ordering.
- **EXPLAIN ANALYZE:** Shows actual vs. estimated rows — divergence indicates stale statistics.

### Index types in PostgreSQL:
| Index Type | Best For |
|-----------|----------|
| B-Tree | Range queries, equality, ORDER BY |
| Hash | Equality only (point lookups) |
| GIN | Full-text search, JSONB containment, arrays |
| GiST | Geometric data, ranges, full-text search |
| BRIN | Very large append-only tables (e.g., timestamps) |
| IVFFlat / HNSW (pgvector) | Approximate nearest neighbor (ANN) vector search |

---

## 6. ETL vs. ELT

| Aspect | ETL | ELT |
|--------|-----|-----|
| Transform step | Before loading | After loading into target |
| Best for | Legacy DWs, limited target compute | Cloud DWs (Snowflake, BigQuery, Redshift) |
| Complexity | Transformation logic in ETL tool | Transformation logic in SQL/dbt |
| Scalability | Limited by ETL server | Scales with target DW compute |

**Recommendation:** ELT with dbt for modern cloud data warehouse projects.

---

## 7. CDC (Change Data Capture)

**Source:** Martin Kleppmann, "Designing Data-Intensive Applications" (2017), Chapter 11

CDC captures every row-level change (insert/update/delete) in a source database and streams them to consumers (data lakes, search indexes, caches, event streams).

**Approaches:**
- **Timestamp-based:** Query `WHERE updated_at > last_run_time`. Simple but misses deletes; requires `updated_at` column.
- **Trigger-based:** Database triggers write changes to a changelog table. High overhead.
- **Log-based (preferred):** Read from database WAL/binlog (Debezium → Kafka). Low overhead, captures deletes, near-real-time.

**Tool:** Debezium (open source CDC connector for PostgreSQL, MySQL, Oracle, MongoDB → Apache Kafka).

---

*Last reviewed: 2026-06. Maintained by DATA_ENGINEER_AGENT.*
