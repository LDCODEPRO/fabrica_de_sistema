def collect(db):
    try:
        db.execute("SELECT 1").scalar()
        return {"status": "connected"}
    except Exception:
        return {"status": "disconnected"}
