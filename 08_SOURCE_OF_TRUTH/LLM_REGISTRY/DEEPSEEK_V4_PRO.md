# DEEPSEEK V4 PRO — Motor Principal
**Posição:** 1º na hierarquia | **Data:** 2026-06-05

## IDENTIDADE
```
Provider:   DeepSeek
Model:      deepseek-chat (V4 Pro)
Tier:       LOW_COST
Position:   PRIMARY — Motor principal da Fábrica
```

## FUNÇÕES AUTORIZADAS
- Arquitetura de sistemas
- Programação e refatoração
- Auditoria de código
- Raciocínio complexo e multi-etapas
- Criação e revisão de agentes
- Análise de grandes contextos
- Criação de sistemas completos

## CONFIGURAÇÃO
```
env_var:    DEEPSEEK_API_KEY
base_url:   https://api.deepseek.com
model_id:   deepseek-chat
context:    128K tokens
```

## CRITÉRIO DE USO
- Usar para todas as tarefas de arquitetura e código
- Preferir sobre GPT/Claude quando custo for fator
- Não usar para tarefas multimodais (sem suporte)
- Não usar para pesquisa web (sem acesso nativo)

## VALIDAÇÃO NECESSÁRIA
- [ ] Teste de chamada real com DEEPSEEK_API_KEY
- [ ] Teste de geração de código
- [ ] Teste de raciocínio arquitetural
- [ ] Teste de limite de custo (billing_guard)

## STATUS ATUAL
```
STATUS: API_KEY_REQUIRED
Evidência: E:\Agente X\.env (SECRET_DETECTED)
```
