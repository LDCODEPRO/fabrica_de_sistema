# FORJA_OS_PROTECTION_RULE
**Versão:** 1.0.0 | **Data:** 2026-06-05 | **Autoridade:** Diretoria da Fábrica  
**Status:** ATIVA 🔒

---

## REGRA DE PROTEÇÃO DO FORJA OS

O FORJA OS está em estado **FOUNDATION LOCKED** após a ligação real
painel ↔ backend ↔ nexus.db (commits `24da25b`, `1063288`).

---

## PROIBIÇÕES (sem autorização explícita da Diretoria)

```
❌ Criar novo painel para FORJA OS
❌ Criar novo backend para FORJA OS
❌ Duplicar o banco nexus.db
❌ Trocar o framework (React 18 + esbuild → qualquer outro)
❌ Alterar a identidade visual sem aprovação
```

---

## EVOLUÇÃO PERMITIDA — somente sobre os artefatos oficiais

```
✅ D:\FABRICA_DE_SISTEMAS\16_SISTEMAS\FORJA_OS_PLATFORM\   (frontend)
✅ D:\FABRICA_DE_SISTEMAS\forja_os_server.py               (backend)
✅ D:\FABRICA_DE_SISTEMAS\nexus.db                         (banco)
```

---

## VALIDAÇÃO OBRIGATÓRIA ANTES DE QUALQUER MERGE

Executar:
```bash
python test_forja_os_foundation.py
```
Critério: **17 passed, 0 failed**. Nenhum merge pode reduzir esse baseline.

---

## ARTEFATOS DE REFERÊNCIA

| Item | Caminho |
|------|---------|
| Relatório de lock | `19_RELATORIOS/FORJA_OS_CONNECTED_FOUNDATION_LOCK_V1.md` |
| Teste de fundação | `test_forja_os_foundation.py` |
| Camada API frontend | `16_SISTEMAS/FORJA_OS_PLATFORM/js/api.js` |
| Seed de missões | `seed_missions.py` |

---

_Fábrica de Sistemas · Governança · Regra de Proteção FORJA OS · 2026-06-05_
