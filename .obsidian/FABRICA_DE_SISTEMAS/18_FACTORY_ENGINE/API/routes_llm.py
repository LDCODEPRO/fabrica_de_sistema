from fastapi import APIRouter
from DASHBOARD.dashboard_engine import DashboardEngine

router = APIRouter()
dash = DashboardEngine()

@router.get("/dashboard")
def get_dashboard():
    return dash.get_dashboard_summary()

@router.get("/llm/status")
def get_llm_status():
    return dash.llm.get_llm_status()
