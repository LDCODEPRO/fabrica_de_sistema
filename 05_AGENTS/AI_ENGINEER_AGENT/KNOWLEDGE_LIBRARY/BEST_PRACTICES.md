# AI_ENGINEER_AGENT — BEST PRACTICES

## Purpose
Core best practices for building, evaluating, and maintaining LLM-powered systems (RAG, agents, prompt engineering, guardrails) used by the AI_ENGINEER_AGENT within the Fábrica de Sistemas project.

---

## 1. Prompt Engineering

- Be explicit about the role, task, output format, and constraints in system prompts.
- Use XML tags to structure complex prompts (especially for Claude): `<context>`, `<instructions>`, `<examples>`, `<output_format>`.
- Include 2–5 diverse few-shot examples for complex tasks; place them before the actual request.
- Specify output format explicitly: JSON schema, markdown headings, bullet points — do not leave format ambiguous.
- Chain of Thought (CoT): instruct the model to think step-by-step before giving a final answer for reasoning tasks. "Think through this carefully before answering."
- Separate instructions from data: do not mix user-supplied content with instructions in the same string without clear delimiters.
- Version and track prompts like code — use a prompt registry or version control.
- Test prompts against an evaluation set before deploying changes.

## 2. RAG (Retrieval-Augmented Generation) Design

- Define the retrieval unit (chunk size) appropriate to the embedding model and use case. Start with 512 tokens with 50-token overlap; adjust based on retrieval quality.
- Always return metadata alongside retrieved chunks (source, date, section heading) so the LLM can cite sources accurately.
- Implement hybrid search: combine dense vector similarity (semantic) with sparse BM25 (keyword matching) for better recall.
- Re-rank retrieved documents with a cross-encoder before passing to the LLM (Cohere Rerank, BGE Reranker).
- Limit retrieved context to what fits well within the LLM's effective context window — more is not always better.
- Implement citation extraction: require the model to cite source document IDs in its response; validate citations against retrieved chunks.
- Ground-truth evaluation: compare RAG responses against known correct answers using automated metrics (RAGAS: faithfulness, answer relevance, context precision, context recall).

## 3. Agent and Tool Design (ReAct Pattern)

- Give agents the minimum set of tools necessary. More tools increase confusion and hallucination risk.
- Each tool should have a precise, unambiguous description: name, purpose, required parameters, return format, error cases.
- Implement tool call validation: check that parameters are valid before execution; return structured errors.
- Add retry logic with exponential backoff for transient tool failures.
- Set a maximum number of reasoning steps (max iterations) to prevent infinite loops.
- Log every agent action, observation, and thought for debugging and auditing.
- Test agents against adversarial inputs: what happens if a tool returns unexpected data? If context is very long? If the user tries to inject instructions?

## 4. Memory Systems

- Distinguish between memory types: in-context (current conversation), external short-term (recent sessions via vector DB), long-term structured (user preferences in SQL), archival (full conversation history in object storage).
- Compress older conversation history when approaching context limits (summarize, don't truncate blindly).
- Separate episodic memory (what happened) from semantic memory (what the user prefers/knows).
- Apply access control to memory: multi-tenant systems must prevent cross-user memory contamination.
- Implement a memory summarization strategy for long-running agents: after N turns, summarize the conversation and store the summary as a memory entry.

## 5. LLM Safety and Guardrails

- Validate all LLM outputs before acting on them, especially for code execution, tool calls, and database queries.
- Apply Constitutional AI principles (Anthropic): self-critique and revision pass to reduce harmful outputs.
- Implement an input classifier to detect prompt injection, jailbreak attempts, PII leakage attempts before passing to the model.
- Apply output filters for PII, profanity, and off-topic content appropriate to the application's domain.
- Never expose raw LLM outputs in security-sensitive contexts (SQL generation → always parameterize, never execute directly).
- Implement rate limiting per user to prevent abuse.
- Log all LLM interactions for audit and future fine-tuning.

## 6. Evaluation

- Build an evaluation dataset before building the system — know what "good" looks like.
- Use multiple evaluation dimensions: correctness, faithfulness (no hallucinations), relevance, helpfulness, safety.
- Automate evaluation with LLM-as-judge for subjective dimensions; use deterministic checks for structured outputs.
- Track metrics over time; regressions in evaluation scores should block deployment.
- Run evaluation against held-out adversarial examples: jailbreaks, edge cases, ambiguous inputs.

## 7. Model Selection and Routing

- Match model capability to task complexity. Reserve large, expensive models for complex reasoning; use smaller, faster, cheaper models for classification, summarization, routing.
- Implement LLM routing: a cheap classifier that routes easy queries to a small model and complex queries to a large model.
- Always implement fallback logic: if the primary model is unavailable, fail gracefully with a user-friendly message.
- Track token usage and cost per feature. Set budget alerts.

## 8. Production Readiness

- Implement structured output parsing with retry: if the model returns malformed JSON, retry with an explicit correction prompt.
- Cache responses for identical or near-identical inputs (semantic caching via Redis + vector similarity).
- Monitor latency percentiles (p50, p95, p99) for every LLM call.
- Implement streaming responses for user-facing applications to improve perceived latency.
- Test with long contexts: ensure prompts don't degrade at maximum context length.

---

*Last reviewed: 2026-06. Maintained by AI_ENGINEER_AGENT.*
