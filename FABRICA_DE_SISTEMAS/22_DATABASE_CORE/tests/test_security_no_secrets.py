import pytest
from services.llm_service import LLMService

def test_security_no_secrets(db_manager):
    service = LLMService(db_manager)
    
    # Valida o bloqueio de chaves reais
    with pytest.raises(ValueError, match="SECURITY ALERT"):
        service.register_provider("OpenAI", "sk-abcdefg1234567")
        
    with pytest.raises(ValueError, match="SECURITY ALERT"):
        service.register_provider("Anthropic", "Bearer abcdefg")
        
    # Deve aceitar secret_ref válido
    provider_id = service.register_provider("OpenAI", "vault://OPENAI_KEY")
    assert provider_id is not None
    
    # Validar no banco se não tem segredos gravados soltos
    res = db_manager.execute_query("SELECT secret_ref FROM llm_providers WHERE id = ?", (provider_id,))
    assert "sk-" not in res[0]['secret_ref']
    assert res[0]['secret_ref'] == "vault://OPENAI_KEY"
