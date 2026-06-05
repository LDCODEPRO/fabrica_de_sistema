"""
billing_config.py — Configuração e status de billing oficial da FORJA OS.

Regra da Diretoria:
- Uso diário máximo:  $1.00
- Uso mensal máximo:  $30.00
- Provider principal: DeepSeek V4 Pro
- Fallback local:     Ollama

Fonte de uso real: 17_AUTOMACOES/LLM_ROUTER/reports/billing_state.json
Se não houver dados reais → $0.00 e source="sem_dados_reais" (NUNCA seed/demo).
"""
import json
import calendar
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent

# ── Orçamento oficial (substitui o antigo limite de $150) ───────────────────
DAILY_BUDGET_USD = 1.00
MONTHLY_BUDGET_USD = 30.00

# ── Providers oficiais ──────────────────────────────────────────────────────
# Execução real por ASSINATURA (CLIs oficiais), não API paga.
PRIMARY_PROVIDER = "codex_sub"   # ChatGPT/Codex via assinatura (custo incremental R$ 0)
FALLBACK_PROVIDER = "ollama"     # local grátis

# ── Ledger real de uso ──────────────────────────────────────────────────────
BILLING_STATE = ROOT / "17_AUTOMACOES" / "LLM_ROUTER" / "reports" / "billing_state.json"


def _load_state():
    if BILLING_STATE.exists():
        try:
            return json.loads(BILLING_STATE.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def get_billing_status(today=None):
    """
    Retorna status de billing com uso REAL.
    today: date opcional (para teste determinístico).
    """
    today = today or date.today()
    state = _load_state()
    daily_map = state.get("daily", {}) or {}

    today_str = today.isoformat()
    month_prefix = today.strftime("%Y-%m")

    daily_used = float(daily_map.get(today_str, 0.0) or 0.0)
    monthly_used = sum(
        float(v or 0.0) for k, v in daily_map.items() if str(k).startswith(month_prefix)
    )

    has_real = len(daily_map) > 0 and monthly_used > 0
    source = "real_usage" if has_real else "sem_dados_reais"

    # Projeção fim de mês baseada no uso real médio diário
    day_of_month = today.day
    days_in_month = calendar.monthrange(today.year, today.month)[1]
    if has_real and day_of_month > 0:
        projection = (monthly_used / day_of_month) * days_in_month
    else:
        projection = 0.0

    return {
        "daily_budget_usd": DAILY_BUDGET_USD,
        "monthly_budget_usd": MONTHLY_BUDGET_USD,
        "daily_used_usd": round(daily_used, 4),
        "monthly_used_usd": round(monthly_used, 4),
        "projection_usd": round(projection, 4),
        "source": source,
        "primary_provider": PRIMARY_PROVIDER,
        "fallback_provider": FALLBACK_PROVIDER,
        "daily_over_budget": daily_used > DAILY_BUDGET_USD,
        "monthly_over_budget": monthly_used > MONTHLY_BUDGET_USD,
    }


if __name__ == "__main__":
    print(json.dumps(get_billing_status(), ensure_ascii=False, indent=2))
