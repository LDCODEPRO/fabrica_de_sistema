# DEVOPS — Agent Memory

## Purpose

This directory stores the persistent memory of the DEVOPS agent.
The DEVOPS agent manages CI/CD pipelines, infrastructure provisioning, container orchestration, monitoring, deployment strategies, and environment configuration.

## What this memory stores

| Category | Description |
|----------|-------------|
| Missions | Infrastructure and pipeline deliverables per mission: environments set up, pipeline stages configured, deployment strategies implemented, incident response actions taken. |
| Errors | Infrastructure failures: pipeline misconfiguration that broke a release, resource limits that caused outages, incorrect environment variables deployed to production, rollback events. |
| Lessons learned | DevOps insights: deployment patterns that reduced downtime, monitoring alerts that caught issues early, IaC patterns that simplified environment parity, container image optimisations. |
| Approved patterns | Vetted DevOps patterns: Dockerfile conventions, pipeline stage order, blue/green vs canary criteria, secret injection approach, health check endpoint contract, rollback trigger conditions. |
| Previous decisions | Decisions on cloud provider, container registry, orchestration platform (Kubernetes, ECS, etc.), IaC tooling (Terraform, Pulumi), and log aggregation stack. |

## How to add an entry

1. Copy the template from `../MEMORY_TEMPLATE.md`.
2. For outage records, include start time, duration, affected services, and root cause in CONTENT.
3. Append the entry under the correct section heading below.
4. Infrastructure PATTERN entries must be reviewed by ARCHITECT and SECURITY before `APPROVED: true`.

---

## Missions

*(Add DevOps mission summaries here.)*

---

## Errors

*(Add infrastructure failure records here.)*

---

## Lessons Learned

*(Add DevOps lessons here.)*

---

## Approved Patterns

*(Add approved infrastructure patterns here.)*

---

## Previous Decisions

*(Add platform and tooling decisions here.)*
