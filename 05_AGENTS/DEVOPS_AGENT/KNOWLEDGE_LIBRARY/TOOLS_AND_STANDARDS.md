# DEVOPS_AGENT — TOOLS AND STANDARDS

## Purpose
Real tools and standards used by the DEVOPS_AGENT across CI/CD, containerization, orchestration, IaC, observability, and configuration management.

---

## CI/CD Platforms

### GitHub Actions
- **Vendor:** GitHub (Microsoft)
- **URL:** https://docs.github.com/en/actions
- **Config:** `.github/workflows/*.yml`
- **Key concepts:** Workflows, jobs, steps, runners (hosted and self-hosted), secrets, environments, OIDC-based cloud authentication.
- **Strengths:** Tight GitHub integration, large marketplace of actions, free tier for public repos.

### GitLab CI/CD
- **Vendor:** GitLab Inc.
- **URL:** https://docs.gitlab.com/ee/ci/
- **Config:** `.gitlab-ci.yml`
- **Key concepts:** Stages, jobs, pipelines, runners, environments, artifacts, caches, GitLab Container Registry.
- **Strengths:** Full DevOps platform (issue tracking + SCM + CI + registry + monitoring), self-hosted option.

---

## Containers and Orchestration

### Docker
- **URL:** https://docs.docker.com/
- **Key concepts:** Images (layered filesystem), containers (running instances), volumes, networks, Docker Compose (multi-container local dev), Docker Hub / private registries.
- **Best practices:** Multi-stage builds, non-root users, minimal base images, `.dockerignore`, layer caching optimization.

### Kubernetes
- **URL:** https://kubernetes.io/docs/
- **Key concepts:** Pods, Deployments, Services, Ingress, ConfigMaps, Secrets, Namespaces, StatefulSets, DaemonSets, Jobs, CronJobs.
- **Key sub-projects:** Helm (package manager), Kustomize (config management), ArgoCD (GitOps), Prometheus Operator, cert-manager, external-secrets-operator.
- **Managed offerings:** EKS (AWS), GKE (Google), AKS (Azure), k3s (lightweight for edge).

### Helm
- **URL:** https://helm.sh/
- Kubernetes package manager. Charts package all Kubernetes manifests for an application. Helm values enable environment-specific configuration without duplicating templates.

---

## Infrastructure as Code

### Terraform
- **Vendor:** HashiCorp (now OpenTofu is the open-source fork after BSL license change)
- **URL:** https://developer.hashicorp.com/terraform
- **Language:** HCL (HashiCorp Configuration Language)
- **Key concepts:** Providers, resources, data sources, modules, state files, workspaces, `plan` / `apply` / `destroy`.
- **State backends:** Terraform Cloud, S3+DynamoDB (AWS), GCS (GCP), Azure Blob.
- **Best practices:** Remote state, state locking, module versioning, `terraform fmt` in CI, `tflint`, `checkov` for security scanning.

### Ansible
- **Vendor:** Red Hat (open source)
- **URL:** https://docs.ansible.com/
- **Language:** YAML playbooks
- **Key concepts:** Inventory, playbooks, roles, tasks, handlers, modules, Ansible Galaxy (role repository).
- **Use cases:** Configuration management, application deployment, ad-hoc automation, server provisioning (complement to Terraform).
- **Agentless:** Uses SSH; no agent required on target hosts.

---

## Observability Stack

### Prometheus
- **URL:** https://prometheus.io/
- **Type:** Time-series metrics collection and alerting
- **Key concepts:** Metrics types (Counter, Gauge, Histogram, Summary), PromQL query language, scrape-based collection, Alertmanager for routing alerts.
- **Ecosystem:** `node_exporter`, `blackbox_exporter`, `kube-state-metrics`, `pushgateway`.

### Grafana
- **URL:** https://grafana.com/
- **Type:** Metrics visualization and dashboarding
- **Key features:** Connects to Prometheus, Loki, Tempo, and 50+ data sources. Pre-built dashboards from Grafana Labs community. Alerting. Grafana OnCall for incident management.

### ELK Stack (Elasticsearch, Logstash, Kibana)
- **Vendor:** Elastic
- **URL:** https://www.elastic.co/what-is/elk-stack
- **Components:**
  - **Elasticsearch:** Distributed full-text search and analytics engine (log storage and indexing).
  - **Logstash:** Data pipeline for log ingestion, parsing, transformation.
  - **Kibana:** Visualization UI for Elasticsearch data.
- **Beats:** Lightweight log shippers (Filebeat, Metricbeat, Packetbeat) deployed as sidecars or DaemonSets.
- **Modern alternative:** Grafana Loki (label-based indexing, more cost-efficient at scale).

### OpenTelemetry
- **URL:** https://opentelemetry.io/
- **Type:** Observability framework (vendor-neutral SDK + collector)
- **Coverage:** Metrics, logs, and distributed traces in a single unified standard.
- **Integration:** Exporters to Prometheus, Jaeger, Tempo, Datadog, Honeycomb, etc.

---

## Standards

### DORA Metrics (2023 benchmarks)
- Deployment Frequency: Elite = multiple deploys/day; High = daily–weekly.
- Lead Time: Elite = < 1 hour; High = 1 day – 1 week.
- MTTR: Elite = < 1 hour; High = < 1 day.
- Change Failure Rate: Elite = 0–5%; High = 5–10%.

### 12-Factor App (https://12factor.net/)
- Canonical methodology for building cloud-native, 12-factor compliant applications.

### OCI (Open Container Initiative)
- **URL:** https://opencontainers.org/
- Vendor-neutral container format and runtime standards: OCI Image Spec, OCI Runtime Spec, OCI Distribution Spec.
- Ensures Docker images run on any OCI-compliant runtime (containerd, cri-o).

### Semantic Versioning (SemVer) 2.0.0
- **URL:** https://semver.org/
- MAJOR.MINOR.PATCH versioning with clear rules for backwards compatibility.

---

*Last reviewed: 2026-06. Maintained by DEVOPS_AGENT.*
