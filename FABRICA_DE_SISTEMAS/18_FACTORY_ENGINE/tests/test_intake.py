import sys
import os
sys.path.append(os.path.abspath(r"D:\fabricadesistema\FABRICA_DE_SISTEMAS\18_FACTORY_ENGINE"))

from PROJECT_INTAKE.intake_engine import IntakeEngine

def test_intake_engine():
    engine = IntakeEngine()
    result = engine.process_intake(
        idea="Plataforma de vendas online SaaS",
        scope="Frontend web, backend e db",
        objectives="Vender online",
        timeline="1 month",
        technologies=["Python"]
    )
    assert result["status"] == "APPROVED"
    assert result["category"] == "SaaS"
    assert "FastAPI" in result["stack"]
