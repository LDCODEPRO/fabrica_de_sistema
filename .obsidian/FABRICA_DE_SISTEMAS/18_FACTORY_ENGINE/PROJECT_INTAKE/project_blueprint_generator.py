class ProjectBlueprintGenerator:
    def generate(self, idea: str, scope: str, objectives: str, timeline: str, stack: list[str], category: str) -> str:
        blueprint = f"""# PROJECT BLUEPRINT

## Resumo
**Categoria:** {category}
**Ideia:** {idea}

## Escopo
{scope}

## Objetivos
{objectives}

## Prazo
{timeline}

## Tecnologias
- {chr(10) + "- ".join(stack)}
"""
        return blueprint
