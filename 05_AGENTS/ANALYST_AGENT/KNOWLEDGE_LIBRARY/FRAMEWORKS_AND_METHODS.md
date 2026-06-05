# FRAMEWORKS AND METHODS — ANALYST AGENT

## 1. BABOK v3 Knowledge Areas (IIBA)

**Overview**: The Business Analysis Body of Knowledge (BABOK) defines six knowledge areas that structure all business analysis work.

**Knowledge Areas**:
1. **Business Analysis Planning and Monitoring**: Plan the BA approach, stakeholder engagement, governance, information management, and performance improvements.
2. **Elicitation and Collaboration**: Prepare for elicitation, conduct elicitation, confirm results, and communicate with stakeholders.
3. **Requirements Life Cycle Management**: Trace, maintain, prioritize, assess changes to, and approve requirements.
4. **Strategy Analysis**: Analyze current state, define future state, assess risks, and define the change strategy.
5. **Requirements Analysis and Design Definition**: Specify and model requirements, verify and validate them, identify solution options.
6. **Solution Evaluation**: Measure solution performance, analyze performance gaps, assess solution limitations, recommend actions.

---

## 2. Use Case Method (Alistair Cockburn)

**Overview**: A goal-oriented technique for capturing actor-system interactions at multiple levels of abstraction.

**Goal Levels**:
- **Cloud (Strategic)**: Business goals above the system boundary
- **Sea Level (User Goal)**: What a user achieves in a single session — the primary use case level
- **Fish (Sub-function)**: Steps within a user goal — implementation details

**Fully-Dressed Use Case Structure**:
- Use Case Name
- Primary Actor
- Goal in Context
- Preconditions
- Trigger
- Main Success Scenario (step-by-step)
- Extensions (alternate paths, failure scenarios)
- Postconditions

---

## 3. Behavior-Driven Development (BDD)

**Overview**: A requirements technique where features are specified using structured examples in natural language that can be automated as tests.

**Gherkin Syntax**:
```
Feature: [Feature name]
  As a [role]
  I want [capability]
  So that [benefit]

  Scenario: [Scenario name]
    Given [initial context]
    When [action taken]
    Then [expected outcome]
    And [additional outcome]
```

**Key Tools**: Cucumber (Java/JavaScript/Ruby), SpecFlow (.NET), Behave (Python), Behat (PHP)

**Source**: Gojko Adzic, *Specification by Example*

---

## 4. Event Storming (Alberto Brandolini)

**Overview**: A rapid, collaborative workshop format for exploring complex business domains using colored sticky notes on a large surface.

**Notation**:
- Orange: Domain Events (past tense: "Order Placed", "Payment Confirmed")
- Blue: Commands (imperative: "Place Order", "Confirm Payment")
- Yellow: Aggregates (groups of events and commands that share a root entity)
- Purple: Policies (business rules triggered by events: "whenever X, do Y")
- Green: Read Models (data views that inform decisions)
- Pink: External Systems
- Red: Hot Spots (disagreements, questions, uncertainty)

**Workshop Phases**:
1. Chaotic exploration: everyone places domain events
2. Enforce timeline: arrange events in sequence
3. Add commands and actors
4. Identify aggregates
5. Mark boundaries and hot spots

---

## 5. Domain Storytelling (Stefan Hofer & Henning Schwentner)

**Overview**: A workshop technique where domain experts tell stories about how they work, while a facilitator draws pictographic models of actors, work objects, and activities.

**Notation Elements**:
- Actor (person or system)
- Work object (document, data, physical item)
- Activity (verb connecting actor to work object)
- Sequence numbers (showing order)

**Use**: Discovering domain language, understanding existing processes, identifying bounded contexts.

---

## 6. Requirements Traceability

**Overview**: The ability to trace each requirement forward (to design, code, and tests) and backward (to business goals and stakeholder needs).

**Traceability Matrix Structure**:
- Requirement ID
- Business Goal it serves
- Design element it maps to
- Test cases that verify it
- Status (approved, deferred, implemented, verified)

**Use**: Change impact analysis, test coverage verification, scope audit.

---

## 7. MoSCoW Prioritization

**Overview**: A requirements prioritization technique used to classify requirements by importance.

**Categories**:
- **Must Have**: Essential for the solution to work — non-negotiable
- **Should Have**: Important but not critical for initial release
- **Could Have**: Desirable if time and budget permit
- **Won't Have (this time)**: Explicitly deferred to a future release

**Source**: DSDM (Dynamic Systems Development Method) framework
