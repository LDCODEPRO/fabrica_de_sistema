import _compat_models as m

def collect(db):
    try:
        alerts = db.query(m.Alert).filter(m.Alert.is_resolved == False).order_by(m.Alert.created_at.desc()).limit(10).all()
        
        if not alerts:
            return {"status": "ok", "total_unresolved": 0, "items": []}
            
        return {
            "status": "ok",
            "total_unresolved": len(alerts),
            "items": [
                {"id": a.id, "severity": a.severity, "message": a.message, "date": a.created_at.isoformat()}
                for a in alerts
            ]
        }
    except Exception:
        return {"status": "error", "total_unresolved": 0, "items": []}
