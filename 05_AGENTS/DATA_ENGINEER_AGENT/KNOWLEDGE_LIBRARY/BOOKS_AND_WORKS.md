# DATA_ENGINEER_AGENT — BOOKS AND WORKS

## Purpose
Canonical books, papers, and standards forming the DATA_ENGINEER_AGENT reading list.

---

## Foundational Books

### Designing Data-Intensive Applications
- **Author:** Martin Kleppmann
- **Publisher:** O'Reilly Media, 2017
- **ISBN:** 978-1449373320
- **Why it matters:** The essential modern reference for anyone building systems that store, process, or move data. Covers storage engines (B-trees, LSM-trees), encoding formats (JSON, Avro, Protobuf), replication (leader-follower, multi-leader, leaderless), partitioning, transactions (ACID, MVCC, distributed transactions), consistency and consensus, batch processing (MapReduce, data flow), and stream processing (Kafka, Flink). Exceptionally well-written and dense with real-world insight.

### Joe Celko's SQL for Smarties: Advanced SQL Programming (4th Edition)
- **Author:** Joe Celko
- **Publisher:** Morgan Kaufmann, 2010
- **ISBN:** 978-0123820228
- **Why it matters:** The advanced SQL reference beyond basic CRUD. Covers set theory foundations, NULL handling edge cases, self-referencing tables, temporal data modeling, hierarchies in SQL, SQL anti-patterns, and complex aggregation patterns. Required for writing production SQL at professional standards.

### Database in Depth: Relational Theory for Practitioners
- **Author:** C.J. Date
- **Publisher:** O'Reilly Media, 2005
- **ISBN:** 978-0596100124
- **Why it matters:** Short but dense book explaining the relational model rigorously. Clarifies what 1NF/2NF/3NF/BCNF actually mean mathematically, explains the domain-key normal form, and makes clear why SQL's NULLs are problematic. Essential for understanding the "why" behind database design rules.

### The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling (3rd Edition)
- **Authors:** Ralph Kimball, Margy Ross
- **Publisher:** Wiley, 2013
- **ISBN:** 978-1118530801
- **Why it matters:** The reference for designing star schemas, dimensional models, and data warehouses. Covers fact tables (additive, semi-additive, non-additive facts), dimension tables (SCD Type 1/2/3/4/6, junk dimensions, role-playing dimensions, outrigger dimensions), bus matrix for enterprise DW integration, and ETL subsystem design patterns. Kimball's methodology is implemented in virtually every modern analytics platform.

### Database Management Systems (3rd Edition)
- **Authors:** Raghu Ramakrishnan, Johannes Gehrke
- **Publisher:** McGraw-Hill, 2003
- **ISBN:** 978-0072465631
- **Why it matters:** Comprehensive academic textbook covering all database fundamentals: relational algebra, SQL, storage (heap files, B+ trees, hash indexes), external sorting, query processing (nested loops, sort-merge, hash joins), query optimization (System R algorithm, statistics, histograms), transaction management (2PL, MVCC), logging and recovery (ARIES algorithm). The deepest dive into how databases actually work internally.

---

## Data Engineering Specific

### Fundamentals of Data Engineering: Plan and Build Robust Data Systems
- **Authors:** Joe Reis, Matt Housley
- **Publisher:** O'Reilly Media, 2022
- **ISBN:** 978-1098108304
- **Why it matters:** Modern data engineering lifecycle: data generation → ingestion → storage → transformation → serving. Covers batch vs. streaming, data lake/warehouse/lakehouse architectures, choosing the right data stack (Airflow, dbt, Spark, Kafka, Snowflake), and data orchestration patterns.

### The Kimball Group Reader: Relentlessly Practical Tools for Data Warehousing and Business Intelligence
- **Authors:** Ralph Kimball, Margy Ross, Warren Thornthwaite, Joy Mundy, Bob Becker
- **Publisher:** Wiley, 2010
- **ISBN:** 978-0470563106
- **Why it matters:** Collection of Kimball Group columns from Intelligent Enterprise magazine (1996–2010). Hundreds of practical case studies and design pattern discussions that extend the Toolkit book with real-world application.

---

## Academic Papers and Standards

### "A Relational Model of Data for Large Shared Data Banks" (1970)
- **Author:** E.F. Codd
- **Published in:** Communications of the ACM, Vol. 13, No. 6
- **Why it matters:** The foundational paper that introduced the relational model. Every relational database in existence is an implementation of this paper's ideas.

### "ARIES: A Transaction Recovery Method Supporting Fine-Granularity Locking and Partial Rollbacks" (1992)
- **Authors:** C. Mohan, Don Haderle, Bruce Lindsay, Hamid Pirahesh, Peter Schwarz
- **Published in:** ACM Transactions on Database Systems
- **Why it matters:** Defines the WAL (Write-Ahead Logging) protocol and ARIES recovery algorithm implemented by virtually every modern database (PostgreSQL, MySQL/InnoDB, SQL Server). Understanding ARIES clarifies how databases guarantee durability and recover from crashes.

### SQL:2016 Standard (ISO/IEC 9075)
- **Publisher:** ISO/IEC
- **Why it matters:** The current SQL standard. Features added in recent revisions: JSON support (SQL:2016), temporal tables (SQL:2011), window functions (SQL:2003), CTEs and MERGE (SQL:1999). Knowledge of the standard clarifies which features are standard SQL vs. dialect-specific extensions.

---

*Last reviewed: 2026-06. Maintained by DATA_ENGINEER_AGENT.*
