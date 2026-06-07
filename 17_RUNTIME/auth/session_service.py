from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import text
from passlib.context import CryptContext

def register_session(db: Session, user_id: int, jti: str, ip_address: str, user_agent: str, expires_at: datetime):
    db.execute(
        text("""
        INSERT INTO sessions (user_id, jti, ip_address, user_agent, expires_at)
        VALUES (:uid, :jti, :ip, :ua, :exp)
        """),
        {"uid": user_id, "jti": jti, "ip": ip_address, "ua": user_agent, "exp": expires_at}
    )
    db.commit()

def revoke_session(db: Session, jti: str):
    db.execute(text("UPDATE sessions SET is_revoked = 1 WHERE jti = :jti"), {"jti": jti})
    db.commit()

def is_session_revoked(db: Session, jti: str) -> bool:
    res = db.execute(text("SELECT is_revoked FROM sessions WHERE jti = :jti"), {"jti": jti}).fetchone()
    if not res:
        return True # Se não existe, não é válido
    return bool(res[0])

def register_refresh_token(db: Session, user_id: int, token_hash: str, expires_at: datetime):
    db.execute(
        text("""
        INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
        VALUES (:uid, :th, :exp)
        """),
        {"uid": user_id, "th": token_hash, "exp": expires_at}
    )
    db.commit()

def log_access(db: Session, user_id: int, event_type: str, status: str, source: str, ip_address: str = None, user_agent: str = None, metadata_json: str = None):
    db.execute(
        text("""
        INSERT INTO access_audit_logs (user_id, event_type, ip_address, user_agent, status, source, metadata_json)
        VALUES (:uid, :ev, :ip, :ua, :st, :src, :meta)
        """),
        {"uid": user_id, "ev": event_type, "ip": ip_address, "ua": user_agent, "st": status, "src": source, "meta": metadata_json}
    )
    db.commit()
