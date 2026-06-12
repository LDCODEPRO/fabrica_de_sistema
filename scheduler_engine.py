"""
scheduler_engine.py — Agendador real da FORJA OS.

Roda um loop em background que dispara tarefas agendadas no horário:
- agent_act: um agente executa um objetivo (opcional para um cliente)
- telegram_message: envia mensagem pelo Telegram da Fábrica
- run_queue: processa a próxima missão da fila

Horários (schedule_type):
- interval: a cada N minutos (schedule_value = "30")
- daily: todo dia às HH:MM (schedule_value = "09:00") — horário local do servidor
- once: uma vez em data/hora ISO (schedule_value = "2026-06-15T09:00")
"""
import json
import time
import threading
import logging
from datetime import datetime, timedelta

logger = logging.getLogger("forja_os.scheduler")
_started = False


def compute_next_run(schedule_type, schedule_value, base=None):
    base = base or datetime.now()
    try:
        if schedule_type == "interval":
            mins = max(1, int(float(schedule_value or "60")))
            return base + timedelta(minutes=mins)
        if schedule_type == "daily":
            hh, mm = (schedule_value or "09:00").split(":")
            cand = base.replace(hour=int(hh), minute=int(mm), second=0, microsecond=0)
            if cand <= base:
                cand = cand + timedelta(days=1)
            return cand
        if schedule_type == "once":
            return datetime.fromisoformat(schedule_value)
    except Exception:
        return base + timedelta(minutes=60)
    return base + timedelta(minutes=60)


def execute_job(job):
    """Executa a ação do job. Retorna texto-resultado (real)."""
    kind = job.kind
    try:
        spec = json.loads(job.spec or "{}")
    except Exception:
        spec = {}

    if kind == "run_queue":
        import agent_runtime
        r = agent_runtime.tick()
        return f"fila: executed={r.get('executed')} status={r.get('status')}"

    if kind == "provider_watchdog":
        # Auto-recuperação: revalida providers CAÍDOS e restaura o status no
        # banco quando voltam — sem o usuário precisar clicar "Reconectar".
        import provider_governance as pg
        from _compat_db import SessionLocal
        import _compat_models as mm
        bad = {"ENVIRONMENT_PENDING", "OFFLINE", "ERROR", "TEMPORARILY_UNAVAILABLE"}
        db = SessionLocal()
        recovered, still_down = [], []
        try:
            rows = db.query(mm.LLMProvider).filter(mm.LLMProvider.enabled == True).all()  # noqa: E712
            for row in rows:
                if (row.status or "").upper() not in bad:
                    continue
                res = pg.check_provider(row.provider_key)
                row.last_health_check = datetime.now()
                if res.get("ok"):
                    row.status = res["status"]
                    recovered.append(row.provider_key)
                else:
                    still_down.append(row.provider_key)
                db.commit()
        finally:
            db.close()
        return f"watchdog: recuperados={recovered or 'nenhum'} ainda_fora={still_down or 'nenhum'}"

    if kind == "telegram_message":
        from AGENTIC_CORE.tools_registry import ToolRegistry
        tr = ToolRegistry()
        return tr.execute("enviar_telegram", json.dumps(
            {"texto": spec.get("texto", ""), "chat_id": spec.get("to") or spec.get("chat_id")}))

    if kind == "publish_content":
        import os
        from _compat_db import SessionLocal
        import _compat_models as mm
        db = SessionLocal()
        try:
            ci = db.query(mm.ContentItem).filter(mm.ContentItem.id == spec.get("content_id")).first()
            if not ci:
                return "conteúdo não encontrado"
            if ci.tipo != "post" or not ci.media_url:
                return "publicação automática só para 'post' com imagem (reel/story precisam vídeo)"
            base = os.getenv("PUBLIC_BASE_URL", "")
            img = (base + ci.media_url) if (ci.media_url.startswith("/") and base) else ci.media_url
            from AGENTIC_CORE.tools_registry import ToolRegistry
            tr = ToolRegistry({"client_id": ci.client_id})
            res = tr.execute("postar_instagram", json.dumps({"image_url": img, "legenda": (ci.output or "")[:2000]}))
            if "publicado" in str(res).lower():
                ci.status = "publicado"; db.commit()
            return str(res)
        finally:
            db.close()

    if kind == "agent_act":
        from AGENTIC_CORE.base_agent import BaseAgent
        key = (spec.get("agent") or "ORCHESTRATOR").upper()
        ctx = {}
        if spec.get("client_id"):
            ctx["client_id"] = spec.get("client_id")
        ag = BaseAgent(name=key, role="Agente Agendado da Forja",
                       goal=spec.get("objective", ""), profile_key=key, context=ctx)
        res = ag.execute_mission(spec.get("objective", ""))
        return f"agent_act: {res.get('status')} · {(res.get('final_answer') or '')[:120]}"

    return f"tipo de job desconhecido: {kind}"


def run_due(now=None):
    from _compat_db import SessionLocal
    import _compat_models as m
    now = now or datetime.now()
    db = SessionLocal()
    fired = 0
    try:
        jobs = (db.query(m.ScheduledJob)
                .filter(m.ScheduledJob.enabled == True,  # noqa: E712
                        m.ScheduledJob.next_run != None,  # noqa: E711
                        m.ScheduledJob.next_run <= now).all())
        for job in jobs:
            try:
                result = execute_job(job)
            except Exception as e:
                result = f"ERRO: {type(e).__name__}: {e}"
            job.last_run = now
            job.last_result = str(result)[:500]
            if job.schedule_type == "once":
                job.enabled = False
                job.next_run = None
            else:
                job.next_run = compute_next_run(job.schedule_type, job.schedule_value, base=now)
            db.add(m.AuditLog(event_type="SCHEDULER_FIRE", details=json.dumps(
                {"job": job.name, "kind": job.kind, "result": str(result)[:160]}, ensure_ascii=False)))
            db.commit()
            fired += 1
            logger.info("scheduler disparou '%s' → %s", job.name, str(result)[:80])
    except Exception as e:
        logger.warning("scheduler run_due erro: %s", e)
        db.rollback()
    finally:
        db.close()
    return fired


def _loop():
    logger.info("FORJA OS: scheduler em background iniciado.")
    while True:
        try:
            run_due()
        except Exception as e:
            logger.warning("scheduler loop erro: %s", e)
        time.sleep(30)


def _seed_default_jobs():
    """Garante os jobs de sistema (idempotente). Hoje: watchdog de providers."""
    from _compat_db import SessionLocal
    import _compat_models as m
    db = SessionLocal()
    try:
        name = "Watchdog de providers (auto-reconexão)"
        if not db.query(m.ScheduledJob).filter(m.ScheduledJob.kind == "provider_watchdog").first():
            db.add(m.ScheduledJob(
                name=name, kind="provider_watchdog", spec="{}",
                schedule_type="interval", schedule_value="10",
                enabled=True, next_run=compute_next_run("interval", "10"),
            ))
            db.commit()
            logger.info("scheduler: job '%s' criado (a cada 10 min).", name)
    except Exception as e:
        logger.warning("scheduler seed erro: %s", e)
        db.rollback()
    finally:
        db.close()


def start_scheduler():
    global _started
    if _started:
        return
    _started = True
    _seed_default_jobs()
    threading.Thread(target=_loop, daemon=True, name="forja-scheduler").start()
