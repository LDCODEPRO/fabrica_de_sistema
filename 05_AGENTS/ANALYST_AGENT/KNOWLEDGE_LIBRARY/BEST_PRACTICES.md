# BEST PRACTICES — ANALYST AGENT

## 1. Requirements Elicitation

- **Use multiple elicitation techniques**: No single technique surfaces all requirements. Combine interviews, workshops, observation, document analysis, and prototyping.
- **Elicit from diverse stakeholders**: Include end users, business owners, operations staff, and technical leads. Requirements from only one group produce incomplete or biased specifications.
- **Ask "why" before "what"**: Understand the business problem before accepting a proposed solution. Stakeholders often describe a solution when they should describe a problem.
- **Document assumptions explicitly**: Every assumption made during elicitation must be written down, assigned to a stakeholder for validation, and tracked until resolved.

## 2. Writing Requirements

- **Use active voice and specific verbs**: "The system shall display..." not "It will be possible to display..."
- **One requirement per statement**: Compound requirements using "and" or "or" are ambiguous and cannot be tested individually.
- **Avoid ambiguous terms**: Words like "fast," "user-friendly," "appropriate," and "easy" require measurable definitions before use.
- **Distinguish functional from non-functional requirements**: Functional requirements describe what the system does; non-functional requirements describe constraints on how it does it (performance, security, availability, usability).

## 3. User Stories

- Apply the INVEST criteria: Independent, Negotiable, Valuable, Estimable, Small, Testable.
- Format: "As a [role], I want [capability], so that [benefit]."
- Never write a user story without acceptance criteria.
- Acceptance criteria format: Given [context] / When [action] / Then [observable outcome].
- Stories at the top of the backlog must have complete, reviewed acceptance criteria before sprint planning.

## 4. Use Cases

- Use cases describe actor-system interactions across a complete scenario, not just the happy path.
- Every use case must include: primary actor, goal, preconditions, main success scenario, and extension scenarios (alternate paths and failure handling).
- Use case diagrams are system boundary tools — they show what the system does, not how it does it.

## 5. Scope Management

- Define the system boundary explicitly before requirements gathering begins.
- Use a scope definition document to record what is in scope, what is explicitly out of scope, and what is deferred.
- Any scope addition after baseline must go through a formal change request with impact assessment.

## 6. Risk and Business Rules

- Identify risks by category: technical, business, regulatory, integration, data quality.
- Rate risks by probability and impact. Track in a risk register with mitigation owners.
- Separate business rules from functional requirements — business rules change independently of features.
- Document business rules in a structured format: ID, description, source, effective date, owner.

## 7. Acceptance and Validation

- Acceptance criteria must be agreed upon by the Product Owner and at least one end-user representative before development.
- Use BDD-style (Gherkin) acceptance criteria for complex feature interactions.
- Schedule requirements walkthroughs with developers and testers before sprint start — they often surface gaps before they become defects.
