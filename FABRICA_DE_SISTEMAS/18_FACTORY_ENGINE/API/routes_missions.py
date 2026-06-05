from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class MissionRequest(BaseModel):
    project_id: str
    goal: str

@router.post("/mission/create")
def create_mission(req: MissionRequest):
    return {"status": "success", "mission_id": "miss-uuid-5678", "message": "Mission queued."}
