import sys
from pathlib import Path
import provider_router as pr

providers_to_test = [
    'claude_sub',
    'codex_sub',
    'gemini_sub',
    'openrouter',
    'ollama'
]

print('=== TESTE DE ROTEAMENTO (PROVIDER ROUTER) ===\n')

for p in providers_to_test:
    print(f'Enviando prompt de teste para: {p}')
    try:
        res = pr.execute_with_fallback(
            prompt='Responda apenas com a palavra SUCESSO e o seu nome de modelo. Não adicione mais texto.',
            system='Teste de roteamento interno. Seja conciso.',
            max_tokens=50,
            order=[p]
        )
        
        if res.get('ok'):
            print(f'[OK] {p} -> FUNCIONANDO BEM')
            print(f'   Provider Real: {res.get("provider")}')
            print(f'   Modelo: {res.get("model")}')
            print(f'   Resposta: {res.get("response")}\n')
        else:
            print(f'[FAIL] {p} -> FALHOU')
            print(f'   Erro: {res.get("error")}\n')
            
    except Exception as e:
        print(f'[ERROR] {p} -> ERRO EXCEPTION: {e}\n')
