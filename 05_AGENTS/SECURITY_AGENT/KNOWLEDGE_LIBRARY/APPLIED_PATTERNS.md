# SECURITY_AGENT — APPLIED PATTERNS

## Purpose
Concrete, reusable security patterns applied during code review, architecture design, and security hardening within the Fábrica de Sistemas project.

---

## Pattern 1: Defense in Depth

**Problem:** A single security control can be bypassed.
**Solution:** Layer multiple independent controls so that defeating one does not compromise the whole system.

**Implementation layers:**
1. Network: Firewall, WAF, DDoS protection
2. Application: Input validation, output encoding, authentication
3. Data: Encryption at rest, column-level encryption for PII
4. Logging: Centralized audit trail, anomaly detection
5. Process: Code review, penetration testing, incident response

**Example in Fábrica de Sistemas context:** API endpoint protected by: (a) JWT authentication, (b) RBAC authorization check, (c) rate limiting, (d) input schema validation, (e) query parameterization.

---

## Pattern 2: Secure Token Handling (JWT)

**Problem:** JWT tokens are often misconfigured or validated incorrectly.

**Correct validation checklist:**
- [ ] Verify signature using the correct public key or secret.
- [ ] Reject tokens with `alg: none`.
- [ ] Validate `iss` (issuer) matches expected value.
- [ ] Validate `aud` (audience) matches this service.
- [ ] Validate `exp` (expiry) and `nbf` (not before).
- [ ] Use short expiry for access tokens (15 min – 1 hour).
- [ ] Use refresh token rotation: invalidate old refresh token on each use.
- [ ] Store tokens in httpOnly, Secure cookies (not localStorage) in browser contexts.

---

## Pattern 3: Parameterized Query Pattern

**Problem:** String-concatenated SQL is vulnerable to SQL injection (OWASP A03).

**Anti-pattern (vulnerable):**
```python
query = "SELECT * FROM users WHERE email = '" + user_input + "'"
```

**Correct pattern:**
```python
# Using psycopg2 (PostgreSQL)
cursor.execute("SELECT * FROM users WHERE email = %s", (user_input,))

# Using SQLAlchemy ORM
user = session.query(User).filter(User.email == user_input).first()
```

---

## Pattern 4: Secrets Injection via Environment Variables

**Problem:** Hardcoded credentials in source code lead to exposure.

**Pattern:**
```python
import os

DATABASE_URL = os.environ["DATABASE_URL"]   # Raises KeyError if missing — fast fail
SECRET_KEY = os.environ["SECRET_KEY"]
```

**In production:** Inject via HashiCorp Vault Agent sidecar, Kubernetes Secrets (with external-secrets-operator), or cloud IAM (AWS SSM Parameter Store with IAM role).

---

## Pattern 5: Input Validation — Parse, Don't Validate

**Principle (coined by Alexis King):** Instead of validating raw input and using it conditionally, parse it into a well-typed domain object that cannot represent invalid state.

**Example (Python with Pydantic):**
```python
from pydantic import BaseModel, EmailStr, constr

class UserRegistrationRequest(BaseModel):
    email: EmailStr
    username: constr(min_length=3, max_length=50, pattern=r'^[a-zA-Z0-9_]+$')
    password: constr(min_length=12)
```

If parsing fails, a validation error is raised before any business logic runs.

---

## Pattern 6: RBAC Authorization Guard

**Problem:** Broken access control (OWASP A01) — users access resources they should not.

**Pattern (middleware-based):**
```python
def require_role(*roles):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            current_user = get_current_user()  # From validated JWT
            if current_user.role not in roles:
                raise HTTPException(status_code=403, detail="Forbidden")
            return func(*args, **kwargs)
        return wrapper
    return decorator

@app.get("/admin/users")
@require_role("admin", "super_admin")
def list_users():
    ...
```

---

## Pattern 7: Security Headers Middleware

**Problem:** Missing HTTP security headers leave browsers vulnerable to XSS, clickjacking, MIME sniffing.

**Headers to set:**
```
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

---

## Pattern 8: Audit Logging Pattern

**What to log:**
- Authentication events (success, failure, MFA usage)
- Authorization failures (403 responses)
- Data access for sensitive records (PII, financial data)
- Administrative actions (role changes, config changes)
- Input validation failures (potential attack attempts)

**What NOT to log:**
- Passwords (even failed attempts — log the fact, not the value)
- Full credit card numbers
- Unmasked SSNs or tax IDs
- Full JWT tokens

**Log structure (structured JSON):**
```json
{
  "timestamp": "2026-06-05T10:23:45Z",
  "event_type": "auth.login.failure",
  "user_id": "usr_abc123",
  "ip_address": "192.0.2.45",
  "user_agent": "Mozilla/5.0...",
  "reason": "invalid_password",
  "request_id": "req_xyz789"
}
```

---

## Pattern 9: Threat Modeling Checklist for New Features

Before each feature ships:
1. [ ] Have DFDs been updated to reflect new data flows?
2. [ ] Have new trust boundaries been identified?
3. [ ] Has STRIDE been applied to new processes and data stores?
4. [ ] Are all identified threats mitigated or explicitly accepted?
5. [ ] Have security acceptance criteria been added to the user story?
6. [ ] Has a security-focused code review been performed?

---

*Last reviewed: 2026-06. Maintained by SECURITY_AGENT.*
