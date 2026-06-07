import _compat_models as m

def collect(db):
    try:
        count = db.query(m.Evidence).count()
        if count == 0:
            return {"status": "no_data", "total": 0, "items": []}
            
        evs = db.query(m.Evidence).order_by(m.Evidence.created_at.desc()).limit(5).all()
        return {
            "status": "ok",
            "total": count,
            "items": [
                {"id": e.id, "description": e.description, "path": e.file_path}
                for e in evs
            ]
        }
    except Exception:
        return {"status": "error", "total": 0, "items": []}
