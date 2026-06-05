import sys
import os
sys.path.append(os.path.abspath(r"D:\fabricadesistema\FABRICA_DE_SISTEMAS\18_FACTORY_ENGINE"))

from DASHBOARD.dashboard_engine import DashboardEngine

def test_dashboard_engine():
    dash = DashboardEngine()
    summary = dash.get_dashboard_summary()
    
    assert "projects" in summary
    assert summary["projects"]["active"] == 2
    assert "llms" in summary
    assert summary["llms"]["DeepSeek"] == "ACTIVE_REAL"
