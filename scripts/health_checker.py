import sys
import time
from pathlib import Path
import sqlite3

project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from _compat_db import SessionLocal
import _compat_models as m

def check_database():
    start = time.time()
    try:
        db = SessionLocal()
        db.execute("SELECT 1").scalar()
        latency = int((time.time() - start) * 1000)
        return {"component": "database", "status": "UP", "latency_ms": latency}
    except Exception as e:
        return {"component": "database", "status": "DOWN", "latency_ms": 0, "error": str(e)}

def check_filesystem():
    start = time.time()
    try:
        # Check se podemos escrever em logs
        test_file = project_root / ".test_write"
        test_file.write_text("ok")
        test_file.unlink()
        latency = int((time.time() - start) * 1000)
        return {"component": "filesystem", "status": "UP", "latency_ms": latency}
    except Exception as e:
        return {"component": "filesystem", "status": "DOWN", "latency_ms": 0, "error": str(e)}

def run_all_checks():
    db = SessionLocal()
    print("Iniciando Observabilidade e Health Checks Reais...")
    checks = [check_database(), check_filesystem()]
    
    for c in checks:
        print(f"[{c['component'].upper()}] Status: {c['status']} | Ping: {c['latency_ms']}ms")
        
        # Opcional: Registrar os eventos no SystemEvent
        evt = m.SystemEvent(
            component=c['component'],
            level="INFO" if c['status'] == "UP" else "ERROR",
            event_message=f"HealthCheck: {c['status']} em {c['latency_ms']}ms"
        )
        db.add(evt)
    
    db.commit()
    print("Log de saúde gravado no banco com sucesso (SystemEvent).")

if __name__ == "__main__":
    run_all_checks()
