from repositories.core_repositories import BillingRepository
from database_manager import DatabaseManager

class BillingService:
    def __init__(self, db_manager: DatabaseManager):
        self.repo = BillingRepository(db_manager)

    def record_cost(self, project_id: str, provider_id: str, cost_estimate: float, description: str):
        return self.repo.create({
            "project_id": project_id,
            "provider_id": provider_id,
            "cost_estimate": cost_estimate,
            "description": description
        })
