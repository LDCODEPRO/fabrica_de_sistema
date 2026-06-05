class LLMMonitor:
    def get_llm_status(self) -> dict:
        return {
            "DeepSeek": "ACTIVE_REAL",
            "Gemini": "ACTIVE_REAL",
            "OpenAI": "ACTIVE_REAL",
            "Claude": "SUBSCRIPTION_OK",
            "Gemma": "TEMPORARILY_UNAVAILABLE",
            "Ollama": "TEMPORARILY_UNAVAILABLE"
        }
