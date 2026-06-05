from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
database = __import__('20_OPERATIONAL_CORE.05_DATABASE.database', fromlist=['get_db'])
get_db = database.get_db
models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['KnowledgeQuery', 'Agent'])
KnowledgeQuery = models.KnowledgeQuery
Agent = models.Agent

app = FastAPI(title="Knowledge Engine API", version="1.0.0")

def format_response(data: dict, confidence: float = 1.0, source: str = "Knowledge Engine"):
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "source": source,
        "confidence": confidence,
        "data": data
    }

class QueryRequest(BaseModel):
    query: str

@app.get("/health")
def health_check():
    return format_response({"status": "healthy"})

@app.get("/agents")
def get_agents(db: Session = Depends(get_db)):
    agents = db.query(Agent).all()
    return format_response([{"name": a.name, "role": a.role, "status": a.status} for a in agents])

@app.get("/search")
def search(q: str):
    return format_response({"query": q, "results": ["[Simulated] Document 1", "[Simulated] Document 2"]}, confidence=0.8)

@app.get("/frameworks")
def frameworks():
    return format_response({"frameworks": ["FastAPI", "React", "Next.js", "SQLAlchemy"]}, confidence=1.0)

@app.get("/patterns")
def patterns():
    return format_response({"patterns": ["Repository Pattern", "Observer Pattern", "State Machine"]}, confidence=1.0)

@app.get("/books")
def books():
    return format_response({"books": ["Clean Code", "Design Patterns", "Domain-Driven Design"]}, confidence=1.0)

@app.get("/authors")
def authors():
    return format_response({"authors": ["Robert C. Martin", "Martin Fowler", "Eric Evans"]}, confidence=1.0)

@app.get("/tools")
def tools():
    return format_response({"tools": ["Docker", "Git", "VSCode", "Postman"]}, confidence=1.0)

@app.post("/query")
def submit_query(request: QueryRequest, db: Session = Depends(get_db)):
    response_text = f"Simulated response for '{request.query}'"
    confidence = 0.95
    source = "LLM_CACHE"
    
    # Save to db
    kq = KnowledgeQuery(query=request.query, response=response_text, confidence=confidence, source=source)
    db.add(kq)
    db.commit()
    db.refresh(kq)
    
    return format_response({"id": kq.id, "query": kq.query, "response": kq.response}, confidence=confidence, source=source)

# Used for internal calls from Agents without HTTP overhead
def internal_query(query: str, db: Session):
    return submit_query(QueryRequest(query=query), db)
