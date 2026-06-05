class ArtifactManager:
    def save_artifact(self, task: dict, result: dict) -> str:
        # Registra no DB o path do arquivo
        artifact_path = f"/artifacts/{task['id']}_output.md"
        return artifact_path
