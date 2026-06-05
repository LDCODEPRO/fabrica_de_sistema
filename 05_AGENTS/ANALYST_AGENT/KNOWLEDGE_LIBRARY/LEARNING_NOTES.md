# LEARNING NOTES — ANALYST AGENT

## Note 1: Stakeholders Don't Know What They Want Until They See What They Don't Want

Requirements elicitation from stakeholders who have never used a system like the one being built is extremely difficult. They cannot articulate what they need in the abstract.  
**Lesson**: Use prototypes, wireframes, or paper sketches as elicitation props. Show a rough version and ask "What's wrong with this?" — people find it far easier to critique than to specify from scratch.  
**Source**: Karl Wiegers, *Software Requirements* (3rd ed.), Chapter 7 (Prototyping)

---

## Note 2: Requirements Are Not Features — They Are Outcomes

Teams frequently document features ("the system shall have a dashboard") instead of requirements ("users shall be able to monitor their top five KPIs without navigating away from their primary work screen"). Features are solutions; requirements are needs.  
**Lesson**: For every proposed feature, ask: "What problem does this solve for which user?" Document the problem as the requirement. The feature is one possible solution.  
**Source**: Ellen Gottesdiener, *Requirements by Collaboration*

---

## Note 3: Ambiguity Is the Most Expensive Bug

Ambiguous requirements — those that can be interpreted in more than one way — produce the most expensive defects because they are discovered late (during testing or after delivery) and require rework at multiple layers (design, code, tests).  
**Lesson**: Review requirements for ambiguous terms before sign-off. Maintain a glossary of domain terms with precise definitions. When in doubt, add an example.  
**Source**: Karl Wiegers, *Software Requirements* (3rd ed.), Chapter 11 (Requirements Quality)

---

## Note 4: Use Cases Are Not User Stories — But Both Have Value

Use cases and user stories serve different purposes. Use cases document complete interaction flows including alternate paths and error scenarios — they are more formal and more complete. User stories are negotiation placeholders for backlog management.  
**Lesson**: Use user stories for backlog management and sprint planning. Use use cases when you need to document complex interaction logic, edge cases, or system behavior for reference during development.  
**Source**: Alistair Cockburn, *Writing Effective Use Cases*; Mike Cohn, *User Stories Applied*

---

## Note 5: Event Storming Surfaces Disagreements That Documents Hide

In traditional requirements workshops, a facilitator presents a document and stakeholders nod. In Event Storming, contradictions become visible when two people place conflicting events in the same sequence.  
**Lesson**: The value of Event Storming is not the output artifacts — it is the conversations that disagreements provoke. A hot spot on the board is more valuable than a clean document that hides a dispute.  
**Source**: Alberto Brandolini, *Introducing EventStorming*

---

## Note 6: "The System Should Be Fast" Is Not a Requirement

Non-functional requirements stated without measurable criteria cannot be tested and will always be interpreted differently by different stakeholders.  
**Lesson**: Convert all quality attribute statements into measurable criteria. "Fast" becomes: "The product listing page shall load in under 2 seconds at the 95th percentile for users on a 4G connection." Use a quality attribute scenario format: [Stimulus] → [System Response] → [Measurable Outcome].  
**Source**: Karl Wiegers, *Software Requirements* (3rd ed.); ISO/IEC 25010 (Software Quality Model)

---

## Note 7: BDD Is a Communication Practice, Not Just a Testing Practice

Teams often adopt Cucumber or SpecFlow for test automation and miss BDD's primary value: forcing business, development, and QA to agree on examples before development starts.  
**Lesson**: The Three Amigos conversation that produces Gherkin scenarios is the core practice. Automated execution is a bonus. If scenarios are written by the developer alone after the fact, BDD's communication value is lost.  
**Source**: Gojko Adzic, *Specification by Example*, Chapter 3

---

## Note 8: Scope Is Defined as Much by What's Out as What's In

Requirements documents that only describe what the system does leave scope ambiguous. Stakeholders will later claim that obvious adjacent features were "obviously included."  
**Lesson**: Every scope document must include an explicit "Out of Scope" section, listing functionality that was considered and deliberately excluded. This prevents scope creep and sets clear expectations.  
**Source**: BABOK v3 — Strategy Analysis; Karl Wiegers, *Software Requirements* (3rd ed.)
