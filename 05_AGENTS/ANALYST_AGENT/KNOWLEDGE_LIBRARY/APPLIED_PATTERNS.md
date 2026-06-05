# APPLIED PATTERNS — ANALYST AGENT

## Pattern 1: Five Whys for Root Cause Discovery

**Context**: Stakeholder presents a solution request without explaining the underlying problem.

**Pattern**:
- Ask "Why do you need this?" for the stated request.
- Ask "Why?" again for each answer, up to five iterations.
- Stop when you reach a business outcome or constraint that cannot be further decomposed.
- Document both the original request and the root cause — they often produce different requirements.

**Source**: Taiichi Ohno (Toyota Production System); applied to requirements by Karl Wiegers

---

## Pattern 2: Acceptance Criteria Before Development

**Context**: Stories that enter development without agreed acceptance criteria produce defects and rework.

**Pattern**:
- No story may be pulled into a sprint unless it has at least three acceptance criteria in Given/When/Then format.
- Criteria must be reviewed by a developer and a tester — not just the analyst.
- Any story where the team cannot write acceptance criteria is not ready — it requires further discovery.

**Source**: Gojko Adzic, *Specification by Example*; Mike Cohn, *User Stories Applied*

---

## Pattern 3: Event Storming for Domain Discovery

**Context**: Complex business domains where requirements are distributed across many stakeholders and implicit in existing processes.

**Pattern**:
- Run a Big Picture Event Storming workshop (2-4 hours) with all key domain experts.
- Focus on domain events (what happens in the domain) before solutions or data models.
- Mark hot spots (pink stickies) for all areas of disagreement or uncertainty.
- Follow up with Process Level Event Storming on identified hot spots.
- Convert identified commands and policies into user stories and business rules.

**Source**: Alberto Brandolini, *Introducing EventStorming*

---

## Pattern 4: Requirements Traceability Matrix

**Context**: Projects where scope creep or regression are risks, and where testing coverage must be auditable.

**Pattern**:
- Maintain a traceability matrix from business goal → requirement → design element → test case.
- Update the matrix with each sprint or change request.
- Use the matrix to perform change impact analysis: before implementing a change, identify all downstream elements affected.

**Source**: Karl Wiegers, *Software Requirements* (3rd ed.); ISO/IEC/IEEE 29148

---

## Pattern 5: Story Splitting by Business Rule Variation

**Context**: A user story that is too large for a sprint because it encompasses multiple business rules or conditions.

**Pattern**:
- Identify the distinct business rules or data variations that drive different behavior.
- Create one story per significant variation.
- Example: "User can log in" → split into "User logs in with email/password", "User logs in with Google OAuth", "User logs in with expired password" (forced reset flow).

**Source**: Mike Cohn, *User Stories Applied*; common splitting patterns (Richard Lawrence)

---

## Pattern 6: Risk-Weighted Backlog Ordering

**Context**: Large backlogs where all items appear equally important.

**Pattern**:
- Score each backlog item on two axes: business value (1-5) and technical/delivery risk (1-5).
- Plot items in a value-risk matrix.
- Prioritize high-value/high-risk items first (to reduce risk while delivering value).
- Defer low-value/low-risk items.

**Source**: BABOK v3 — Strategy Analysis; Karl Wiegers, *Software Requirements* (3rd ed.)

---

## Pattern 7: Business Rules Registry

**Context**: Business rules embedded in user stories or code, invisible to the business, and inconsistently applied.

**Pattern**:
- Maintain a Business Rules Registry separate from the backlog.
- Each rule has: ID, plain-language description, source (regulation, policy, convention), effective date, owner, and link to the stories/features that implement it.
- When a rule changes, trace all affected stories and create update requests.

**Source**: BABOK v3 — Requirements Life Cycle Management; Karl Wiegers, *Software Requirements*

---

## Pattern 8: Three-Amigos Review

**Context**: Requirements that are misunderstood by developers or testers, leading to rework.

**Pattern**:
- Before a story enters development, hold a brief Three Amigos session: Product Owner/Analyst, Developer, Tester.
- Each participant reviews the story from their perspective and asks questions.
- The session ends when all three can describe what "done" looks like consistently.
- Any new acceptance criteria discovered are added before the story is accepted.

**Source**: Gojko Adzic, *Specification by Example*; common BDD practice
