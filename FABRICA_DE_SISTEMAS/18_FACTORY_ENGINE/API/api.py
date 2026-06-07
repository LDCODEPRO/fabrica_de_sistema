from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes_projects import router as projects_router
from .routes_missions import router as missions_router
from .routes_agents import router as agents_router
from .routes_llm import router as llm_router
from .routes_audits import router as audits_router

app = FastAPI(title="Factory Engine API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev it's okay, in prod this should be restricted
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects_router)
app.include_router(missions_router)
app.include_router(agents_router)
app.include_router(llm_router)
app.include_router(audits_router)

from fastapi.staticfiles import StaticFiles

@app.get("/api/health")
def root():
    return {"message": "System Factory Engine is running."}

app.mount("/", StaticFiles(directory="D:/FABRICA_DE_SISTEMAS/Fabricação/forja-os", html=True), name="forja-os")
