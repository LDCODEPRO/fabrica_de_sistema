from fastapi import APIRouter, Depends
from .deps import get_agent_repo

router = APIRouter()

@router.get("/status")
def get_status():
    return {"status": "READY_FOR_SYSTEM_FACTORY_ENGINE"}

@router.get("/agents")
def get_agents(repo = Depends(get_agent_repo)):
    agents = repo.list()
    return {"agents": agents}
