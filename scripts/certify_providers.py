import sys
import time
from pathlib import Path
import json

# Adiciona a raiz do projeto ao path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

import provider_router

def main():
    providers_to_test = [
        "gemini_sub", "gemini", 
        "ollama", 
        "openrouter", 
        "deepseek", 
        "openai", 
        "claude_sub", "claude", "codex_sub"
    ]
    
    report_path = project_root / "19_RELATORIOS" / "PROVIDER_CERTIFICATION_REPORT.md"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    
    results = []
    
    for prov in providers_to_test:
        status = provider_router.provider_status(prov)
        if status == "AUSENTE":
            results.append({
                "provider": prov,
                "status": "AUSENTE",
                "handshake": "FAILED",
                "time_ms": 0,
                "error": "Not configured"
            })
            continue
            
        print(f"Testando {prov}...")
        start_time = time.time()
        res = provider_router.execute_llm(prov, "Say strictly 'Hello'", max_tokens=10)
        end_time = time.time()
        
        elapsed_ms = int((end_time - start_time) * 1000)
        
        if res["ok"]:
            results.append({
                "provider": prov,
                "status": "CONFIGURADO",
                "handshake": "SUCCESS",
                "time_ms": elapsed_ms,
                "error": None
            })
        else:
            results.append({
                "provider": prov,
                "status": "CONFIGURADO",
                "handshake": "FAILED",
                "time_ms": elapsed_ms,
                "error": res["error"]
            })
            
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("# PROVIDER_CERTIFICATION_REPORT\n\n")
        f.write("**Data da Certificação:** " + time.strftime("%Y-%m-%d %H:%M:%S") + "\n\n")
        f.write("| Provider | Status Config | Handshake | Latência (ms) | Erro / Resumo |\n")
        f.write("|----------|---------------|-----------|---------------|---------------|\n")
        
        for r in results:
            err_str = (r["error"] or "-").replace("\n", " ")
            f.write(f"| {r['provider']} | {r['status']} | {r['handshake']} | {r['time_ms']}ms | {err_str} |\n")
            
        f.write("\n## Conclusão de Certificação\n")
        certified = [r for r in results if r["handshake"] == "SUCCESS"]
        if certified:
            f.write(f"**Status Final:** PARTIAL (Apenas {len(certified)} provedores passaram)\n")
            f.write("\n**Provedores Certificados:** " + ", ".join([r["provider"] for r in certified]))
        else:
            f.write("**Status Final:** FAILED (Nenhum provedor passou no teste real de handshake)\n")
            
    print(f"Certificação concluída. Salvo em {report_path}")

if __name__ == "__main__":
    main()
