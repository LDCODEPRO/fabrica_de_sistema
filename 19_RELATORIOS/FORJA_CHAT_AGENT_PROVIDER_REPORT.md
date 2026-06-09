# FORJA CHAT AGENT PROVIDER REPORT

## 1. Topologia de Roteamento (Fallback)
A missão exigia o acionamento em cascata conforme disponibilidade:
1. Claude (Assinatura)
2. OpenAI (Assinatura)
3. Gemini (Assinatura)
4. DeepSeek V4 Pro
5. Kimi
6. Ollama Local

## 2. Implementação
O chat chama o método universal `provider_router.execute_with_fallback()`. Este componente de núcleo faz a varredura ativa pela hierarquia estipulada em `PREFERRED_ORDER` (ou via provider registry), garantindo o repasse sem travar a thread.

## 3. Registro e Auditoria
O painel agora exibe graficamente (selo) de qual provedor a resposta originou (ex: `via gemini` ou `via ollama`). A base de dados (`chat_messages`) cadastra em coluna nativa (`provider_key`) para posterior controle financeiro.
