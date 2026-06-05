import sys
import os
import time

sys.path.append(os.path.abspath(r"D:\fabricadesistema\17_AUTOMACOES\LLM_ROUTER"))
sys.path.append(os.path.abspath(r"D:\fabricadesistema\FABRICA_DE_SISTEMAS\22_DATABASE_CORE"))

from llm_router import LLMRouter

def run_smoke_test():
    print("--- ETAPA 5: SMOKE TEST REAL ---")
    mission_id = "SMOKE_TEST_001"
    router = LLMRouter(mission_id=mission_id)
    
    prompt = "Responda apenas: PROVIDER_OK"
    print(f"Enviando prompt: '{prompt}'")
    
    start_time = time.time()
    
    # Vamos chamar "simple" que mapeia para deepseek etc
    result = router.route(task_type="simple", prompt=prompt)
    
    elapsed = time.time() - start_time
    
    print("\n--- RESULTADO ---")
    print(f"Sucesso: {result.success}")
    print(f"Provider: {result.provider_id} ({result.model})")
    print(f"Resposta: {result.response}")
    print(f"Tempo de Execução: {elapsed:.2f}s")
    
    if result.success and "PROVIDER_OK" in result.response:
        print(">>> SMOKE TEST APROVADO <<<")
    else:
        print(">>> SMOKE TEST REPROVADO <<<")

if __name__ == "__main__":
    run_smoke_test()
