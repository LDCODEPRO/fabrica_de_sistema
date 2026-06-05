# DEVOPS_AGENT — BEST PRACTICES

## Purpose
Core DevOps and SRE best practices followed by the DEVOPS_AGENT when designing, building, and maintaining CI/CD pipelines, infrastructure, and observability systems.

---

## 1. CI/CD Pipeline Design

- Every commit to main/master triggers an automated build, test, and deploy pipeline.
- Pipelines should fail fast: lint and unit tests run first; integration tests run only if unit tests pass.
- Use branch protection rules: require passing CI before merging PRs.
- Keep pipelines idempotent — running the same pipeline twice should produce the same result.
- Separate build artifacts from deployment: build once, deploy to many environments.
- Store pipeline-as-code in the repository (`Jenkinsfile`, `.github/workflows/`, `.gitlab-ci.yml`).
- Use semantic versioning (SemVer) for all releases: MAJOR.MINOR.PATCH.

## 2. GitOps Principles

- The Git repository is the single source of truth for infrastructure and application state.
- All changes to production are made via pull requests — no manual kubectl/console edits.
- Use separate repos (or separate branches) for application code vs. infrastructure manifests.
- Automated reconciliation: GitOps operator (ArgoCD, Flux) continuously ensures cluster state matches repository.
- Audit trail: every infrastructure change is a reviewable, attributable git commit.

## 3. Containerization

- Base images: use minimal images (Alpine, Distroless) to reduce attack surface.
- Never run containers as root; add `USER nonroot` to Dockerfiles.
- Use multi-stage builds to keep production images small and free of build tools.
- Pin base image digests in production Dockerfiles (`FROM node:20.11.0@sha256:...`).
- Scan images in CI with Trivy or Snyk before pushing to registry.
- Use `.dockerignore` to exclude `.git`, `node_modules`, secrets files from build context.

## 4. Kubernetes Orchestration

- Use namespaces to isolate environments and workloads.
- Apply resource requests and limits on all pods.
- Use Horizontal Pod Autoscaler (HPA) and Vertical Pod Autoscaler (VPA).
- Never store secrets in ConfigMaps — use Kubernetes Secrets (or better, external-secrets-operator with Vault).
- Use NetworkPolicies to implement micro-segmentation.
- Define liveness, readiness, and startup probes for every deployment.
- Use Pod Disruption Budgets (PDB) for critical workloads.

## 5. Infrastructure as Code (IaC)

- All infrastructure is defined in code (Terraform, Pulumi, CloudFormation).
- Use remote state backends (Terraform Cloud, S3+DynamoDB) — never local state in production.
- Apply `terraform plan` in CI and require human approval before `terraform apply` to production.
- Module everything: reuse modules for VPCs, EKS clusters, RDS, etc.
- Use `terraform fmt` and `tflint` in CI for style and validation.
- Drift detection: periodically run `terraform plan` against production to detect manual changes.

## 6. Observability (the Three Pillars)

**Metrics** (Prometheus + Grafana):
- Instrument every service with RED metrics (Rate, Errors, Duration).
- Use SLIs (Service Level Indicators) and SLOs (Service Level Objectives) to define reliability targets.
- Alert on symptom, not cause: alert when error rate exceeds SLO threshold, not when CPU is at 80%.

**Logs** (ELK/EFK Stack or Loki):
- Structured logging (JSON) everywhere.
- Include request ID, trace ID, user ID, service name, environment in every log line.
- Ship logs to a centralized aggregator; never rely on local disk logs in containers.

**Traces** (OpenTelemetry + Jaeger/Tempo):
- Distributed tracing for all inter-service calls.
- Propagate trace context headers (W3C TraceContext standard).
- Sample at a rate that balances observability cost and coverage.

## 7. SRE Practices

- Define SLOs before writing production code.
- Use error budgets: if the error budget is exhausted, reliability work takes priority over features.
- Practice chaos engineering in non-production environments (Chaos Monkey, k6).
- Conduct blameless post-mortems after every incident.
- Track the four DORA metrics: deployment frequency, lead time for changes, MTTR, change failure rate.

## 8. Security in DevOps (DevSecOps)

- Integrate SAST and SCA scanning into every pipeline stage.
- Scan container images before pushing to registry.
- Scan IaC for misconfigurations (Checkov, tfsec, Trivy IaC).
- Rotate secrets automatically; use short-lived credentials via Vault or IAM roles.
- Apply least-privilege to all CI/CD service accounts and pipeline tokens.

---

*Last reviewed: 2026-06. Maintained by DEVOPS_AGENT.*
