# MACHINE_A_FINAL_CERTIFICATION_CHECKLIST

**Missão:** FORJA_DUAL_MACHINE_ENVIRONMENT_MATRIX_V1
**Local de Execução:** Máquina A (PC Principal)

Este checklist contém as validações finais e os comandos necessários para promover o código escrito na Máquina B ao status global de CERTIFICADO.

---

### [ ] 1. Validar Ollama rodando
- [ ] Abra o terminal ou taskbar e verifique se o servidor do Ollama está up.
- [ ] Teste via: `curl http://localhost:11434/api/tags`

### [ ] 2. Validar modelos locais
- [ ] Garanta que o modelo listado no roteador principal (ex: `llama3.2:latest`) foi puxado para esta máquina.
- [ ] Comando: `ollama run llama3.2:latest`

### [ ] 3. Validar Gemini login
- [ ] Garanta que a CLI do Gemini (`gemini_sub`) está autorizada e não pedindo o EULA de novo no shell invisível.
- [ ] Comando: Rodar `gemini --version` para atestar.

### [ ] 4. Validar Claude login
- [ ] O Claude Code (`claude_sub`) exige login via browser periodicamente.
- [ ] Comando: Rodar `claude` interativamente no terminal e garantir que a sessão ativa está presente e aprovada.

### [ ] 5. Validar Codex/OpenAI
- [ ] Verificar presença das chaves de API apropriadas no `.env` global para este provedor se aplicável, ou via login local.

### [ ] 6. Validar OpenRouter
- [ ] Validar que a chave do OpenRouter continua a mesma (`.env.production` ou local) que já comprovou operação antes.

### [ ] 7. Rodar provider certification
- [ ] Executar o motor de certificação novamente para testar todos eles:
- [ ] Comando: `python scripts/certify_providers.py` ou via endpoint de painel. O `PROVIDER_CERTIFICATION_REPORT.md` local deve trocar de `ENVIRONMENT_PENDING` para `CERTIFIED`.

### [ ] 8. Rodar pytest completo
- [ ] Rodar a suíte estabelecida na Etapa 3.
- [ ] Comando: `python -m pytest tests/test_forja_foundation.py -v`

### [ ] 9. Rodar Reality Engine
- [ ] Inicie o backend: `python forja_os_server.py`
- [ ] Avalie os logs e veja se o `health_checker.py` do Reality Engine reporta conexões com o banco real recém migrado.

### [ ] 10. Rodar Home APIs
- [ ] Teste todos os endpoints estabelecidos. Não podem falhar e devem retornar `not_configured` ao invés de dados forjados.
- [ ] `GET /api/home/overview`, `/api/home/health`, etc.

### [ ] 11. Salvar evidências
- [ ] Anexar o print ou log dos testes no diretório `19_RELATORIOS/`.

### [ ] 12. Commit e push
- [ ] Subir as alterações no Github (`git add .`, `git commit -m "CERTIFIED: Produção na Máquina A"`, `git push`).
