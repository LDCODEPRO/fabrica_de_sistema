import os
import sys
import json
import time
from pathlib import Path

# Add project root to path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / "17_RUNTIME"))

from fastapi.testclient import TestClient
from forja_os_server import app

client = TestClient(app)

ENDPOINTS = [
    "/api/home/overview",
    "/api/home/health",
    "/api/home/providers",
    "/api/home/missions",
    "/api/home/github",
    "/api/home/timeline",
    "/api/home/alerts",
    "/api/home/evidence"
]

FORBIDDEN_WORDS = [
    "mock", "dummy", "fake", "sample", "test_data"
]

def analyze_payload(payload):
    dump = json.dumps(payload).lower()
    for word in FORBIDDEN_WORDS:
        if word in dump:
            return False, word
    return True, None

def run_audit():
    print("=== FORJA_HOME_DATA_VALIDATION_V1 ===")
    results = {}
    total_endpoints = len(ENDPOINTS)
    passed = 0
    zero_ghost_passed = True
    
    for ep in ENDPOINTS:
        start = time.time()
        res = client.get(ep)
        duration_ms = int((time.time() - start) * 1000)
        
        status = res.status_code
        payload = {}
        if status == 200:
            payload = res.json()
        
        compliant, found_word = analyze_payload(payload)
        
        # Test resilience: must return 200 and not crash
        # For "no data" situations, reality engine returns status="no_data" or empty lists
        is_ok = (status == 200)
        if not compliant:
            zero_ghost_passed = False
            is_ok = False
            
        results[ep] = {
            "status": status,
            "duration_ms": duration_ms,
            "zero_ghost_compliant": compliant,
            "forbidden_word_found": found_word,
            "payload_snippet": str(payload)[:200] + ("..." if len(str(payload)) > 200 else ""),
            "full_payload": payload,
            "is_ok": is_ok
        }
        
        if is_ok: passed += 1
        print(f"[{status}] {ep} ({duration_ms}ms) | ZeroGhost: {compliant}")
        
    print(f"\\nEndpoints testados: {passed}/{total_endpoints}")
    if passed == total_endpoints and zero_ghost_passed:
        print("RESULTADO GERAL: HOME_READY_FOR_UI")
    else:
        print("RESULTADO GERAL: HOME_NOT_READY_FOR_UI")
        
    # Salvar dump completo
    Path(project_root / "19_RELATORIOS" / "API_AUDIT_DUMP.json").write_text(json.dumps(results, indent=2))

if __name__ == "__main__":
    run_audit()
