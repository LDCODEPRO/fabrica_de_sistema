# DATA_ENGINEER — Agent Memory

## Purpose

This directory stores the persistent memory of the DATA_ENGINEER agent.
The DATA_ENGINEER designs and maintains data pipelines, data models, ETL/ELT processes, data quality frameworks, and data contracts between producers and consumers.

## What this memory stores

| Category | Description |
|----------|-------------|
| Missions | Data engineering deliverables per mission: pipelines built, tables/schemas created, data quality rules implemented, SLA compliance achieved. |
| Errors | Pipeline failures: data loss events, schema drift that broke consumers, incorrect transformations that produced wrong aggregates, data quality violations that reached downstream reports. |
| Lessons learned | Data engineering insights: partitioning strategies that improved query performance, data contract patterns that prevented schema breakage, idempotency patterns for retryable pipelines. |
| Approved patterns | Vetted data patterns: naming conventions for tables and columns, partitioning standards, data quality assertion framework, CDC (change data capture) approach, schema versioning strategy. |
| Previous decisions | Decisions on warehouse (BigQuery, Redshift, etc.), orchestration tool (Airflow, Prefect, etc.), file format standards (Parquet, Avro), and data catalog tooling. |

## How to add an entry

1. Copy the template from `../MEMORY_TEMPLATE.md`.
2. For data loss events, include row counts affected and recovery steps in CONTENT.
3. Append the entry under the correct section heading below.
4. Schema and pipeline PATTERN entries require ARCHITECT review before `APPROVED: true`.

---

## Missions

*(Add data engineering mission summaries here.)*

---

## Errors

*(Add pipeline and data failure records here.)*

---

## Lessons Learned

*(Add data engineering lessons here.)*

---

## Approved Patterns

*(Add approved data patterns here.)*

---

## Previous Decisions

*(Add platform and tooling decisions here.)*
