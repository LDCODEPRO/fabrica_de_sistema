class ReleaseManager:
    def deploy(self, project_id: str) -> dict:
        return {"success": True, "version": "v1.0.0", "url": f"https://{project_id}.app.local"}
