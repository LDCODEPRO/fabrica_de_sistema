from .environment_validator import EnvironmentValidator
from .backup_engine import BackupEngine
from .release_manager import ReleaseManager

class DeployPrecheck:
    def __init__(self):
        self.env_validator = EnvironmentValidator()
        self.backup_engine = BackupEngine()
        self.release_manager = ReleaseManager()

    def run_precheck_and_deploy(self, project_id: str) -> dict:
        if not self.env_validator.validate_env():
            return {"status": "FAILED", "reason": "Environment Validation Failed"}
            
        backup = self.backup_engine.take_backup(project_id)
        if not backup["success"]:
            return {"status": "FAILED", "reason": "Backup Failed"}
            
        release = self.release_manager.deploy(project_id)
        return {
            "status": "SUCCESS" if release["success"] else "FAILED",
            "release_info": release
        }
