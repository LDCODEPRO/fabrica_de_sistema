class CertificationEngine:
    def generate_certificate(self, project_id: str, status: str) -> dict:
        return {
            "project_id": project_id,
            "status": status,
            "stamp": "QA_APPROVED" if status == "CERTIFIED" else "QA_DENIED"
        }
