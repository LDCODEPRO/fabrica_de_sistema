import _compat_models as m

def collect(db):
    try:
        total = db.query(m.Mission).count()
        if total == 0:
            return {"status": "no_data", "total": 0, "active": 0, "completed": 0, "error": 0, "items": []}
            
        pending = db.query(m.Mission).filter(m.Mission.status == "PENDING").count()
        executing = db.query(m.Mission).filter(m.Mission.status == "EXECUTING").count()
        completed = db.query(m.Mission).filter(m.Mission.status == "COMPLETED").count()
        error = db.query(m.Mission).filter(m.Mission.status == "ERROR").count()
        
        return {
            "status": "ok",
            "total": total,
            "active": pending + executing,
            "completed": completed,
            "error": error,
            "items": [] # Evita payload massivo
        }
    except Exception:
        return {"status": "error", "total": 0, "active": 0}
