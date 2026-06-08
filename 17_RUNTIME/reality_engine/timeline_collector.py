import _compat_models as m

def collect(db):
    try:
        events = db.query(m.SystemEvent).order_by(m.SystemEvent.created_at.desc()).limit(10).all()
        if not events:
            return {"status": "ok", "events": []}
            
        return {
            "status": "ok",
            "events": [
                {"id": e.id, "component": e.component, "message": e.event_message, "date": e.created_at.isoformat()}
                for e in events
            ]
        }
    except Exception:
        return {"status": "error", "events": []}
