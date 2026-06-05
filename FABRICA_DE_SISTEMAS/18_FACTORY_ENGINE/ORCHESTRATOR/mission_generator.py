class MissionGenerator:
    def generate_missions(self, blueprint: str, project_id: str) -> list[dict]:
        # Para v1, cria 3 missões fixas baseadas no Blueprint (Architecture, Implementation, Deploy)
        return [
            {"name": "M1_ARCHITECTURE", "project_id": project_id, "goal": "Definir arquitetura base."},
            {"name": "M2_IMPLEMENTATION", "project_id": project_id, "goal": "Implementar código e testes."},
            {"name": "M3_DEPLOYMENT", "project_id": project_id, "goal": "Preparar deploy para produção."}
        ]
