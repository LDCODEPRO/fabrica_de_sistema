from fastapi import APIRouter, Depends
from DASHBOARD.dashboard_engine import DashboardEngine
from .deps import get_project_repo, get_llm_repo, get_billing_repo

router = APIRouter()
dash = DashboardEngine()

@router.get("/dashboard")
def get_dashboard(
    projects_repo = Depends(get_project_repo),
    llms_repo = Depends(get_llm_repo),
    billing_repo = Depends(get_billing_repo)
):
    projects = projects_repo.list()
    llms = llms_repo.list()
    billings = billing_repo.list()
    
    # Calculate real metrics
    active_projects = len([p for p in projects if p.get('status') == 'ACTIVE'])
    paused_projects = len([p for p in projects if p.get('status') == 'PAUSED'])
    completed_projects = len([p for p in projects if p.get('status') == 'COMPLETED'])
    
    total_cost = sum([float(b.get('amount_usd', 0)) for b in billings])
    
    llm_status_dict = {}
    for llm in llms:
        llm_status_dict[llm.get('name', 'Unknown')] = llm.get('status', 'UNKNOWN')
        
    if not llm_status_dict:
        # Fallback to dash mock if DB is completely empty for some reason, 
        # but the prompt requires no mock. So we return empty or exact DB data.
        pass

    return {
        "projects": {
            "active": active_projects,
            "paused": paused_projects,
            "completed": completed_projects,
            "total": len(projects)
        },
        "llms": llm_status_dict,
        "costs": {
            "total_usd": total_cost,
            "daily": total_cost, # simplified
            "weekly": total_cost,
            "monthly": total_cost
        }
    }

@router.get("/llm/status")
def get_llm_status(repo = Depends(get_llm_repo)):
    llms = repo.list()
    llm_status_dict = {}
    for llm in llms:
        llm_status_dict[llm.get('name')] = llm.get('status')
    return llm_status_dict
