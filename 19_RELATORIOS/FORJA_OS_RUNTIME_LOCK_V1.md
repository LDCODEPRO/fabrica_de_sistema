# FORJA_OS_RUNTIME_LOCK_V1
**Data:** 2026-06-05  
**Status:** RUNTIME LOCKED 🔒 + FILA OPERACIONAL ATIVA  
**Autoridade:** Fábrica de Sistemas

---

## OBJETIVO

Congelar o Runtime Real V1 e habilitar execução contínua por **fila operacional** (não apenas clique manual).

---

## EVIDÊNCIA DA MISSÃO EXECUTADA (Runtime V1)

| Campo | Valor |
|-------|-------|
| Missão | MIS-001 / MIS-002 / MIS-003 |
| Agente real | DEVELOPER / AI_ENGINEER / QA |
| Provider real | deepseek (deepseek-chat) |
| Status | RUNNING → COMPLETED |
| Evidência (banco) | evidence_id 2, 3, 5 |
| Evidência (arquivo) | `19_RELATORIOS/EVIDENCES/MISSION_*_EVIDENCE_*.md` |
| Audit | MISSION_RUNNING → PROVIDER_FALLBACK_TRAIL → MISSION_COMPLETED |

Commit do Runtime V1: `dbefd4d`.

---

## FILA OPERACIONAL

Estados controlados:
```
QUEUED → RUNNING → COMPLETED
                 ↘ FAILED
```

### Endpoint de tick
```
POST /api/runtime/tick   → pega a próxima missão QUEUED (FIFO por id) e executa
GET  /api/runtime/queue  → contagem por estado + next_queued + locks ativos
```

### Evidência real do tick
```
ANTES:  QUEUED=2  next_queued=MIS-003
POST /api/runtime/tick → {executed:true, mission_id:3, agent:QA,
                          provider:deepseek, status:COMPLETED, evidence_id:5}
DEPOIS: QUEUED=1  COMPLETED=5  next_queued=MIS-005
```

---

## TRAVA DE CONCORRÊNCIA

```python
# agent_runtime.py
_LOCK = threading.Lock()
_RUNNING_IDS = set()
```

- **In-process:** `run_mission` rejeita execução se `mid in _RUNNING_IDS` → erro "missão já em execução (lock ativo)".
- **Banco (claim atômico):** `tick()` faz `UPDATE missions SET status='RUNNING' WHERE id=? AND status='QUEUED'`; se `rowcount==0`, outro tick já reivindicou.

Validado pelo teste `lock_prevents_double_run`.

---

## AUDIT EM CADA TRANSIÇÃO

```
QUEUE_TICK_CLAIM        → missão reivindicada da fila
MISSION_RUNNING         → início da execução
PROVIDER_FALLBACK_TRAIL → trilha de providers tentados
MISSION_COMPLETED       → conclusão (ou MISSION_FAILED)
```

---

## TESTES ANTI-REGRESSÃO

| Suíte | Resultado |
|-------|-----------|
| `test_runtime_lock_queue.py` | 11 passed, 0 failed |
| `test_real_agent_runtime.py` | 9 passed, 0 failed |
| `test_forja_os_foundation.py` | 17 passed, 0 failed |

---

## PROVIDERS (sem expor chaves)

```
deepseek: CONFIGURADO   gemini: CONFIGURADO   openai: CONFIGURADO
ollama:   CONFIGURADO   claude: AUSENTE
```

---

## PAINEL

Botão "Executar missão" (MissionCenter) conectado a `POST /api/missions/{id}/run`
via `window.ForjaAPI.runMission` + `refreshMissions` — atualiza após execução sem mudar layout.

---

_Fábrica de Sistemas · FORJA OS Runtime Lock + Queue V1 · 2026-06-05_
