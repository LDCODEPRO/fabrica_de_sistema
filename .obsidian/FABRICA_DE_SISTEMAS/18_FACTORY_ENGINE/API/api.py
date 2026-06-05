from fastapi import FastAPI
from .routes_projects import router as projects_router
from .routes_missions import router as missions_router
from .routes_agents import router as agents_router
from .routes_llm import router as llm_router

app = FastAPI(title="Factory Engine API", version="1.0.0")

app.include_router(projects_router)
app.include_router(missions_router)
app.include_router(agents_router)
app.include_router(llm_router)

@app.get("/")
def root():
    return {"message": "System Factory Engine is running."}
