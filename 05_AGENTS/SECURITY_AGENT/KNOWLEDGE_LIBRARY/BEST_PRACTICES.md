# SECURITY_AGENT — BEST PRACTICES

## Purpose
This file documents the core security best practices followed by the SECURITY_AGENT when reviewing, auditing, and hardening software systems inside the Fábrica de Sistemas project.

---

## 1. Secure Development Lifecycle (SDL)

- Integrate security from the earliest design stage, not as an afterthought.
- Conduct threat modeling (STRIDE) before writing a single line of code.
- Perform code reviews with a security lens: check for injection, broken auth, insecure deserialization.
- Include SAST (static analysis) and DAST (dynamic analysis) in CI/CD pipelines.
- Establish a vulnerability disclosure and patch management process.

## 2. Authentication and Authorization

- Never roll your own cryptography. Use established libraries (e.g., libsodium, BouncyCastle, Python's `cryptography` package).
- Enforce multi-factor authentication (MFA) for all privileged access.
- Use short-lived JWTs with proper signature validation (RS256 or ES256 preferred over HS256 for distributed systems).
- Implement RBAC (Role-Based Access Control) with least-privilege principles.
- Validate tokens server-side on every request; never trust client-supplied claims without verification.
- Rotate refresh tokens on each use (refresh token rotation).
- Store passwords using bcrypt, Argon2id, or scrypt — never MD5 or SHA-1.

## 3. Input Validation and Output Encoding

- Validate all input at the server side, regardless of client-side validation.
- Use parameterized queries / prepared statements — never string-concatenated SQL.
- Encode output context-appropriately: HTML entity encoding, JSON encoding, URL encoding.
- Apply Content Security Policy (CSP) headers to prevent XSS.
- Sanitize file uploads: check MIME type, extension, and scan content.

## 4. Secrets and Key Management

- Never commit secrets, API keys, or credentials to source control.
- Use secrets managers (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault).
- Rotate secrets regularly; automate rotation where possible.
- Use environment variables for runtime config, scoped via IAM roles or service accounts.
- Apply envelope encryption for data at rest.

## 5. Network and Transport Security

- Enforce TLS 1.2+ everywhere; disable TLS 1.0/1.1 and SSL 2/3.
- Use HSTS (HTTP Strict Transport Security) with long max-age and `includeSubDomains`.
- Apply network segmentation: separate public-facing, application, and database tiers.
- Zero-trust: authenticate and authorize every internal service call; do not rely on network perimeter alone.
- Rate-limit and throttle APIs to prevent brute-force and DoS.

## 6. OWASP Top 10 Mitigations

| Risk | Mitigation |
|------|-----------|
| A01 Broken Access Control | Enforce RBAC/ABAC server-side; deny by default |
| A02 Cryptographic Failures | TLS everywhere; use strong, modern algorithms |
| A03 Injection | Parameterized queries; ORMs; input validation |
| A04 Insecure Design | Threat modeling; security requirements |
| A05 Security Misconfiguration | Hardened defaults; automated config scanning |
| A06 Vulnerable Components | SCA tools (Snyk, Dependabot); regular updates |
| A07 Auth Failures | MFA; session management best practices |
| A08 Software/Data Integrity | Verify signatures; secure CI/CD pipelines |
| A09 Logging Failures | Centralized logging; alerting on anomalies |
| A10 SSRF | Allowlists for outbound requests; network egress controls |

## 7. Security Testing

- Run OWASP ZAP or Burp Suite against every staging environment before release.
- Perform dependency scanning on every build.
- Conduct annual penetration tests by qualified testers.
- Use fuzz testing for parsing code (file parsers, protocol handlers).
- Include security acceptance criteria in every user story.

## 8. Incident Response

- Maintain an incident response runbook.
- Log authentication events, authorization failures, and input validation errors.
- Set alerts for anomalous patterns (excessive failed logins, unusual data access volumes).
- Practice tabletop exercises for common scenarios (data breach, ransomware, insider threat).

---

*Last reviewed: 2026-06. Maintained by SECURITY_AGENT.*
