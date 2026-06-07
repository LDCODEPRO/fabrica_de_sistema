from fastapi import APIRouter, Depends
from pydantic import BaseModel
from .deps import get_mission_repo, get_task_repo

router = APIRouter()

class MissionRequest(BaseModel):
    project_id: str
    goal: str

@router.post("/mission/create")
def create_mission(req: MissionRequest):
    return {"status": "success", "mission_id": "miss-uuid-5678", "message": "Mission queued."}

@router.get("/missions")
def get_missions(repo = Depends(get_mission_repo), task_repo = Depends(get_task_repo)):
    missions = repo.list()
    tasks = task_repo.list()
    
    # attach tasks to missions for frontend convenience
    for m in missions:
        m["tasks"] = [t for t in tasks if t.get("mission_id") == m.get("id")]
        
    return {"missions": missions}
