# AI_ENGINEER_AGENT — TOOLS AND STANDARDS

## Purpose
Real tools, APIs, and standards used by the AI_ENGINEER_AGENT for building LLM-powered applications, RAG pipelines, and agent systems.

---

## LLM APIs

### Anthropic Claude API
- **URL:** https://docs.anthropic.com/
- **Models (2026):** claude-opus-4, claude-sonnet-4-6, claude-haiku-4 (and previous generations: claude-3-opus, claude-3-5-sonnet, claude-3-5-haiku)
- **Key features:** 200K context window, tool use (function calling), vision (multi-modal), streaming, extended thinking (claude-3-7-sonnet+), system prompt support, prompt caching (up to 90% cost reduction on repeated context), batch API for async processing.
- **Python SDK:** `anthropic` (`pip install anthropic`)
- **Tool use format:** JSON schema for each tool; model returns tool_use blocks.
- **Relevant in Fábrica de Sistemas:** Primary LLM for all agent conversations.

### OpenAI API
- **URL:** https://platform.openai.com/docs/
- **Models (2026):** GPT-4o, GPT-4o-mini, o1, o3 series (reasoning models)
- **Key features:** Function calling, Assistants API (with file retrieval, code interpreter), structured outputs (JSON mode, strict JSON schema), embeddings API (text-embedding-3-small, text-embedding-3-large).
- **Python SDK:** `openai` (`pip install openai`)
- **Embeddings:** `text-embedding-3-small` (1536 dims, cheap), `text-embedding-3-large` (3072 dims, best quality).

---

## LLM Frameworks

### LangChain
- **URL:** https://python.langchain.com/
- **PyPI:** `langchain`, `langchain-anthropic`, `langchain-openai`, `langchain-community`
- **Key components:** LCEL (pipe-based composition), ChatPromptTemplate, VectorstoreRetriever, AgentExecutor, LangSmith tracing.
- **Best for:** Rapid prototyping, flexible composition of chains, broad ecosystem of integrations.

### LlamaIndex
- **URL:** https://docs.llamaindex.ai/
- **PyPI:** `llama-index`
- **Key components:** SimpleDirectoryReader, SentenceSplitter, VectorStoreIndex, QueryEngine, SubQuestionQueryEngine, IngestionPipeline, ServiceContext.
- **Best for:** RAG-focused applications, document-heavy knowledge bases, structured data extraction.

### Semantic Kernel
- **Vendor:** Microsoft (open source)
- **URL:** https://learn.microsoft.com/en-us/semantic-kernel/
- **Languages:** Python, C#, Java
- **Key concepts:** Kernel, Plugins (collections of functions), Memory (vector-based), Planner (auto-generates plan from goal + available plugins).
- **Best for:** Enterprise .NET/C# environments; deep Azure OpenAI and Microsoft 365 integration.

### DSPy
- **Affiliation:** Stanford NLP
- **URL:** https://dspy-docs.vercel.app/
- **PyPI:** `dspy-ai`
- **Key concepts:** Modules (composable LM calls), Signatures (typed I/O declarations), Optimizers (compile prompts + examples automatically), Teleprompter (automatic few-shot example selection).
- **Best for:** Systematic prompt optimization when you have an evaluation metric; research-oriented pipelines.

---

## Embedding Models and Services

### Hugging Face
- **URL:** https://huggingface.co/
- **Relevance:** Model hub for open-source embedding models, LLMs, and fine-tuned models.
- **Key embedding models:** `BAAI/bge-large-en-v1.5`, `sentence-transformers/all-mpnet-base-v2`, `intfloat/multilingual-e5-large`.
- **Transformers library:** `pip install transformers` — load and run models locally.
- **Inference API:** Hosted inference for 200,000+ models.

### Sentence Transformers
- **URL:** https://www.sbert.net/
- **PyPI:** `sentence-transformers`
- Fast and accurate sentence/document embeddings. Pre-trained models optimized for semantic similarity. The standard for local embedding generation.

---

## Vector Databases

### Pinecone
- **URL:** https://www.pinecone.io/
- **Type:** Managed vector database (SaaS)
- **Python SDK:** `pinecone-client`
- Namespaces, metadata filtering, hybrid search, serverless tier.

### Chroma
- **URL:** https://www.trychroma.com/
- **PyPI:** `chromadb`
- Open source, embeddable (in-process) or client/server. Built-in embedding functions. Best for local dev and prototyping.

### Weaviate
- **URL:** https://weaviate.io/
- **PyPI:** `weaviate-client`
- Open source (self-hosted or cloud). GraphQL API, multi-modal, hybrid search, built-in vectorization modules (OpenAI, Cohere, Hugging Face).

---

## Local LLM Serving

### Ollama
- **URL:** https://ollama.com/
- Run LLMs locally on macOS, Linux, Windows. REST API compatible with OpenAI format.
- Models available: Llama 3, Mistral, Phi-3, Gemma, Qwen, DeepSeek Coder, nomic-embed-text (embeddings), and many more.
- Best for: Offline development, privacy-sensitive use cases, cost-free prototyping.

---

## Standards and Practices

### Constitutional AI (CAI)
- Anthropic's method for training AI systems to be helpful, harmless, and honest via written constitutional principles and AI self-critique.

### RLHF (Reinforcement Learning from Human Feedback)
- Training paradigm combining SFT, reward modeling, and PPO optimization. Used by OpenAI (InstructGPT, ChatGPT) and Anthropic (Claude).

### OpenAI Function Calling / Tool Use Specification
- JSON Schema-based format for declaring tools to LLMs. Implemented by OpenAI, Anthropic, Google (Gemini), and others (with minor differences).

### W3C TraceContext (for distributed tracing)
- Standard trace propagation headers (`traceparent`, `tracestate`) relevant for LLM observability pipelines.

### HELM (Holistic Evaluation of Language Models)
- **URL:** https://crfm.stanford.edu/helm/latest/
- Evaluation framework for comprehensive LLM benchmarking.

### BIG-bench
- **URL:** https://github.com/google/BIG-bench
- 204-task benchmark for challenging LLM evaluation.

### RAGAS
- **URL:** https://docs.ragas.io/
- RAG evaluation framework: faithfulness, answer relevance, context precision/recall.

### AI Safety Responsible Scaling Policies
- Anthropic RSP (Responsible Scaling Policy) — https://www.anthropic.com/news/anthropics-responsible-scaling-policy
- Defines safety thresholds and evaluation requirements before training/deploying increasingly capable models.

---

*Last reviewed: 2026-06. Maintained by AI_ENGINEER_AGENT.*
