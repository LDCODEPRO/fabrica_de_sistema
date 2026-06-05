import os
import sys

# Garante acesso ao router e ao banco
sys.path.append(os.path.abspath(r"D:\fabricadesistema\17_AUTOMACOES\LLM_ROUTER"))

from .project_classifier import ProjectClassifier
from .stack_selector import StackSelector
from .requirements_validator import RequirementsValidator
from .project_blueprint_generator import ProjectBlueprintGenerator

class IntakeEngine:
    def __init__(self):
        self.classifier = ProjectClassifier()
        self.stack_selector = StackSelector()
        self.validator = RequirementsValidator()
        self.blueprint_generator = ProjectBlueprintGenerator()

    def process_intake(self, idea: str, scope: str, objectives: str, timeline: str, technologies: list[str]) -> dict:
        """Processa a entrada de um novo projeto, gera blueprint e retorna os dados."""
        # 1. Classificação
        category = self.classifier.classify(idea, scope)
        
        # 2. Seleção de Stack
        stack = self.stack_selector.select_stack(category, technologies)
        
        # 3. Validação de Requisitos
        validation = self.validator.validate(idea, scope, objectives, stack)
        if not validation["valid"]:
            raise ValueError(f"Requisitos inválidos: {validation['reason']}")
            
        # 4. Geração do Blueprint
        blueprint = self.blueprint_generator.generate(
            idea=idea,
            scope=scope,
            objectives=objectives,
            timeline=timeline,
            stack=stack,
            category=category
        )
        
        return {
            "status": "APPROVED",
            "category": category,
            "stack": stack,
            "blueprint": blueprint
        }
