from repositories.core_repositories import LLMRepository
from database_manager import DatabaseManager

class LLMService:
    def __init__(self, db_manager: DatabaseManager):
        self.repo = LLMRepository(db_manager)

    def register_provider(self, provider_name: str, secret_ref: str):
        # ETAPA 9: SEGURANÇA - Validação rigorosa para não salvar chaves reais
        if not secret_ref.startswith('vault://') and not secret_ref.startswith('secret://'):
            raise ValueError("SECURITY ALERT: Forbidden keyword detected. Use vault references like 'vault://OPENAI_KEY' only.")
            
        return self.repo.create({
            "provider_name": provider_name,
            "secret_ref": secret_ref,
            "status": "ACTIVE"
        })
