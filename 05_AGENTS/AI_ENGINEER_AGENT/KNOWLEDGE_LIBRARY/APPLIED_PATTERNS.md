# AI_ENGINEER_AGENT — APPLIED PATTERNS

## Purpose
Concrete, reusable patterns applied by the AI_ENGINEER_AGENT for RAG pipelines, agent loops, prompt design, and evaluation within the Fábrica de Sistemas project.

---

## Pattern 1: Basic RAG Pipeline with pgvector

```python
import anthropic
import psycopg2
from sentence_transformers import SentenceTransformer

client = anthropic.Anthropic()
embedder = SentenceTransformer("BAAI/bge-large-en-v1.5")

def retrieve(query: str, conn, top_k: int = 5) -> list[dict]:
    query_embedding = embedder.encode(query).tolist()
    with conn.cursor() as cur:
        cur.execute("""
            SELECT id, content, source,
                   1 - (embedding <=> %s::vector) AS similarity
            FROM documents
            ORDER BY embedding <=> %s::vector
            LIMIT %s
        """, (query_embedding, query_embedding, top_k))
        rows = cur.fetchall()
    return [{"id": r[0], "content": r[1], "source": r[2], "score": r[3]} for r in rows]

def answer(query: str, conn) -> str:
    chunks = retrieve(query, conn)
    context = "\n\n".join(
        f"[Source: {c['source']}]\n{c['content']}" for c in chunks
    )
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system="""You are a helpful assistant. Answer the question using ONLY
the provided context. Cite sources using [Source: name] notation.
If the answer is not in the context, say so explicitly.""",
        messages=[{
            "role": "user",
            "content": f"<context>\n{context}\n</context>\n\nQuestion: {query}"
        }]
    )
    return response.content[0].text
```

---

## Pattern 2: ReAct Agent Loop

```python
import json
import anthropic

client = anthropic.Anthropic()

TOOLS = [
    {
        "name": "search_documents",
        "description": "Search the knowledge base for relevant documents.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "execute_sql",
        "description": "Execute a read-only SQL query on the project database. Returns results as JSON.",
        "input_schema": {
            "type": "object",
            "properties": {
                "sql": {"type": "string", "description": "The SELECT query to execute"}
            },
            "required": ["sql"]
        }
    }
]

def run_agent(user_message: str, max_iterations: int = 10) -> str:
    messages = [{"role": "user", "content": user_message}]

    for _ in range(max_iterations):
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            tools=TOOLS,
            messages=messages
        )

        # Check for final answer (no more tool calls)
        if response.stop_reason == "end_turn":
            return next(b.text for b in response.content if b.type == "text")

        # Process tool calls
        messages.append({"role": "assistant", "content": response.content})
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = dispatch_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result)
                })
        messages.append({"role": "user", "content": tool_results})

    return "Maximum iterations reached without a final answer."

def dispatch_tool(name: str, inputs: dict) -> dict:
    if name == "search_documents":
        return search_documents(inputs["query"])
    elif name == "execute_sql":
        return execute_sql_safe(inputs["sql"])
    return {"error": f"Unknown tool: {name}"}
```

---

## Pattern 3: Structured Output Extraction with Retry

```python
import json
import anthropic
from pydantic import BaseModel, ValidationError

class ProjectAnalysis(BaseModel):
    summary: str
    risks: list[str]
    recommendations: list[str]
    priority: str  # "low" | "medium" | "high"

def extract_structured(text: str, max_retries: int = 3) -> ProjectAnalysis:
    client = anthropic.Anthropic()
    prompt = f"""Analyze the following project description and return a JSON object
with this exact schema:
{{
  "summary": "one-sentence summary",
  "risks": ["risk 1", "risk 2"],
  "recommendations": ["rec 1", "rec 2"],
  "priority": "low|medium|high"
}}

Project description:
{text}

Return ONLY the JSON object, no other text."""

    for attempt in range(max_retries):
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )
        raw = response.content[0].text.strip()
        # Strip markdown code blocks if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        try:
            data = json.loads(raw)
            return ProjectAnalysis(**data)
        except (json.JSONDecodeError, ValidationError) as e:
            if attempt == max_retries - 1:
                raise
            prompt = f"The previous output was invalid: {e}. Please try again. {prompt}"
```

---

## Pattern 4: Conversation Memory with Summarization

```python
from collections import deque
import anthropic

class ConversationManager:
    def __init__(self, max_recent: int = 10, summary_threshold: int = 20):
        self.recent_messages = deque(maxlen=max_recent)
        self.summary = ""
        self.total_turns = 0
        self.summary_threshold = summary_threshold
        self.client = anthropic.Anthropic()

    def add_turn(self, role: str, content: str):
        self.recent_messages.append({"role": role, "content": content})
        self.total_turns += 1
        if self.total_turns % self.summary_threshold == 0:
            self._summarize()

    def _summarize(self):
        all_text = "\n".join(f"{m['role']}: {m['content']}" for m in self.recent_messages)
        response = self.client.messages.create(
            model="claude-haiku-4",
            max_tokens=512,
            messages=[{
                "role": "user",
                "content": f"Summarize this conversation in 3-5 sentences:\n{all_text}"
            }]
        )
        self.summary = response.content[0].text
        self.recent_messages.clear()

    def build_messages(self, new_user_message: str) -> list[dict]:
        messages = list(self.recent_messages)
        messages.append({"role": "user", "content": new_user_message})
        return messages

    def build_system_prompt(self, base_system: str) -> str:
        if self.summary:
            return f"{base_system}\n\n<conversation_summary>\n{self.summary}\n</conversation_summary>"
        return base_system
```

---

## Pattern 5: Prompt Versioning Pattern

```python
from dataclasses import dataclass
from datetime import datetime

@dataclass
class PromptVersion:
    version: str
    created_at: datetime
    template: str
    notes: str

PROMPTS = {
    "project_analyzer": {
        "v1.0": PromptVersion(
            version="v1.0",
            created_at=datetime(2026, 1, 15),
            template="""You are a project analysis assistant.
Analyze the following project and provide structured feedback.

Project: {project_description}""",
            notes="Initial version"
        ),
        "v1.1": PromptVersion(
            version="v1.1",
            created_at=datetime(2026, 3, 1),
            template="""You are a senior project manager AI.
Analyze the following project description carefully.
Focus on: risks, timeline feasibility, resource requirements.

<project>
{project_description}
</project>

Provide structured feedback with specific, actionable recommendations.""",
            notes="Added XML delimiters and focus areas; improved eval score from 0.71 to 0.84"
        )
    }
}

def get_prompt(prompt_name: str, version: str = "latest") -> PromptVersion:
    versions = PROMPTS[prompt_name]
    if version == "latest":
        return max(versions.values(), key=lambda p: p.created_at)
    return versions[version]
```

---

## Pattern 6: LLM Output Evaluation with LLM-as-Judge

```python
import anthropic
from dataclasses import dataclass

@dataclass
class EvalResult:
    score: float  # 0.0 to 1.0
    reasoning: str
    passed: bool

def evaluate_response(
    question: str,
    context: str,
    model_answer: str,
    reference_answer: str | None = None
) -> EvalResult:
    client = anthropic.Anthropic()
    judge_prompt = f"""You are an expert evaluator. Score the following model response.

Question: {question}
Context: {context}
Model Answer: {model_answer}
{f'Reference Answer: {reference_answer}' if reference_answer else ''}

Evaluate on:
1. Faithfulness (0-1): Is every claim in the answer supported by the context?
2. Relevance (0-1): Does the answer address the question?
3. Completeness (0-1): Does the answer cover all key points?

Return JSON: {{"faithfulness": 0.0-1.0, "relevance": 0.0-1.0, "completeness": 0.0-1.0, "reasoning": "..."}}"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        messages=[{"role": "user", "content": judge_prompt}]
    )
    import json
    data = json.loads(response.content[0].text)
    avg_score = (data["faithfulness"] + data["relevance"] + data["completeness"]) / 3
    return EvalResult(score=avg_score, reasoning=data["reasoning"], passed=avg_score >= 0.7)
```

---

*Last reviewed: 2026-06. Maintained by AI_ENGINEER_AGENT.*
