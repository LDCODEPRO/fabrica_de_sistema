# AI_ENGINEER — Agent Memory

## Purpose

This directory stores the persistent memory of the AI_ENGINEER agent.
The AI_ENGINEER designs, implements, evaluates, and maintains AI/ML models, LLM integrations, prompt engineering, RAG pipelines, and AI-powered features within the Fabrica de Sistemas.

## What this memory stores

| Category | Description |
|----------|-------------|
| Missions | AI engineering deliverables per mission: models integrated or trained, evaluation metrics achieved, prompt versions shipped, RAG pipeline configurations deployed. |
| Errors | AI failures: prompt injections, model hallucinations that reached users, evaluation regression after a model upgrade, embedding dimension mismatches that broke retrieval, latency SLA breaches. |
| Lessons learned | AI engineering insights: prompt patterns that reduced hallucination rates, chunking strategies that improved retrieval recall, fine-tuning decisions that were or were not worth the cost. |
| Approved patterns | Vetted AI patterns: system prompt structure, few-shot example format, retrieval reranking approach, output validation strategy, cost control tactics (caching, model routing). |
| Previous decisions | Decisions on model selection (GPT-4o, Claude Sonnet, Gemini, etc.), embedding model, vector store, evaluation framework, and prompt versioning approach. |

## How to add an entry

1. Copy the template from `../MEMORY_TEMPLATE.md`.
2. For hallucination or safety failures, include the exact output (sanitised) and the mitigation in CONTENT.
3. When recording model selection decisions, include benchmark results or cost analysis in CONTENT.
4. Append the entry under the correct section heading below.
5. Approved patterns require ARCHITECT and SECURITY review before `APPROVED: true`.

---

## Missions

*(Add AI engineering mission summaries here.)*

---

## Errors

*(Add AI failure records here.)*

---

## Lessons Learned

*(Add AI engineering lessons here.)*

---

## Approved Patterns

*(Add approved AI/ML patterns here.)*

---

## Previous Decisions

*(Add model and tooling decisions here.)*
