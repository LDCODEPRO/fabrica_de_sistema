class TaskAllocator:
    def allocate_tasks(self, mission: dict) -> list[dict]:
        tasks = []
        name = mission["name"]
        if "ARCHITECTURE" in name:
            tasks.append({"name": "Criar documentação de arquitetura", "role": "ARCHITECT", "mission_name": name, "status": "PENDING"})
            tasks.append({"name": "Revisar segurança da base", "role": "SECURITY", "mission_name": name, "status": "PENDING"})
        elif "IMPLEMENTATION" in name:
            tasks.append({"name": "Desenvolver backend", "role": "DEVELOPER", "mission_name": name, "status": "PENDING"})
            tasks.append({"name": "Desenvolver frontend", "role": "DEVELOPER", "mission_name": name, "status": "PENDING"})
            tasks.append({"name": "Criar testes unitários", "role": "QA", "mission_name": name, "status": "PENDING"})
        elif "DEPLOYMENT" in name:
            tasks.append({"name": "Configurar Docker", "role": "DEVOPS", "mission_name": name, "status": "PENDING"})
            tasks.append({"name": "Gerar manuais", "role": "DOCS", "mission_name": name, "status": "PENDING"})
            
        return tasks
