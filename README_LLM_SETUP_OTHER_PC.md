# Guia de Configuração de LLMs para Outro PC

Siga os passos abaixo para preparar e validar todo o ecossistema de LLMs no novo computador, mantendo a governança de segredos intacta.

## Passos de Setup

1. **Clonar ou copiar o projeto** para o novo computador no diretório desejado.
2. **Copiar `.env.llm.example` para `.env.llm`** (ou mesclar seu conteúdo ao seu `.env` existente se preferir).
3. **Configurar o OpenRouter**: Adicione sua chave `OPENROUTER_API_KEY` com segurança no seu arquivo de ambiente local (`.env` ou `.env.llm`), sem comitá-lo ao Git.
4. **Instalar/Abrir o Ollama**: Baixe o daemon local em seu site oficial (https://ollama.com) e garanta que ele esteja rodando.
5. **Baixar os modelos locais necessários**:
   No terminal, execute o comando para carregar os modelos mapeados:
   ```bash
   ollama pull llama3.2
   ```
6. **Efetuar login na assinatura do Claude**:
   Caso utilize a CLI oficial do Claude Code, faça a autenticação correspondente via browser/token:
   ```bash
   claude login
   ```
7. **Efetuar login na assinatura do Gemini**:
   Faça a autenticação local da CLI oficial do Gemini.
8. **Validar a assinatura do OpenAI/Codex**:
   Certifique-se de que a CLI/app do Codex está autenticada com sua conta ativa.
9. **Executar o script de diagnóstico**:
   Rode o validador automatizado para conferir se todos os itens estão respondendo corretamente:
   ```bash
   python scripts/check_llm_environment.py
   ```
10. **Abrir o Painel**:
    Inicie o servidor local FastAPI (`python forja_os_server.py`) e abra a interface no navegador:
    [http://localhost:8000/painel/](http://localhost:8000/painel/) (ou na porta em que o servidor local estiver rodando).
