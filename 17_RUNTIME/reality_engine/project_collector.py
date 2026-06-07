import _compat_models as m

def collect(db):
    try:
        count = db.query(m.Project).filter(m.Project.status == "ACTIVE").count()
        return {
            "status": "ok" if count > 0 else "no_data",
            "total": count,
            "source": "reality_engine"
        }
    except Exception:
        return {"status": "error", "total": 0, "source": "reality_engine"}
