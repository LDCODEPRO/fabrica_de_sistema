import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
DATA_PATH = os.path.join(ROOT, "16_SISTEMAS", "FORJA_OS_PLATFORM", "js", "data.js")


def _data_source():
    return open(DATA_PATH, encoding="utf-8").read()


def test_forja_os_llm_center_has_required_policy_fields():
    source = _data_source()
    for field in [
        "tipo",
        "modoUso",
        "automacao",
        "custoIncremental",
        "billing",
        "ultimoHealth",
        "observacao",
    ]:
        assert field in source


def test_forja_os_llm_center_marks_paid_apis_inactive():
    source = _data_source()
    assert "API Paga" in source
    assert "Bloqueada" in source or "bloqueada" in source
    assert "Sem chave validada" in source
