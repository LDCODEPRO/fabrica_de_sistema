class StackSelector:
    def select_stack(self, category: str, requested_techs: list[str]) -> list[str]:
        stack = set(requested_techs)
        if category == "SaaS" or category == "Website":
            stack.update(["React", "FastAPI", "PostgreSQL"])
        elif category == "E-commerce":
            stack.update(["Next.js", "Node.js", "PostgreSQL"])
        elif category == "IA" or category == "Automação":
            stack.update(["Python", "FastAPI"])
        
        if not stack:
            stack.update(["Python", "SQLite"])
            
        return list(stack)
