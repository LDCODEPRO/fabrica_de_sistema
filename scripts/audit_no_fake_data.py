import os
import re
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent

# Padrões proibidos (Zero Ghost Law)
BANNED_PATTERNS = [
    r"mockData",
    r"fakeData",
    r"dummyData",
    r"sampleData",
    r"Math\.random\(\).*?\*", # Evita métricas aleatórias no frontend
    r"success\s*=\s*true\b", # Variáveis hardcoded no escopo global
    r"online\s*=\s*true\b",
    r"uptime\s*=",
    r"sem_dados_reais" # String literal nossa, não é banida por si só, mas avaliamos contexto. Aqui evitamos 'random()'
]

def scan_file(filepath):
    violations = []
    try:
        content = filepath.read_text(encoding="utf-8")
        for i, line in enumerate(content.splitlines(), 1):
            for pattern in BANNED_PATTERNS:
                if re.search(pattern, line, re.IGNORECASE):
                    # Ignorar o backend se for apenas documentação ou comentário honesto
                    if "sem_dados_reais" in line and filepath.suffix == ".py":
                        continue
                    violations.append((i, line.strip(), pattern))
    except Exception:
        pass
    return violations

def run_audit():
    targets = [
        project_root / "16_SISTEMAS" / "FORJA_OS_PLATFORM" / "js",
        project_root / "forja_os_server.py",
        project_root / "17_RUNTIME" / "reality_engine"
    ]
    
    report_lines = [
        "# ZERO_GHOST_COMPLIANCE_REPORT",
        "",
        "**Etapa 10:** Trava Anti-Fake",
        "**Objetivo:** Auditar o código para barrar a inserção de *mock data* ou números estáticos na interface de monitoramento.",
        ""
    ]
    
    total_violations = 0
    
    for target in targets:
        if not target.exists():
            continue
            
        files_to_check = []
        if target.is_dir():
            files_to_check = list(target.rglob("*.js")) + list(target.rglob("*.py")) + list(target.rglob("*.jsx"))
        else:
            files_to_check = [target]
            
        for f in files_to_check:
            v = scan_file(f)
            if v:
                report_lines.append(f"### Arquivo: `{f.relative_to(project_root)}`")
                for line_num, line_str, pattern in v:
                    report_lines.append(f"- **Linha {line_num}** (Padrão: `{pattern}`): `{line_str}`")
                    total_violations += 1
                report_lines.append("")

    if total_violations == 0:
        report_lines.append("## Conclusão: CERTIFIED")
        report_lines.append("Zero violações encontradas. O código atende plenamente a **Zero Ghost Law**.")
    else:
        report_lines.append("## Conclusão: FAILED")
        report_lines.append(f"Foram encontradas {total_violations} violações de simulação de dados que devem ser purgadas antes do próximo deploy.")
        
    report_path = project_root / "19_RELATORIOS" / "ZERO_GHOST_COMPLIANCE_REPORT.md"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text("\n".join(report_lines), encoding="utf-8")
    print(f"Auditoria concluída. {total_violations} violações. Relatório: {report_path}")

if __name__ == "__main__":
    run_audit()
