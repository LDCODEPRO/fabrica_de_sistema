# Walkthrough - Portugues Operacional FORJA OS

## Como validar a interface

1. Abrir a FORJA OS.
2. Confirmar que o primeiro painel exibe `Centro de Comandos`.
3. Confirmar o menu principal:
   - Projetos
   - Missoes
   - Equipe
   - Conhecimento
   - Publicacoes
   - Auditoria
   - Configuracoes
4. Confirmar os blocos do dashboard:
   - Saude da Fabrica
   - Equipe Ativa
   - Central de IA
   - Missoes em execucao
   - Publicacoes
   - Auditoria ao vivo
5. Abrir `Equipe` e confirmar os papeis operacionais:
   - ARQUITETO
   - DESENVOLVEDOR
   - AUDITOR
   - SEGURANCA
   - OPERACOES
   - ESPECIALISTA EM DADOS
   - ESPECIALISTA EM IA
6. Abrir `Centro de Comandos` com o atalho de comandos e confirmar que os comandos usam linguagem de operacao.

## Validacao tecnica executada

```text
node scripts/build.mjs
node tests/static-audit.mjs
```

Resultado:

```text
STATIC_AUDIT_OK
```

## Validacao visual executada

```text
desktop: missing=none; consoleErrors=0
mobile: missing=none; consoleErrors=0
```

## Regra permanente

Termos tecnicos podem continuar existindo internamente no codigo quando forem identificadores, nomes de funcoes ou contratos internos. Na camada visual, a FORJA OS deve usar nomenclatura operacional em portugues do Brasil.
