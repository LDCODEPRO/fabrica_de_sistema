class BackupEngine:
    def take_backup(self, project_id: str) -> dict:
        return {"success": True, "path": f"/backups/{project_id}_pre_deploy.zip"}
