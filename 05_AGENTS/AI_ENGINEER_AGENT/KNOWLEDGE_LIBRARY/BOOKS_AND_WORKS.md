# AI_ENGINEER_AGENT — BOOKS AND WORKS

## Purpose
Canonical papers, books, and technical reports forming the AI_ENGINEER_AGENT's reading list for LLM engineering, RAG, agents, and responsible AI.

---

## Foundational Papers

### "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (RAG Paper)
- **Authors:** Patrick Lewis, Ethan Perez, Aleksandra Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, Douwe Kiela
- **Affiliation:** Facebook AI Research (FAIR)
- **Venue:** NeurIPS 2020
- **URL:** https://arxiv.org/abs/2005.11401
- **Why it matters:** Introduced the RAG architecture: Dense Passage Retrieval (DPR) for document retrieval + BART for generation. Showed that combining retrieval with generation outperforms pure parametric approaches on knowledge-intensive tasks (TriviaQA, WebQ, Natural Questions). The foundational architecture for every modern RAG application.

### "ReAct: Synergizing Reasoning and Acting in Language Models"
- **Authors:** Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao
- **Venue:** ICLR 2023
- **URL:** https://arxiv.org/abs/2210.03629
- **Why it matters:** Introduced the Thought-Action-Observation loop for LLM agents. Shows that combining chain-of-thought reasoning with tool use (search, calculator, etc.) outperforms either alone on diverse benchmarks. The pattern underpins all modern LLM agent frameworks (LangChain AgentExecutor, LlamaIndex ReAct Agent).

### "Constitutional AI: Harmlessness from AI Feedback"
- **Authors:** Yuntao Bai, Saurav Kadavath, Sandipan Kundu, Amanda Askell, Jackson Kernion, Andy Jones, Anna Chen, Anna Goldie, Azalia Mirhoseini, Cameron McKinnon, et al. (Anthropic)
- **Year:** 2022
- **URL:** https://arxiv.org/abs/2212.08073
- **Why it matters:** Introduces Constitutional AI (CAI) — using a set of written principles ("the constitution") to guide AI self-critique and revision during training. Reduces reliance on human feedback for harmlessness. The method behind Claude's safety training. Directly informs how to write system prompts that leverage Claude's alignment properties.

### "Training Language Models to Follow Instructions with Human Feedback" (InstructGPT)
- **Authors:** Long Ouyang, Jeffrey Wu, Xu Jiang, Diogo Almeida, Carroll L. Wainwright, Pamela Mishkin, Chong Zhang, Sandhini Agarwal, Katarina Slama, Alex Ray, et al. (OpenAI)
- **Year:** 2022
- **URL:** https://arxiv.org/abs/2203.02155
- **Why it matters:** Foundational RLHF paper for instruction-following LLMs. Shows that fine-tuning with RLHF significantly reduces harmful outputs and improves helpfulness vs. larger models fine-tuned with supervised learning only. The "alignment tax" (small capability reduction from RLHF) is quantified here.

### "GPT-4 Technical Report"
- **Author:** OpenAI
- **Year:** 2023
- **URL:** https://arxiv.org/abs/2303.08774
- **Why it matters:** Documents GPT-4 capabilities, limitations, safety evaluations, red-teaming methodology, and novel capabilities (multimodal input, longer context). Establishes benchmarks for comparing LLM capabilities.

### "Language Models are Few-Shot Learners" (GPT-3)
- **Authors:** Tom Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared Kaplan, et al. (OpenAI)
- **Venue:** NeurIPS 2020
- **URL:** https://arxiv.org/abs/2005.14165
- **Why it matters:** GPT-3 paper. Introduced and named in-context learning (few-shot prompting) at scale. Showed that 175B parameter models can perform novel tasks without gradient updates, given only examples in the prompt. The paper that made prompt engineering a real discipline.

### "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models"
- **Authors:** Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Brian Ichter, Fei Xia, Ed Chi, Quoc Le, Denny Zhou (Google Brain)
- **Venue:** NeurIPS 2022
- **URL:** https://arxiv.org/abs/2201.11903
- **Why it matters:** Introduced Chain-of-Thought (CoT) prompting — adding intermediate reasoning steps to few-shot examples dramatically improves performance on math, reasoning, and commonsense tasks. The technique "Let's think step by step" (zero-shot CoT, from Kojima et al. 2022) derives from this work.

### "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines"
- **Authors:** Omar Khattab, Arnav Singhvi, Paridhi Maheshwari, Zhiyuan Zhang, Keshav Santhanam, Sri Vardhamanan, Saiful Haq, Ashutosh Sharma, Thomas T. Joshi, Hanna Moazam, Heather Miller, Matei Zaharia, Christopher Potts (Stanford NLP)
- **Year:** 2023
- **URL:** https://arxiv.org/abs/2310.03714
- **Why it matters:** DSPy treats prompt engineering as an optimization problem. Prompts and examples are compiled/optimized automatically given a metric, rather than hand-written. Represents the next generation of prompt engineering tools.

---

## Books

### Designing Machine Learning Systems
- **Author:** Chip Huyen
- **Publisher:** O'Reilly Media, 2022
- **ISBN:** 978-1098107963
- **Why it matters:** Comprehensive guide to the MLOps lifecycle: data collection, feature engineering, training, evaluation, deployment, monitoring, and continual learning. Covers ML system design patterns, data and model versioning, model debugging, and the economics of ML in production.

### Building LLM Powered Applications
- **Author:** Valentina Alto
- **Publisher:** Packt Publishing, 2023
- **ISBN:** 978-1835462317
- **Why it matters:** Practical guide covering LangChain, LlamaIndex, Azure OpenAI, prompt engineering, RAG implementation, and deploying LLM-powered applications. Hands-on with real code examples.

---

## Benchmark Frameworks

### HELM (Holistic Evaluation of Language Models)
- **Organization:** Stanford CRFM
- **URL:** https://crfm.stanford.edu/helm/latest/
- Evaluates LLMs across 42 scenarios and 7 metrics (accuracy, calibration, robustness, fairness, bias, toxicity, efficiency). Used to compare models objectively.

### BIG-bench (Beyond the Imitation Game Benchmark)
- **Organization:** Google Brain and collaborators
- **URL:** https://github.com/google/BIG-bench
- **Paper:** Srivastava et al. (2022), arXiv:2206.04615
- 204 diverse tasks designed to challenge current LLMs. Exposes emergent capabilities and failure modes.

### RAGAS (RAG Assessment)
- **URL:** https://docs.ragas.io/
- Framework for evaluating RAG pipeline quality: faithfulness, answer relevance, context precision, context recall, answer correctness.

---

*Last reviewed: 2026-06. Maintained by AI_ENGINEER_AGENT.*
