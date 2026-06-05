class PriorityEngine:
    def assign_priorities(self, tasks: list[dict]) -> list[dict]:
        for t in tasks:
            if t["role"] == "SECURITY" or t["role"] == "ARCHITECT":
                t["priority"] = "HIGH"
            elif t["role"] == "QA":
                t["priority"] = "MEDIUM"
            else:
                t["priority"] = "NORMAL"
        return tasks
