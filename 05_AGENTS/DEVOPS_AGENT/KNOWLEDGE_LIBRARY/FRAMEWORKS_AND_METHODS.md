# DEVOPS_AGENT — FRAMEWORKS AND METHODS

## Purpose
Structured methodologies and frameworks used by the DEVOPS_AGENT for pipeline design, infrastructure management, SRE, and deployment strategies.

---

## 1. The Three Ways of DevOps (Gene Kim)

**Source:** "The DevOps Handbook" (2016)

### First Way — Flow (Left to Right)
Optimize the flow of work from Development through Operations to the customer. Practices:
- Small batch sizes and single-piece flow
- Make work visible (Kanban boards, deployment tracking)
- Reduce handoffs and wait times
- Eliminate bottlenecks (Theory of Constraints)
- Continuous integration and continuous delivery

### Second Way — Feedback (Right to Left)
Create fast feedback loops so problems are detected and corrected early. Practices:
- Fast automated test suites
- Deployment health monitoring
- Alerting on SLO breaches
- Integration of security scanning into pipelines
- Customer feedback loops

### Third Way — Continual Learning and Experimentation
Foster a culture of continual improvement and learning from failure. Practices:
- Blameless postmortems
- Game days and chaos engineering
- Time allocated for improvement (20% time, improvement sprints)
- Sharing knowledge across teams

---

## 2. DORA Metrics (DevOps Research and Assessment)

**Source:** Nicole Forsgren et al., "Accelerate" (2018); DORA State of DevOps Reports

The four key metrics that predict software delivery performance and organizational outcomes:

| Metric | Definition | Elite Level (2023) |
|--------|-----------|-------------------|
| Deployment Frequency | How often deploys to production occur | On-demand (multiple per day) |
| Lead Time for Changes | Time from commit to production | Less than 1 hour |
| Mean Time to Restore (MTTR) | Time to restore from production incident | Less than 1 hour |
| Change Failure Rate | % of deployments causing prod incidents | 0–5% |

**Usage:** Track these four metrics as the primary health indicators for the delivery system.

---

## 3. GitOps

**Origin:** Coined by Alexis Richardson (Weaveworks) in 2017.

**Core principles:**
1. The entire system is described declaratively in Git.
2. Git is the single source of truth.
3. Approved changes are applied automatically (pull-based reconciliation).
4. Convergence: the operator continuously ensures actual state matches desired state.

**Tools:** ArgoCD, Flux, Rancher Fleet.

**Workflow:**
```
Developer → PR → Review → Merge to main → ArgoCD detects change → Syncs to cluster
```

---

## 4. GitFlow

**Origin:** Vincent Driessen, 2010 (nvie.com blog post "A successful Git branching model")

**Branches:**
- `main/master`: Production-ready state only.
- `develop`: Integration branch for features.
- `feature/*`: New features, branched from develop.
- `release/*`: Release preparation (bug fixes only), merged to main and develop.
- `hotfix/*`: Emergency fixes to production, merged to main and develop.

**Note:** For teams practicing continuous delivery with deployment frequency > daily, trunk-based development (TBD) is preferred over GitFlow.

---

## 5. Trunk-Based Development (TBD)

**Origin:** Paul Hamant; supported by DORA research as a practice of elite performers.

**Principles:**
- All developers integrate to a single shared trunk (main) at least once per day.
- Branches are short-lived (< 1 day ideally, < 2 days maximum).
- Feature flags used to hide incomplete features from end users.
- Enables continuous integration; eliminates merge hell.

---

## 6. 12-Factor App Methodology

**Source:** Adam Wiggins (Heroku), https://12factor.net/

| Factor | Description |
|--------|-------------|
| I. Codebase | One codebase, many deploys |
| II. Dependencies | Explicitly declare and isolate dependencies |
| III. Config | Store config in environment (not code) |
| IV. Backing Services | Treat backing services as attached resources |
| V. Build/Release/Run | Strictly separate build, release, and run stages |
| VI. Processes | Execute the app as one or more stateless processes |
| VII. Port Binding | Export services via port binding |
| VIII. Concurrency | Scale out via the process model |
| IX. Disposability | Fast startup, graceful shutdown |
| X. Dev/Prod Parity | Keep dev, staging, production as similar as possible |
| XI. Logs | Treat logs as event streams |
| XII. Admin Processes | Run admin/management tasks as one-off processes |

---

## 7. SLI / SLO / SLA / Error Budget (SRE Framework)

**Source:** Google SRE Book (2016)

- **SLI (Service Level Indicator):** A carefully defined quantitative measure of a service's behavior (e.g., % of requests served in < 200ms).
- **SLO (Service Level Objective):** A target value for an SLI (e.g., 99.9% of requests in < 200ms over 30 days).
- **SLA (Service Level Agreement):** The contractual agreement with customers, usually less strict than the SLO.
- **Error Budget:** 100% minus SLO = the permissible unreliability. If error budget is exhausted, freeze feature work; focus on reliability.

**Alerting principle:** Alert on SLO burn rate (how fast the error budget is being consumed), not on raw metrics.

---

## 8. Deployment Strategies

| Strategy | Description | Use Case |
|----------|-------------|----------|
| Recreate | Stop old, start new — downtime | Dev/test environments |
| Rolling Update | Gradually replace old pods | Zero-downtime standard deploys |
| Blue/Green | Two identical environments; switch traffic | Zero-downtime with instant rollback |
| Canary | Route small % of traffic to new version | Risk mitigation for high-risk changes |
| Feature Flags | Ship code but control activation | Decouple deploy from release |
| A/B Testing | Different versions for different user segments | Product experimentation |

---

*Last reviewed: 2026-06. Maintained by DEVOPS_AGENT.*
