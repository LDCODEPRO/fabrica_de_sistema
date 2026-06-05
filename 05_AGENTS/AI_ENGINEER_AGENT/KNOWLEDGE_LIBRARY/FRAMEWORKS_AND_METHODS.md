# AI_ENGINEER_AGENT — FRAMEWORKS AND METHODS

## Purpose
Structured frameworks and methodologies used by the AI_ENGINEER_AGENT for building, evaluating, and maintaining LLM systems.

---

## 1. ReAct Pattern (Reasoning + Acting)

**Source:** Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" (ICLR 2023)

**The loop:**
```
[System Prompt + Tools Definition]
User: <question>

Thought: I need to find X to answer this question.
Action: search_tool(query="X")
Observation: [result from search_tool]
Thought: Based on the result, I can now answer.
Final Answer: <answer with citations>
```

**Key properties:**
- Thoughts are explicit and logged (interpretable).
- Each action produces an observation the model reads before proceeding.
- The loop terminates when the model produces a Final Answer or reaches max_iterations.

**Failure modes to handle:**
- Model loops without progress → detect repeated tool calls, inject "you seem stuck, try a different approach" message.
- Tool returns an error → model must handle gracefully, not assume success.
- Context window exhaustion → summarize observation history before it overflows.

---

## 2. RAG Architecture

**Source:** Lewis et al. (NeurIPS 2020); refined by LlamaIndex and LangChain implementations

### Standard RAG Pipeline:

```
Query → Embed Query → Vector Search → [Top-K Chunks] → LLM → Answer
```

### Advanced RAG Pipeline (production-grade):

```
Query
  → Query rewriting/expansion (HyDE or multi-query)
  → Hybrid search (dense vector + BM25 sparse)
  → Reranking (cross-encoder)
  → Context assembly (dedup, truncation to fit context window)
  → LLM generation with citation instruction
  → Output validation (faithfulness check, citation verification)
  → Response to user
```

### Chunking Strategies:
| Strategy | Description | Best For |
|----------|-------------|---------|
| Fixed-size | Split every N tokens with M overlap | General purpose |
| Recursive character | Split on paragraph → sentence → word | Structured documents |
| Semantic | Split when topic changes (embedding similarity drop) | Long, varied documents |
| Document-specific | Parse headings, sections (Markdown, HTML) | Well-structured docs |

---

## 3. LangChain Framework

**Creator:** Harrison Chase (LangChain Inc., 2022)
**URL:** https://python.langchain.com/

**Core abstractions:**
- **LCEL (LangChain Expression Language):** Composable pipeline syntax using the `|` pipe operator.
- **Runnables:** Any callable component (prompt, model, parser, retriever) that can be chained.
- **ChatPromptTemplate:** Structured prompt with roles (system, human, AI).
- **BaseRetriever:** Interface for document retrieval (vector store, BM25, web search).
- **AgentExecutor:** Runs the ReAct loop with a toolset.
- **LangSmith:** Observability, tracing, and evaluation platform.

**Basic RAG chain (LCEL):**
```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_anthropic import ChatAnthropic

chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | ChatAnthropic(model="claude-sonnet-4-6")
    | StrOutputParser()
)
```

---

## 4. LlamaIndex Framework

**Creator:** Jerry Liu (LlamaIndex Inc., 2022)
**URL:** https://docs.llamaindex.ai/

**Core abstractions:**
- **Document / Node:** The fundamental data unit. Documents are split into Nodes (chunks) during ingestion.
- **Index:** The storage abstraction (VectorStoreIndex, SummaryIndex, KnowledgeGraphIndex).
- **QueryEngine:** Retrieves relevant Nodes and synthesizes an answer.
- **SubQuestionQueryEngine:** Decomposes a complex question into sub-questions, answers each, combines.
- **IngestionPipeline:** Transformations applied during indexing (chunking, embedding, metadata extraction).

---

## 5. Constitutional AI (CAI) Method

**Source:** Bai et al. (Anthropic, 2022), "Constitutional AI: Harmlessness from AI Feedback"

**Two-stage process:**
1. **Supervised Learning stage:** Model generates responses, critiques them against constitutional principles, revises them. Revised responses used for SL fine-tuning.
2. **RL stage (RLAIF):** Feedback for the reward model comes from the AI itself (judging which of two responses better follows the constitution), not exclusively from humans.

**Constitutional principles (example):**
- Choose the response that is less likely to be used by a malicious actor.
- Choose the response that a reasonable person would consider most ethical.
- Choose the response that is least harmful and least dangerous.

**Practical implication for prompting:** Claude has been trained against a constitution. When writing system prompts, design them to work with Claude's constitutional alignment, not against it. Explicit harmful instructions will be refused; ambiguous ones should be made unambiguous.

---

## 6. RLHF (Reinforcement Learning from Human Feedback)

**Source:** Ouyang et al. (OpenAI, 2022); Stiennon et al. (OpenAI, 2020); Christiano et al. (OpenAI, 2017)

**Three-stage process:**
1. **Supervised Fine-Tuning (SFT):** Fine-tune the pretrained model on curated (prompt, ideal response) pairs from human labelers.
2. **Reward Model Training:** Train a reward model on human preference pairs (which of two responses is better). Reward model predicts human preference for any response.
3. **RL Optimization (PPO):** Use PPO (Proximal Policy Optimization) to fine-tune the SFT model to maximize reward model scores while applying a KL divergence penalty to prevent diverging too far from the SFT model.

---

## 7. Prompt Engineering Methods

| Method | Description | Use Case |
|--------|-------------|---------|
| Zero-shot | Task description only, no examples | Simple, well-understood tasks |
| Few-shot (in-context learning) | 2–8 examples in the prompt | Complex formats, classification |
| Chain-of-Thought (CoT) | Ask model to show reasoning steps | Math, logic, multi-step reasoning |
| Zero-shot CoT | Append "Let's think step by step" | Quick boost without examples |
| Self-Consistency | Sample multiple CoT answers, take majority vote | High-accuracy reasoning |
| HyDE (Hypothetical Document Embeddings) | Generate a hypothetical answer, embed it for retrieval | RAG query expansion |
| Tree of Thoughts | Branch and evaluate multiple reasoning paths | Complex planning problems |

---

## 8. Evaluation Methods

### LLM-as-Judge
- Use a capable LLM (Claude Opus, GPT-4) to score model outputs against criteria.
- Define scoring rubric explicitly in the judge prompt.
- Validate judge correlation with human ratings before trusting it.

### RAGAS Metrics
- **Faithfulness:** Does the answer contain only claims supported by the retrieved context?
- **Answer Relevance:** Is the answer relevant to the question?
- **Context Precision:** Is the retrieved context relevant (precision)?
- **Context Recall:** Does retrieved context contain all information needed for the answer?

### Reference-Based Metrics (for tasks with ground truth)
- Exact Match (EM): Does the answer exactly match the reference?
- F1 Token Match: Token overlap between prediction and reference.
- ROUGE-L: Longest common subsequence overlap.
- BERTScore: Semantic similarity using BERT embeddings.

---

*Last reviewed: 2026-06. Maintained by AI_ENGINEER_AGENT.*
