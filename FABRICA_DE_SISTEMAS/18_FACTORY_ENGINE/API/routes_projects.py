from fastapi import APIRouter
from pydantic import BaseModel

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
