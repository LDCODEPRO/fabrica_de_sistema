# SECURITY_AGENT — TOOLS AND STANDARDS

## Purpose
Real tools and standards actively used by the SECURITY_AGENT when conducting security reviews, automated scanning, secrets management, and compliance validation.

---

## Security Testing Tools

### OWASP ZAP (Zed Attack Proxy)
- **Maintainer:** OWASP Foundation
- **URL:** https://www.zaproxy.org/
- **Type:** DAST (Dynamic Application Security Testing)
- **Use cases:** Automated scanning of web applications for OWASP Top 10 vulnerabilities, active and passive scan modes, API scanning (OpenAPI/Swagger), spider/crawl, fuzzing.
- **Integration:** Can be embedded in CI/CD via Docker image (`owasp/zap2docker-stable`); supports GITHUB_ACTIONS workflows.
- **Key features:** Automation Framework (YAML-based), authentication scripts, Ajax spider for SPAs.

### Burp Suite Community Edition
- **Vendor:** PortSwigger
- **URL:** https://portswigger.net/burp/communitydownload
- **Type:** Web application security testing platform (proxy + scanner)
- **Use cases:** Intercepting and modifying HTTP/S traffic, manual testing, Repeater for request replay, Intruder for parameter fuzzing, Decoder for encoding/decoding payloads.
- **Note:** The Community Edition lacks the automated scanner (Professional only); used here for manual review and proof-of-concept testing.

### Snyk
- **URL:** https://snyk.io/
- **Type:** SCA (Software Composition Analysis) + SAST
- **Use cases:** Scanning dependencies for known CVEs, container image scanning, IaC scanning (Terraform, Kubernetes), code scanning.
- **Integration:** GitHub, GitLab, VS Code extension, CLI (`snyk test`, `snyk monitor`).
- **Databases:** Snyk Vulnerability DB (aggregates NVD, GitHub Advisories, proprietary research).

### Dependabot
- **Vendor:** GitHub (acquired 2019)
- **URL:** https://docs.github.com/en/code-security/dependabot
- **Type:** Automated dependency update and vulnerability alerting
- **Use cases:** Automatic PRs for outdated or vulnerable dependencies; alerts on known CVEs in `package.json`, `requirements.txt`, `pom.xml`, `Gemfile`, etc.
- **Configuration:** `.github/dependabot.yml`

### Trivy
- **Vendor:** Aqua Security (open source)
- **URL:** https://github.com/aquasecurity/trivy
- **Type:** Vulnerability scanner for containers, filesystems, Git repos, IaC
- **Use cases:** Scanning Docker images in CI pipelines, detecting CVEs in OS packages and language-specific deps, misconfiguration detection in Terraform/Kubernetes.

### Semgrep
- **Vendor:** Semgrep, Inc. (open source community rules)
- **URL:** https://semgrep.dev/
- **Type:** SAST (Static Application Security Testing)
- **Use cases:** Code pattern matching with security-focused rulesets (OWASP, CWE mappings), custom rules for project-specific patterns, supports 30+ languages.

---

## Secrets and Identity Management

### HashiCorp Vault
- **URL:** https://www.vaultproject.io/
- **Type:** Secrets management and data encryption
- **Use cases:** Dynamic secrets (database credentials, AWS IAM), secret leasing and renewal, encryption as a service, PKI certificate management, audit logging.
- **Key concepts:** Auth methods (AppRole, Kubernetes, AWS IAM), secret engines (KV, database, PKI, transit), policies (HCL).

### Auth0
- **Vendor:** Okta (acquired Auth0 in 2021)
- **URL:** https://auth0.com/
- **Type:** Identity-as-a-Service (IDaaS), Authentication and Authorization platform
- **Use cases:** Social login, enterprise SSO (SAML, OIDC), MFA, machine-to-machine auth, user management, anomaly detection.

### Keycloak
- **Vendor:** Red Hat (open source)
- **URL:** https://www.keycloak.org/
- **Type:** Open-source Identity and Access Management
- **Use cases:** SSO with OIDC and SAML 2.0, user federation (LDAP/AD), fine-grained authorization, social login, self-hosted alternative to Auth0.
- **Key features:** Admin console, realm/client/role management, token introspection endpoint.

---

## Standards and Compliance Frameworks

### OWASP ASVS (Application Security Verification Standard) 4.0
- Three verification levels (L1/L2/L3).
- Used as security acceptance criteria for application development.
- Maps to NIST 800-63, PCI DSS, ISO 27001 controls.

### NIST SP 800-63 (Digital Identity Guidelines)
- **800-63A:** Enrollment and identity proofing
- **800-63B:** Authentication and lifecycle management
- **800-63C:** Federation and assertions
- Defines Authenticator Assurance Levels (AAL1/2/3).
- Basis for NIST's recommendation against periodic mandatory password rotation (replaced by breach-checking via HaveIBeenPwned API).

### ISO/IEC 27001:2022
- International standard for Information Security Management Systems (ISMS).
- Annex A controls cover organizational, people, physical, and technological measures.
- Certification provides third-party validation of security posture.

### PCI DSS (Payment Card Industry Data Security Standard) v4.0
- Mandatory for systems handling payment card data.
- 12 core requirements: network security, cardholder data protection, vulnerability management, access control, monitoring, security policy.
- Current version: 4.0 (released 2022, mandatory from March 2025).

### GDPR (General Data Protection Regulation)
- EU regulation (2018) governing personal data processing.
- Key principles: lawfulness, purpose limitation, data minimization, accuracy, storage limitation, integrity/confidentiality.
- Technical requirements: pseudonymization, encryption, data breach notification (72 hours), data protection by design and by default.

### CWE (Common Weakness Enumeration)
- **Maintainer:** MITRE Corporation
- **URL:** https://cwe.mitre.org/
- Catalog of software weakness types. Used to classify vulnerabilities found during code review.
- Top 25 Most Dangerous Software Weaknesses updated annually.

### CVE (Common Vulnerabilities and Exposures)
- **Maintainer:** MITRE Corporation / NVD (NIST)
- Standard identifier for publicly known vulnerabilities.
- CVSS (Common Vulnerability Scoring System) v3.1 provides severity scores (0–10).

---

*Last reviewed: 2026-06. Maintained by SECURITY_AGENT.*
