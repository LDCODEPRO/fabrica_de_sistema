import os
import sys

filepath = "c:/Users/Servdia/Desktop/CB PM CIPOLARI/DESENVOLVIMENTO/FABRICA_DE_SISTEMA/FABRICA_DE_SISTEMAS/16_SISTEMAS/FORJA_OS_PLATFORM/js/centers_a.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()
    
# Cortar apenas a parte do FactoryCommandCenter
start_idx = content.find("function FactoryCommandCenter")
end_idx = content.find("function ProjectCenter")

if start_idx == -1 or end_idx == -1:
    print("ERRO: Componente não encontrado corretamente.")
    sys.exit(1)
    
factory_code = content[start_idx:end_idx]

FORBIDDEN_WORDS = [
    "window.FORJA", "mock", "dummy", "fake", "sample", "test_data", "Math.random"
]

violations = []
for word in FORBIDDEN_WORDS:
    if word in factory_code:
        violations.append(f"VIOLAÇÃO DETECTADA: '{word}' encontrado em FactoryCommandCenter.")

if violations:
    for v in violations:
        print(v)
    sys.exit(1)
else:
    print("AUDITORIA FRONTEND (HOME_EXECUTIVE_CENTER_V1) CONCLUÍDA.")
    print("0 Violações. Zero Ghost Law mantida.")
    print("Nenhum window.FORJA, mock ou fakeData encontrado na HOME.")
