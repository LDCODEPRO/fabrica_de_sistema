# DATA_ENGINEER_AGENT — MASTERS AND REFERENCES

## Purpose
Key authors and researchers whose work forms the theoretical and practical foundation of the DATA_ENGINEER_AGENT's database and data engineering knowledge.

---

## Joe Celko

**Role:** SQL expert, author, standards contributor. Participated in the ANSI SQL standards committee (SQL-86 through SQL-92). Wrote the first SQL puzzle column in DBMS Magazine (1989–2000).

**Key works:**
- "Joe Celko's SQL for Smarties: Advanced SQL Programming" (Morgan Kaufmann, 4th ed., 2010) — comprehensive advanced SQL reference covering set theory, NULL handling, hierarchies, temporal data, and SQL anti-patterns.
- "Joe Celko's SQL Programming Style" (Morgan Kaufmann, 2005) — naming conventions, formatting, code organization.
- "Joe Celko's Trees and Hierarchies in SQL for Smarties" (Morgan Kaufmann, 2004) — adjacency lists, nested sets, closure tables.
- "Joe Celko's Thinking in Sets" (Morgan Kaufmann, 2008) — set-based vs. procedural thinking in SQL.

**Core ideas:**
- SQL is a set-based language; thinking in sets (not rows) is the key to writing efficient, correct SQL.
- The importance of proper NULL handling (NULL is the absence of a value, not zero or empty string).
- Relational integrity enforced at the database level, not the application level.

---

## Martin Kleppmann

**Role:** Researcher at the University of Cambridge; distributed systems expert; author.

**Key works:**
- "Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems" (O'Reilly, 2017) — widely considered the best modern reference for data systems engineering.

**Core ideas:**
- The distinction between data systems and their trade-offs: relational vs. document vs. graph models; OLTP vs. OLAP.
- Replication, partitioning, transactions, consistency models, stream processing.
- The CAP theorem in practice; consistency vs. availability trade-offs.
- Event sourcing, CQRS, change data capture (CDC).

---

## C.J. Date (Christopher J. Date)

**Role:** Relational database theorist; worked with Edgar F. Codd (inventor of the relational model) at IBM; prolific author on relational theory.

**Key works:**
- "Database in Depth: Relational Theory for Practitioners" (O'Reilly, 2005) — accessible exposition of the relational model, third normal form, and why SQL deviates from the pure relational model.
- "An Introduction to Database Systems" (Addison-Wesley, 8th ed., 2003) — comprehensive academic textbook on relational databases.
- "Relational Database Writings" (multiple volumes, Addison-Wesley) — collected essays on relational theory.

**Core ideas:**
- Precise definitions of keys, functional dependencies, normalization.
- Critique of SQL's deviations from relational theory (NULLs, duplicate rows, unnamed columns).
- The distinction between the relational model (mathematical) and SQL (implementation).

---

## Ralph Kimball

**Role:** Data warehousing architect; pioneer of dimensional modeling methodology.

**Key works:**
- "The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling" (Wiley, 3rd ed., 2013) — co-authored with Margy Ross. The definitive reference on dimensional modeling for data warehousing.
- "The Data Warehouse Lifecycle Toolkit" (Wiley, 2nd ed., 2008) — project management and lifecycle for DW/BI projects.

**Core ideas:**
- Star schema: fact tables surrounded by dimension tables.
- Slowly Changing Dimensions (SCD Type 1, 2, 3) for tracking historical changes.
- Conformed dimensions for cross-subject-area analysis.
- Business value first: data warehouse design driven by business questions, not source system structure.

---

## Margy Ross

**Role:** Partner at the Kimball Group; co-author with Ralph Kimball.

**Key works:**
- Co-author of "The Data Warehouse Toolkit" (3rd ed., 2013) with Ralph Kimball.

---

## Raghu Ramakrishnan & Johannes Gehrke

**Role:** Database researchers and educators (Cornell University, Microsoft Research).

**Key works:**
- "Database Management Systems" (McGraw-Hill, 3rd ed., 2003) — comprehensive academic textbook covering relational algebra, SQL, storage and indexing (B+ trees, hash indexes), query processing and optimization, transactions (ACID), concurrency control (2PL, MVCC), and recovery.

**Core ideas:**
- B+ tree indexing as the standard for ordered access.
- Cost-based query optimization.
- The Two-Phase Locking (2PL) protocol for serializability.
- Write-Ahead Logging (WAL) for durability and recovery.

---

## Edgar F. Codd

**Role:** British computer scientist at IBM; inventor of the relational model (1970).

**Key works:**
- "A Relational Model of Data for Large Shared Data Banks" (Communications of the ACM, 1970) — the paper that introduced the relational model.
- "The Relational Model for Database Management Version 2" (Addison-Wesley, 1990).
- Codd's 12 Rules for relational database systems.

**Legacy:** All modern relational databases (PostgreSQL, MySQL, Oracle, SQL Server) are implementations of the relational model Codd defined. The normalization theory (1NF through BCNF) originates from Codd's work.

---

## Bill Inmon

**Role:** Data warehousing pioneer; proponent of the "Corporate Information Factory" (CIF) architecture.

**Key works:**
- "Building the Data Warehouse" (Wiley, 4th ed., 2005) — original data warehousing reference, proposing the top-down, normalized DW approach (contrast with Kimball's bottom-up dimensional model).

---

*Last reviewed: 2026-06. Maintained by DATA_ENGINEER_AGENT.*
