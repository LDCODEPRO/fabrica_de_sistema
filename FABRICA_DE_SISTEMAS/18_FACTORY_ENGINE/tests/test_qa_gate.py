import sys
import os
sys.path.append(os.path.abspath(r"D:\fabricadesistema\FABRICA_DE_SISTEMAS\18_FACTORY_ENGINE"))

from QA_GATE.qa_engine import QAEngine

def test_qa_engine():
    engine = QAEngine()
    result = engine.run_qa_pipeline("p-123", "/fake/path")
    
    assert result["status"] == "CERTIFIED"
    assert result["certificate"]["stamp"] == "QA_APPROVED"
