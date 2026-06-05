# SECURITY_AGENT — FRAMEWORKS AND METHODS

## Purpose
Security frameworks, methodologies, and structured approaches used by the SECURITY_AGENT to analyze, design, and validate secure systems.

---

## 1. STRIDE Threat Modeling

**Origin:** Microsoft (introduced by Loren Kohnfelder and Praerit Garg, 1999; popularized by Adam Shostack)

STRIDE is a mnemonic for six threat categories applied during threat modeling sessions:

| Letter | Threat | Violated Property | Example |
|--------|--------|-------------------|---------|
| S | Spoofing | Authentication | Attacker impersonates a legitimate user |
| T | Tampering | Integrity | Attacker modifies data in transit or at rest |
| R | Repudiation | Non-repudiation | User denies performing an action |
| I | Information Disclosure | Confidentiality | Sensitive data exposed to unauthorized parties |
| D | Denial of Service | Availability | Service flooded and made unavailable |
| E | Elevation of Privilege | Authorization | User gains higher permissions than granted |

**How to apply:**
1. Draw a Data Flow Diagram (DFD) of the system.
2. Identify trust boundaries.
3. For each element (process, data store, data flow, external entity), enumerate applicable STRIDE threats.
4. For each threat, define a mitigation or accepted risk.

---

## 2. OWASP Application Security Verification Standard (ASVS)

**Levels:**
- **Level 1 (Opportunistic):** Basic security hygiene; automated scanning sufficient.
- **Level 2 (Standard):** Recommended for most applications handling sensitive data.
- **Level 3 (Advanced):** For high-value targets (banking, healthcare, critical infrastructure).

**Domains covered:** Architecture, Authentication, Session Management, Access Control, Validation & Sanitization, Stored Cryptography, Error Handling & Logging, Data Protection, Communications, Malicious Code, Business Logic, Files & Resources, API & Web Service, Configuration.

---

## 3. Zero Trust Architecture (ZTA)

**Origin:** Coined by John Kindervag at Forrester Research (2010). Formalized by NIST in SP 800-207 (2020).

**Core principles:**
- Never trust, always verify — no implicit trust based on network location.
- Least-privilege access — grant only the minimum permissions required.
- Assume breach — design systems assuming the perimeter is already compromised.
- Micro-segmentation — isolate workloads; lateral movement should be impossible or very difficult.
- Continuous verification — authenticate and authorize every request, every time.

**Implementation pillars:**
1. Identity (strong auth, MFA, SSO)
2. Devices (endpoint compliance, MDM)
3. Network (micro-segmentation, encrypted traffic)
4. Applications (RBAC, ABAC, API gateways)
5. Data (classification, DLP, encryption)

---

## 4. NIST Cybersecurity Framework (CSF)

**Version:** 2.0 (2024)

**Functions:**
- **Govern:** Establish and monitor cybersecurity risk management strategy.
- **Identify:** Understand the organizational context and assets.
- **Protect:** Implement safeguards.
- **Detect:** Discover cybersecurity events.
- **Respond:** Take action on detected incidents.
- **Recover:** Restore capabilities.

---

## 5. PTES — Penetration Testing Execution Standard

**URL:** http://www.pentest-standard.org/

**Phases:**
1. Pre-engagement interactions
2. Intelligence gathering
3. Threat modeling
4. Vulnerability analysis
5. Exploitation
6. Post-exploitation
7. Reporting

---

## 6. MITRE ATT&CK Framework

**URL:** https://attack.mitre.org/

A knowledge base of adversary tactics, techniques, and procedures (TTPs) observed in real-world attacks. Used for:
- Threat intelligence mapping
- Detection gap analysis
- Purple team exercises
- Incident response

**Structure:** Tactics (high-level goals, e.g., Initial Access, Persistence, Privilege Escalation) → Techniques (specific methods) → Sub-techniques.

---

## 7. Microsoft Security Development Lifecycle (SDL)

**Origin:** Microsoft, formalized 2004. Reference: "The Security Development Lifecycle" by Michael Howard & Steve Lipner (Microsoft Press, 2006).

**Phases:**
1. Training (security awareness for all team members)
2. Requirements (security and privacy requirements)
3. Design (threat modeling, attack surface reduction)
4. Implementation (banned APIs, static analysis)
5. Verification (fuzz testing, dynamic analysis, code review)
6. Release (incident response planning, final review)
7. Response (handling post-release vulnerabilities)

---

## 8. RBAC and ABAC Models

**RBAC (Role-Based Access Control):**
- Users are assigned to roles; roles have permissions.
- Simple, auditable, and widely supported.
- Reference: NIST RBAC model (NIST IR 7316).

**ABAC (Attribute-Based Access Control):**
- Access decisions based on attributes of users, resources, environment.
- More flexible than RBAC; suited for complex, dynamic environments.
- Policy language: XACML (eXtensible Access Control Markup Language).

---

## 9. OAuth 2.0 and OpenID Connect (OIDC)

- **OAuth 2.0** (RFC 6749): Authorization framework for delegated access.
- **OIDC** (built on OAuth 2.0): Identity layer providing authentication.
- **JWT** (RFC 7519): Token format used by OIDC. Always validate signature, issuer (`iss`), audience (`aud`), and expiry (`exp`).
- **PKCE** (RFC 7636): Required for public clients (SPAs, mobile) to prevent authorization code interception attacks.

---

*Last reviewed: 2026-06. Maintained by SECURITY_AGENT.*
