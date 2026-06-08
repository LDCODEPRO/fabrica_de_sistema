import time
import requests
import sqlite3
from datetime import datetime

# URL da API local
API_URL = "http://localhost:8000/api/health"

def check_health():
    try:
        response = requests.get(API_URL, timeout=5)
        status = "healthy" if response.status_code == 200 else "unhealthy"
        detail = response.text
    except Exception as e:
        status = "down"
        detail = str(e)
    
    print(f"[{datetime.now().isoformat()}] Health Check: {status} - {detail[:100]}")
    return status

if __name__ == "__main__":
    print("Iniciando FORJA Health Monitor...")
    while True:
        check_health()
        time.sleep(60) # Verifica a cada 60 segundos
