# SECURITY_AGENT — LEARNING NOTES

## Purpose
Evolving notes capturing lessons learned, emerging threats, and practical insights accumulated through application of security knowledge. Updated incrementally as new patterns or incidents are observed.

---

## Note 001 — JWT "alg:none" Attack
**Date:** 2026-06
**Source insight:** Michal Zalewski, OWASP JWT Cheat Sheet

Many JWT libraries historically accepted tokens with `"alg": "none"`, effectively bypassing signature verification. The attack: take a valid token, decode the payload, modify claims, set `alg` to `none`, strip the signature, re-encode. Any library that doesn't explicitly reject `alg:none` is vulnerable.

**Lesson:** Always configure JWT libraries to an explicit allowlist of accepted algorithms. Never use `decode(token)` without specifying `algorithms=["RS256"]` or equivalent.

---

## Note 002 — Password Storage: Why bcrypt Still Matters
**Date:** 2026-06
**Source insight:** NIST SP 800-63B, Troy Hunt (HaveIBeenPwned)

Argon2id is now the OWASP-recommended choice (winner of the Password Hashing Competition, 2015). bcrypt is still acceptable but has a 72-byte input limit. SHA-256/SHA-512 are NOT acceptable for password storage because they are too fast — GPUs can compute billions of hashes per second.

**Recommended parameters (2026):**
- Argon2id: m=19456 (19 MiB), t=2, p=1
- bcrypt: work factor 12 minimum

---

## Note 003 — CSRF in the Age of SPAs
**Date:** 2026-06
**Source insight:** OWASP CSRF Cheat Sheet

Classic CSRF mitigations (synchronizer token pattern, double-submit cookie) are still needed in traditional server-rendered apps. For SPAs using `Authorization: Bearer <token>` headers, CSRF is not typically exploitable because custom headers cannot be set by cross-origin forms. However, if cookies are used for auth in SPAs, CSRF protection must be re-applied.

**Lesson:** Match the CSRF mitigation strategy to the actual authentication mechanism in use.

---

## Note 004 — Supply Chain Attacks via Dependencies
**Date:** 2026-06
**Source insight:** SolarWinds (2020), event-stream (npm, 2018), ua-parser-js (npm, 2021)

Supply chain attacks are among the fastest-growing attack vectors. Key defenses:
1. Use lock files (`package-lock.json`, `poetry.lock`, `Pipfile.lock`) — pin exact versions.
2. Enable Dependabot or Snyk for automated CVE alerting.
3. Verify package checksums / use `--require-hashes` in pip.
4. Audit newly added dependencies before merging PRs.
5. Consider using a private artifact registry (Nexus, Artifactory) to mirror external packages.

---

## Note 005 — SSRF (Server-Side Request Forgery) Patterns
**Date:** 2026-06
**Source insight:** OWASP Top 10 A10 (2021), Orange Tsai research

SSRF lets attackers cause the server to make HTTP requests to internal resources. In cloud environments, this commonly leads to metadata service access (e.g., AWS EC2 Instance Metadata at 169.254.169.254) and credential theft.

**Mitigations:**
- Validate and allowlist URL schemes and destinations before making outbound requests.
- Block access to RFC-1918 addresses and link-local addresses (169.254.0.0/16).
- Use IMDSv2 (AWS) which requires a session token — prevents simple GET-based SSRF.
- Apply network egress controls; outbound traffic should only reach expected destinations.

---

## Note 006 — Cryptographic Agility vs. Protocol Pinning
**Date:** 2026-06
**Source insight:** Bruce Schneier, "Applied Cryptography" (2nd ed.); NIST migration guidance

Cryptographic agility (ability to swap algorithms without code changes) is valuable when algorithms are deprecated (MD5, SHA-1, 3DES). However, it can introduce vulnerabilities if downgrade attacks force weak algorithms. The solution: support agility in the implementation but enforce minimum algorithm standards via configuration policy, not by trusting the client to negotiate.

---

## Note 007 — Broken Object Level Authorization (BOLA / IDOR)
**Date:** 2026-06
**Source insight:** OWASP API Security Top 10 2023 (API1:2023)

BOLA (also called IDOR — Insecure Direct Object Reference) is the #1 API security risk. Occurs when an API endpoint accepts a user-supplied identifier and fetches the corresponding resource without verifying the requesting user owns it.

**Vulnerable example:**
```
GET /api/invoices/42  # Returns invoice 42 regardless of who is logged in
```

**Fix:** Always cross-check that the authenticated user has access to the requested object:
```python
invoice = db.get(Invoice, invoice_id)
if invoice.owner_id != current_user.id:
    raise HTTPException(status_code=403)
```

---

## Note 008 — Security Implications of LLM Integration
**Date:** 2026-06
**Source insight:** OWASP Top 10 for LLM Applications (2023), Simon Willison's research

As LLMs are integrated into the Fábrica de Sistemas project, new threat vectors emerge:
- **Prompt injection:** Attackers embed instructions in user input that override system prompts.
- **Data exfiltration via prompts:** Model may be tricked into including sensitive context in outputs.
- **Over-reliance:** Using LLM output in security-sensitive contexts without human review.

**Mitigations:**
- Treat all LLM inputs/outputs as untrusted.
- Do not pass raw user input directly into system prompts.
- Separate privileged instructions from user-controlled inputs.
- Apply output validation before acting on LLM-generated code or commands.

---

*Last updated: 2026-06. Maintained by SECURITY_AGENT.*
