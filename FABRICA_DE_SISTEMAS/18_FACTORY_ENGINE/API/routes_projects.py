from fastapi import APIRouter, Depends
from pydantic import BaseModel
from .deps import get_project_repo

router = APIRouter()

class ProjectRequest(BaseModel):
    idea: str
    scope: str
    objectives: str
    timeline: str
    technologies: list[str]

@router.post("/project/create")
def create_project(req: ProjectRequest):
    # Aqui o IntakeEngine seria chamado.
    return {"status": "success", "project_id": "proj-uuid-1234", "message": "Project blueprint and tasks created."}

@router.get("/projects")
def get_projects(repo = Depends(get_project_repo)):
    # get_all returns list of dicts from db
    projects = repo.list()
    return {"projects": projects}
