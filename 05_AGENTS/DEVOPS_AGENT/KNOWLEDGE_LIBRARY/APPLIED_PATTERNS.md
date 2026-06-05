# DEVOPS_AGENT — APPLIED PATTERNS

## Purpose
Concrete, reusable patterns applied by the DEVOPS_AGENT when building pipelines, infrastructure, and observability systems for the Fábrica de Sistemas project.

---

## Pattern 1: Build-Once-Deploy-Many Pipeline

**Problem:** Rebuilding the application artifact at each environment stage introduces variability — what was tested in staging may differ from what reaches production.

**Solution:** Build the artifact once (Docker image or binary), tag with the commit SHA, push to registry, and promote the same artifact through environments by changing only configuration.

```
Commit → Build → Unit Tests → Build Docker Image → Push to Registry (sha tag)
                                                         ↓
                             Deploy to Staging (same image) → Integration Tests
                                                         ↓
                             Deploy to Production (same image, env config differs)
```

---

## Pattern 2: GitHub Actions CI Pipeline Template

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run linter
        run: ruff check .
      - name: Run tests
        run: pytest --cov=src --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v4

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Snyk
        uses: snyk/actions/python@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

## Pattern 3: Docker Multi-Stage Build

**Goal:** Keep production images small and free of build tools.

```dockerfile
# Build stage
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Runtime stage
FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /install /usr/local
COPY src/ ./src/

# Run as non-root
RUN useradd --no-create-home --shell /bin/false appuser
USER appuser

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Pattern 4: Kubernetes Deployment with Probes and Resource Limits

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-service
  template:
    metadata:
      labels:
        app: api-service
    spec:
      containers:
      - name: api
        image: registry.example.com/api:sha-abc1234
        ports:
        - containerPort: 8000
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
        envFrom:
        - secretRef:
            name: api-secrets
        - configMapRef:
            name: api-config
```

---

## Pattern 5: Terraform Module Pattern

**Structure for reusable infrastructure modules:**

```
infrastructure/
  modules/
    rds-postgres/
      main.tf
      variables.tf
      outputs.tf
      README.md
    eks-cluster/
      main.tf
      variables.tf
      outputs.tf
  environments/
    staging/
      main.tf          # calls modules with staging-specific vars
      terraform.tfvars
    production/
      main.tf
      terraform.tfvars
```

**Usage in `environments/production/main.tf`:**
```hcl
module "database" {
  source      = "../../modules/rds-postgres"
  identifier  = "prod-db"
  db_name     = "fabrica"
  instance_class = "db.t4g.medium"
  multi_az    = true
}
```

---

## Pattern 6: SLO Dashboard (Prometheus + Grafana)

**SLI query for availability (% of successful requests):**
```promql
sum(rate(http_requests_total{status!~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))
```

**Error budget burn rate alert (Alertmanager):**
```yaml
- alert: HighErrorBudgetBurnRate
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[1h])) /
      sum(rate(http_requests_total[1h]))
    ) > 14.4 * (1 - 0.999)
  for: 2m
  annotations:
    summary: "High error budget burn rate — SLO at risk"
```
*(14.4x burn rate = budget exhausted in ~2 days from current rate)*

---

## Pattern 7: Blameless Postmortem Template

```markdown
## Incident Title: [Brief description]
**Date:** YYYY-MM-DD
**Duration:** HH:MM – HH:MM UTC
**Severity:** P1 / P2 / P3
**Impact:** [Users/services affected]

## Timeline
| Time (UTC) | Event |
|------------|-------|
| HH:MM | First alert triggered |
| HH:MM | On-call engineer paged |
| HH:MM | Root cause identified |
| HH:MM | Fix deployed |
| HH:MM | Service fully recovered |

## Root Cause
[What was the underlying cause?]

## Contributing Factors
- [Factor 1]
- [Factor 2]

## What Went Well
- [...]

## What Could Be Improved
- [...]

## Action Items
| Action | Owner | Due Date |
|--------|-------|----------|
| [e.g., Add alerting for X] | [Name] | YYYY-MM-DD |
```

---

## Pattern 8: Structured Logging Pattern

```python
import structlog
import logging

structlog.configure(
    processors=[
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer(),
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
)

log = structlog.get_logger()

log.info(
    "user.login",
    user_id="usr_123",
    ip_address="192.0.2.1",
    method="password",
    success=True,
)
```

---

*Last reviewed: 2026-06. Maintained by DEVOPS_AGENT.*
