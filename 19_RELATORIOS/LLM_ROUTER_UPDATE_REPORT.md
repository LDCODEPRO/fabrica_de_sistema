# LLM_ROUTER_UPDATE_REPORT

Data: 2026-06-05

## Mudancas no roteamento

- DeepSeek V4 Pro passa a ser prioridade em arquitetura, codigo, auditoria e decisao assistida.
- Gemini Advanced passa a ser prioridade em pesquisa e documentacao.
- Ollama Local passa a ser prioridade para automacao direta, desde que `active_real`.
- APIs pagas ficam no fim da cadeia de automacao e sao bloqueadas sem aprovacao.
- Assinaturas em interface humana nao sao chamadas como provider automatico.

## Cadeias principais

- `assisted`: DeepSeek V4 Pro, Claude Pro, ChatGPT Plus/GPT, Gemini Advanced.
- `automation`: Ollama Local, DeepSeek API, OpenAI API, Claude API, Gemini API.
- `fallback`: Ollama Local.

## Resultado

Router atualizado para custo zero por padrao e realidade primeiro.

