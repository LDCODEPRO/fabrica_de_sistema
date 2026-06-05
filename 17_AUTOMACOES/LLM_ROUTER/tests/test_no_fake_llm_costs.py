import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
DATA_PATH = os.path.join(ROOT, "16_SISTEMAS", "FORJA_OS_PLATFORM", "js", "data.js")
CENTERS_B = os.path.join(ROOT, "16_SISTEMAS", "FORJA_OS_PLATFORM", "js", "centers_b.jsx")


def test_no_fake_llm_cost_values_in_forja_os_data():
    source = open(DATA_PATH, encoding="utf-8").read()
    forbidden = ["47.32", "18.40", "6.92", "2.10", "107.49", "$107", "$111", "4.8M"]
    for term in forbidden:
        assert term not in source, f"custo/token fictício encontrado: {term}"


def test_llm_center_does_not_render_monthly_tokens_or_dollar_costs():
    source = open(CENTERS_B, encoding="utf-8").read()
    assert "Tokens (mês)" not in source
    assert "Custo (mês)" not in source
    assert "${l.custo" not in source
    assert "${sel.custo" not in source
