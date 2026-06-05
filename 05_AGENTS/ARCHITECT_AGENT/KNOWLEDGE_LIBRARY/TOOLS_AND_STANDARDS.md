# ARCHITECT_AGENT — Tools and Standards

> Domain: Software Architecture & System Design
> Last updated: 2026-06-05

---

## 1. Architecture Diagramming Tools

### PlantUML
- **Type:** Text-based UML and architecture diagramming tool.
- **Use cases:** Sequence diagrams, component diagrams, C4 Model diagrams (via C4-PlantUML library), class diagrams, deployment diagrams.
- **Integration:** Embeds in Confluence, GitLab, GitHub (via Mermaid plugin or pre-rendering), IntelliJ IDEA, VS Code.
- **Website:** plantuml.com
- **C4 extension:** github.com/plantuml-stdlib/C4-PlantUML

### draw.io (diagrams.net)
- **Type:** GUI-based diagramming tool.
- **Use cases:** Architecture diagrams, flowcharts, C4 Model, AWS/Azure/GCP cloud architecture diagrams.
- **Integration:** VS Code extension, Confluence plugin, Google Drive, GitHub (stores diagrams as XML inside `.drawio` files).
- **Website:** diagrams.net

### Structurizr
- **Type:** Architecture-as-code tool built specifically for the C4 Model.
- **Author:** Simon Brown.
- **Use cases:** Define architecture models in code (DSL or Java/C#/Python SDK); generate C4 diagrams; keep architecture documentation consistent.
- **Website:** structurizr.com

### Mermaid
- **Type:** Markdown-native diagramming language.
- **Use cases:** Flowcharts, sequence diagrams, entity-relationship diagrams, Gantt charts directly inside Markdown files.
- **Integration:** GitHub, GitLab, Notion, Obsidian, VS Code.
- **Website:** mermaid.js.org

---

## 2. Architecture Decision Records (ADR) Tools

### adr-tools
- **Type:** CLI tool for managing ADRs in a directory.
- **Author:** Nat Pryce.
- **Usage:** `adr new "Use PostgreSQL as the primary data store"` creates a new ADR file with a sequential number and the Nygard template.
- **Repository:** github.com/npryce/adr-tools

### Log4brains
- **Type:** Web-based ADR knowledge base viewer.
- **Usage:** Generates a static website from ADR Markdown files stored in a repository; integrates with CI/CD pipelines.
- **Repository:** github.com/thomvaill/log4brains

### ADR Format (Nygard Template)
```markdown
# ADR-NNN: Title

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-XXX

## Context
What is the problem or situation that requires a decision?

## Decision
What was decided?

## Consequences
What becomes easier or harder as a result of this decision?
```

---

## 3. API Design and Documentation

### OpenAPI Specification (formerly Swagger)
- **Type:** Standard for describing RESTful APIs in YAML or JSON.
- **Organization:** OpenAPI Initiative (Linux Foundation).
- **Tools:** Swagger UI (interactive documentation), Swagger Editor, Swagger Codegen, Redoc.
- **Version:** OpenAPI 3.1 (current standard).
- **Website:** spec.openapis.org

### Swagger UI / Swagger Editor
- **Type:** Tools for visualizing and editing OpenAPI specifications.
- **Use cases:** Generate interactive API documentation; validate API contracts.
- **Website:** swagger.io

### AsyncAPI
- **Type:** Standard for describing event-driven and message-driven APIs.
- **Use cases:** Document Kafka topics, RabbitMQ exchanges, WebSocket protocols.
- **Website:** asyncapi.com

---

## 4. Distributed Systems and Messaging Infrastructure

### Apache Kafka
- **Type:** Distributed event streaming platform.
- **Use cases:** Event sourcing, event-driven architecture, log aggregation, stream processing, data pipeline integration.
- **Key concepts:** Topics, partitions, consumer groups, offsets, compaction, Kafka Streams, Kafka Connect.
- **Website:** kafka.apache.org

### RabbitMQ
- **Type:** Message broker implementing AMQP.
- **Use cases:** Task queues, pub/sub, routing, RPC over messaging.
- **Website:** rabbitmq.com

---

## 5. Service Mesh and API Gateway

### Kong Gateway
- **Type:** Open-source API gateway.
- **Use cases:** Rate limiting, authentication, routing, load balancing, observability for microservices.
- **Website:** konghq.com

### Istio
- **Type:** Open-source service mesh for Kubernetes.
- **Use cases:** Mutual TLS between services, traffic management, circuit breaking, observability (distributed tracing, metrics).
- **Website:** istio.io

---

## 6. Observability

### OpenTelemetry
- **Type:** CNCF standard for distributed tracing, metrics, and logs.
- **Use cases:** Instrument services once; export to Jaeger, Zipkin, Prometheus, Grafana, Datadog, etc.
- **Website:** opentelemetry.io

### Jaeger
- **Type:** Open-source distributed tracing system.
- **Origin:** Uber Technologies; now a CNCF project.
- **Use cases:** Trace requests across microservices; diagnose latency problems.
- **Website:** jaegertracing.io

### Prometheus + Grafana
- **Type:** Metrics collection (Prometheus) and visualization (Grafana).
- **Use cases:** Monitor service health, SLI/SLO dashboards, alerting.

---

## 7. Infrastructure as Code (IaC)

### Terraform (HashiCorp)
- **Type:** Declarative IaC tool.
- **Use cases:** Provision cloud infrastructure (AWS, Azure, GCP) in a reproducible, version-controlled manner.
- **Website:** terraform.io

### Pulumi
- **Type:** IaC using general-purpose programming languages (TypeScript, Python, Go, C#).
- **Use cases:** Cloud provisioning with full programming language features (loops, conditionals, abstractions).
- **Website:** pulumi.com

---

## 8. Standards and Specifications

| Standard | Description | Authority |
|---|---|---|
| ISO/IEC 42010:2011 | Standard for software architecture description and ADRs. | ISO/IEC |
| TOGAF 10 | Enterprise architecture framework covering architecture development method, governance, and repositories. | The Open Group |
| 12-Factor App | Methodology for cloud-native application design. | Heroku / Adam Wiggins |
| OpenAPI 3.1 | REST API specification standard. | OpenAPI Initiative |
| AsyncAPI 3.0 | Event-driven API specification standard. | AsyncAPI Initiative |
| NIST SP 800-160 | Systems security engineering. | NIST |
| C4 Model | Architecture visualization standard. | Simon Brown |

---

*All references are indexed in SOURCE_INDEX.md.*
