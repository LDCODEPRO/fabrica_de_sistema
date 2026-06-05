# DEVOPS_AGENT — LEARNING NOTES

## Purpose
Evolving notes capturing lessons, trade-offs, and practical insights from applying DevOps and SRE practices. Updated as patterns are refined through real usage.

---

## Note 001 — Trunk-Based Development Removes Merge Hell
**Date:** 2026-06
**Source:** DORA State of DevOps Report 2019; Paul Hamant's "Trunk Based Development" site (trunkbaseddevelopment.com)

GitFlow with long-lived feature branches creates integration pain proportional to branch lifetime. When multiple engineers work for days on separate branches, merging becomes the bottleneck. DORA research consistently shows that elite performers use trunk-based development with short-lived branches (< 2 days) and feature flags to manage incomplete work.

**Lesson:** Default to trunk-based development for new projects. Use feature flags (LaunchDarkly, Unleash, Flagsmith) to decouple deployment from release.

---

## Note 002 — Deployment Frequency Is a Leading Indicator, Not a Vanity Metric
**Date:** 2026-06
**Source:** "Accelerate" (Forsgren, Humble, Kim, 2018)

Higher deployment frequency correlates with lower change failure rates, not higher — counter to intuition. Small, frequent deployments are easier to test, easier to review, and easier to roll back than large batched deployments. The "deploy less often to be safer" mindset is empirically false.

**Lesson:** If the team is deploying less than weekly, the first improvement target should be reducing batch size and removing manual deployment steps.

---

## Note 003 — Container Healthchecks Are Critical for Zero-Downtime Deploys
**Date:** 2026-06
**Source:** Kubernetes documentation; production incident post-mortems

Kubernetes rolling updates without readiness probes will route traffic to pods that haven't finished initializing, causing request failures. Without liveness probes, a deadlocked process keeps receiving traffic indefinitely.

**Lesson:** Every Kubernetes Deployment must define both `livenessProbe` and `readinessProbe`. The readiness probe endpoint (`/health/ready`) should check dependent services (DB connection, cache connection). The liveness probe (`/health/live`) should only check that the process itself is responsive.

---

## Note 004 — Terraform State Drift Is Silent and Dangerous
**Date:** 2026-06
**Source:** HashiCorp documentation; real-world incidents

Manual changes to infrastructure via cloud console or CLI create drift between Terraform state and actual infrastructure. The next `terraform apply` may destroy the manually created resource or produce unexpected behavior.

**Lesson:**
1. Enforce a policy: all infrastructure changes go through Terraform. Alert on manual changes using AWS Config, GCP Asset Inventory, or Driftle.
2. Run `terraform plan` against production weekly in CI to detect drift even when no changes are planned.
3. For critical infrastructure, consider using Sentinel or OPA policies to block non-TF changes at the cloud IAM level.

---

## Note 005 — Alert on Symptoms, Not Causes
**Date:** 2026-06
**Source:** Google SRE Book, Chapter 6 (Monitoring Distributed Systems)

Alerting on CPU > 80% or memory > 70% is low-signal and high-noise. Users don't experience "high CPU"; they experience slow responses or errors. Alert on what users actually feel.

**Better approach:**
- Alert when error rate exceeds SLO burn threshold.
- Alert when p99 latency exceeds SLO threshold.
- Use "cause" metrics (CPU, memory) only for dashboards and capacity planning, not for paging.

---

## Note 006 — CI/CD Pipeline Security (Poisoned Pipeline Execution)
**Date:** 2026-06
**Source:** CISA/NSA "Defending Continuous Integration/Continuous Delivery Environments" (2023)

CI/CD pipelines with access to production credentials are high-value targets. "Poisoned Pipeline Execution" attacks compromise the pipeline itself to exfiltrate secrets or deploy malicious code.

**Mitigations:**
- Use short-lived, OIDC-based credentials (GitHub Actions OIDC → AWS IAM) — no stored long-lived secrets.
- Restrict which branches can trigger production deployments.
- Pin GitHub Actions to commit SHAs, not mutable tags (`uses: actions/checkout@v4` → `uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683`).
- Require code review and branch protection before merging to main.
- Audit pipeline definitions as critically as application code.

---

## Note 007 — ELK vs. Loki Trade-off
**Date:** 2026-06
**Source:** Grafana Labs documentation; community benchmarks

Elasticsearch indexes all log fields, enabling powerful full-text search and analytics but consuming significant storage and compute. Grafana Loki uses label-based indexing (similar to Prometheus) and stores log content in object storage (S3, GCS), making it 10x+ more cost-efficient at scale.

**Recommendation:**
- For high-volume logs where cost is a concern: Grafana Loki + Grafana dashboard.
- For complex log analytics, SIEM use cases, or compliance search requirements: Elasticsearch.
- Both can be queried from the same Grafana instance.

---

## Note 008 — Helm Chart Version Management
**Date:** 2026-06
**Source:** Helm documentation; ArgoCD best practices

Pinning Helm chart versions in GitOps repositories (ArgoCD Application CRDs) prevents unexpected upgrades from upstream chart changes. However, floating to latest can cause silent drift.

**Lesson:** Always pin chart version AND app version in ArgoCD Application specs. Use Renovate Bot or Dependabot to create automated PRs when new chart versions are available, with human review before merging to production.

---

*Last updated: 2026-06. Maintained by DEVOPS_AGENT.*
