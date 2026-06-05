from .metrics_engine import MetricsEngine
from .llm_monitor import LLMMonitor
from .project_monitor import ProjectMonitor

class DashboardEngine:
    def __init__(self):
        self.metrics = MetricsEngine()
        self.llm = LLMMonitor()
        self.projects = ProjectMonitor()

    def get_dashboard_summary(self) -> dict:
        return {
            "projects": self.projects.get_project_summary(),
            "llms": self.llm.get_llm_status(),
            "costs": self.metrics.get_costs_summary()
        }
