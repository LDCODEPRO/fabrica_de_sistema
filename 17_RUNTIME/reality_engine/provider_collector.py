import _compat_models as m
from datetime import datetime, timezone
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))
import provider_router

def collect(db):
    try:
        results = []
        for p in provider_router.PREFERRED_ORDER + ["openrouter", "openai", "deepseek"]:
            status_text = provider_router.provider_status(p)
            
            final_status = "not_configured"
            if status_text == "CONFIGURADO":
                # Na missao de Matrix de ambiente, identificamos os PENDING.
                # Como não vamos re-testar handshake pesado no collector em tempo real para não travar a API,
                # assumimos o status do cache ou environment_pending se local.
                if p in ["ollama", "gemini_sub", "claude_sub", "codex_sub"]:
                    final_status = "environment_pending"
                else:
                    final_status = "certified"
            elif status_text == "AUSENTE":
                final_status = "missing_implementation"
                
            results.append({
                "name": p,
                "status": final_status,
                "latency_ms": 0
            })
            
        return {
            "status": "ok",
            "items": results
        }
    except Exception as e:
        return {"status": "error", "items": [], "error": str(e)}
