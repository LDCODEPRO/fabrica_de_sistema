# AI_ENGINEER_AGENT — MASTERS AND REFERENCES

## Purpose
Key researchers, teams, and practitioners whose published work informs the AI_ENGINEER_AGENT's knowledge of LLMs, RAG, agent systems, and responsible AI.

---

## Anthropic Research Team

**Organization:** Anthropic (founded 2021 by Dario Amodei, Daniela Amodei, and colleagues from OpenAI)

**Key published works:**
- "Constitutional AI: Harmlessness from AI Feedback" (Bai et al., 2022) — introduced the Constitutional AI (CAI) training methodology where a model critiques and revises its own outputs against a set of principles, replacing human feedback for harmlessness training.
- "Training a Helpful and Harmless Assistant with Reinforcement Learning from Human Feedback" (Bai et al., 2022) — foundational RLHF paper for Claude.
- "Scaling Laws for Neural Language Models" (Kaplan et al., 2020 — pre-Anthropic, when team was at OpenAI) — mathematical scaling laws for LLM capability vs. parameters, data, compute.
- Claude model card and system prompt documentation.

**Relevance:** Anthropic Claude is the primary LLM in the Fábrica de Sistemas project. Understanding Constitutional AI and Anthropic's approach to safety informs how to design prompts and guardrails.

---

## OpenAI Research Team

**Organization:** OpenAI (founded 2015)

**Key published works:**
- "GPT-4 Technical Report" (OpenAI, 2023) — describes capabilities, limitations, and safety evaluations of GPT-4. Notable for introducing systematic red-teaming methodology and the model's multi-modal capabilities.
- "Improving Language Understanding by Generative Pre-Training" (Radford et al., 2018) — GPT-1 paper that established the pretraining + fine-tuning paradigm.
- "Language Models are Few-Shot Learners" (Brown et al., 2020) — GPT-3 paper that introduced in-context learning at scale.
- "Training Language Models to Follow Instructions with Human Feedback" (Ouyang et al., 2022) — InstructGPT paper; foundational RLHF for instruction-following.

---

## Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao

**Paper:** "ReAct: Synergizing Reasoning and Acting in Language Models" (2022)
- **Venue:** ICLR 2023
- **URL:** https://arxiv.org/abs/2210.03629

**What it introduced:** The ReAct pattern — interleaving language model reasoning (Thought) with action execution (Act) and observation of results. Combines the chain-of-thought reasoning capability of LLMs with tool use in a single, interpretable loop.

**Relevance:** The foundational pattern for all LLM agents in this project. Every agent loop that calls tools and observes results implements some form of ReAct.

---

## Patrick Lewis, Ethan Perez, Aleksandra Piktus, et al.

**Paper:** "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (2020)
- **Venue:** NeurIPS 2020
- **Affiliation:** Facebook AI Research (FAIR)
- **URL:** https://arxiv.org/abs/2005.11401

**What it introduced:** The RAG architecture — combining a retrieval component (Dense Passage Retrieval) with a generative model (BART) for knowledge-intensive tasks. The key insight: parametric memory (weights) for reasoning + non-parametric memory (retrieved documents) for factual grounding.

**Relevance:** Every RAG implementation in this project implements the Lewis et al. architecture with modern components (dense retrieval → rerank → generate).

---

## Andrej Karpathy

**Role:** AI researcher and educator; formerly Director of AI at Tesla; founding member of OpenAI; currently independent.

**Key works:**
- "Neural Networks: Zero to Hero" — YouTube lecture series (2023) covering backpropagation from scratch, bigram models, MLP, RNN, Transformer architecture (nanoGPT). Available free at youtube.com/@AndrejKarpathy.
- "The Spelled-Out Intro to Language Modeling: Building makemore" — detailed tutorial series.
- "A Recipe for Training Neural Networks" (2019 blog post) — practical debugging guide for training NNs.
- "Hacker's Guide to Language Models" (2023 YouTube video) — accessible overview of how LLMs work.

**Relevance:** Deep mechanistic understanding of Transformer architectures and training dynamics enables better prompt engineering and fine-tuning decisions.

---

## Harrison Chase

**Role:** Co-founder and CEO of LangChain; open-source contributor.

**Key contributions:**
- Creator of **LangChain** (2022) — the Python and JavaScript framework for building LLM applications. Introduced the "chain" abstraction for composing LLM calls, the ReAct agent executor, the document loader/text splitter/retriever/vector store abstraction for RAG, and LangSmith for tracing and evaluation.

**Relevance:** LangChain's abstractions (Chains, Runnables, LCEL — LangChain Expression Language) are widely used as reference implementations for agent and RAG patterns.

---

## Jerry Liu

**Role:** Co-founder and CEO of LlamaIndex (formerly GPT Index); open-source contributor.

**Key contributions:**
- Creator of **LlamaIndex** (2022) — a data framework for LLM applications focused on connecting LLMs to external data. Introduced the Index abstraction (VectorStoreIndex, SummaryIndex, KnowledgeGraphIndex), the QueryEngine, and the SubQuestion decomposition pattern for multi-document RAG.

**Relevance:** LlamaIndex's data ingestion pipeline and retrieval abstractions provide patterns for building production-quality RAG systems.

---

## Longer Peng, Santiago Ontanon, et al. (RLHF)

**Paper:** "Learning to summarize from human feedback" (Stiennon et al., 2020)
- **Affiliation:** OpenAI
- **URL:** https://arxiv.org/abs/2009.01325
- **What it introduced:** Demonstrated that RLHF (Reinforcement Learning from Human Feedback) significantly improves alignment of language model outputs to human preferences, using summarization as a testbed.

---

## Omar Khattab et al. (DSPy)

**Paper:** "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines" (2023)
- **Affiliation:** Stanford NLP
- **URL:** https://arxiv.org/abs/2310.03714
- **What it introduced:** DSPy — a framework that treats prompts and few-shot examples as learnable parameters optimized via a compiler, rather than hand-written strings.

---

*Last reviewed: 2026-06. Maintained by AI_ENGINEER_AGENT.*
