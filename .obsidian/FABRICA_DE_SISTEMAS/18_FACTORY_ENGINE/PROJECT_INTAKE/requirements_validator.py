class RequirementsValidator:
    def validate(self, idea: str, scope: str, objectives: str, stack: list[str]) -> dict:
        if len(idea) < 10:
            return {"valid": False, "reason": "Ideia muito curta."}
        if len(scope) < 10:
            return {"valid": False, "reason": "Escopo muito curto."}
        if not stack:
            return {"valid": False, "reason": "Stack de tecnologias vazia."}
        return {"valid": True, "reason": "OK"}
