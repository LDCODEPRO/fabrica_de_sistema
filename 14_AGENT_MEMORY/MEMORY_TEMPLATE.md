# Memory Entry Template — Fabrica de Sistemas

Use this template for every entry added to an agent memory file.
Copy the block below, fill every field, and append it under the appropriate section heading in the agent's README.md.

---

## Entry

| Field        | Value |
|--------------|-------|
| MISSION_ID   | MISSION-XXX |
| DATE         | YYYY-MM-DD |
| AGENT        | ARCHITECT / DEVELOPER / QA / DOCS / ORCHESTRATOR / ANALYST / DESIGNER / SECURITY / DEVOPS / DATA_ENGINEER / AI_ENGINEER |
| TYPE         | MISSION \| ERROR \| LESSON \| PATTERN \| DECISION |
| TITLE        | Short descriptive title (max 80 chars) |
| APPROVED     | true \| false |
| SOURCE       | Book, article, framework, or "internal" (omit if not applicable) |

### CONTENT

Describe in plain language what happened, what was decided, or what was learned.
Be specific — vague entries have no value. Include context such as the technology,
the constraint, and the trade-off considered.

### OUTCOME

What was the result? Was the approach successful? Was it rolled back? Did it cause
a follow-up issue? Include quantitative data where available (e.g., "reduced build
time by 40%").

---

## Field Definitions

| Field      | Description |
|------------|-------------|
| MISSION_ID | Identifier of the mission that generated this memory (format: MISSION-NNN). |
| DATE       | ISO date (YYYY-MM-DD) when the entry was created or last updated. |
| AGENT      | The agent role that owns this memory entry. |
| TYPE       | Category of the entry — see types below. |
| TITLE      | One-line summary; used for quick scanning of the memory file. |
| CONTENT    | Full narrative description with enough detail to be actionable. |
| OUTCOME    | What actually happened after the decision or lesson was applied. |
| APPROVED   | `true` if the practice/pattern is sanctioned for reuse; `false` if pending review or deprecated. |
| SOURCE     | The authoritative reference that supports this entry, if any. |

## Entry Types

| Type     | When to use |
|----------|-------------|
| MISSION  | Summary of a completed mission: goals, approach, key decisions. |
| ERROR    | A mistake, bug, or failure — captured so it is not repeated. |
| LESSON   | An insight gained that changes how the agent should act in future. |
| PATTERN  | A reusable solution or architectural pattern that proved effective. |
| DECISION | A significant design or technical decision with its rationale. |

## Conventions

- One entry per mission event. Do not merge multiple incidents into one entry.
- Set `APPROVED: false` on first creation. An ORCHESTRATOR or senior agent must
  review and flip it to `true` before the pattern is considered safe to reuse.
- When a pattern is superseded, mark it `APPROVED: false` and add a note in
  OUTCOME referencing the new entry that replaces it.
- Keep CONTENT factual and concise. Avoid opinions without evidence.
