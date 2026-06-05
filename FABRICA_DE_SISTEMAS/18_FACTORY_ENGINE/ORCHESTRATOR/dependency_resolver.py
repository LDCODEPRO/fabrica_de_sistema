class DependencyResolver:
    def resolve_dependencies(self, tasks: list[dict]) -> list[dict]:
        # Para v1, tasks são sequenciais conforme a ordem da lista.
        for i, t in enumerate(tasks):
            if i > 0:
                t["depends_on"] = tasks[i-1]["name"]
            else:
                t["depends_on"] = None
        return tasks
