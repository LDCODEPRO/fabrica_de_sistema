import os
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timezone

import sys
from pathlib import Path
project_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(project_root))

from _compat_db import get_db
from password_service import verify_password, get_password_hash
from jwt_service import create_access_token, create_refresh_token, decode_token, ACCESS_TOKEN_EXPIRE_MINUTES
from session_service import register_session, is_session_revoked, log_access

router = APIRouter(prefix="/api/auth", tags=["auth"])
security = HTTPBearer(auto_error=False)

FORJA_AUTH_REQUIRED = os.getenv("FORJA_AUTH_REQUIRED", "false").lower() == "true"

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

def get_current_user(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    if not FORJA_AUTH_REQUIRED:
        # Modo transitorio: bypass se desligado (retorna user dummy para manter consistência nas tipagens)
        return {"id": 0, "email": "dev@local", "roles": ["ADMIN"]}

    if not credentials:
        raise HTTPException(status_code=401, detail="Token ausente", headers={"WWW-Authenticate": "Bearer"})

    token = credentials.credentials
    try:
        payload = decode_token(token)
        jti = payload.get("jti")
        if not jti or is_session_revoked(db, jti):
            raise HTTPException(status_code=401, detail="Sessão revogada ou inválida")
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Usuário inválido no token")
            
        return payload
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e), headers={"WWW-Authenticate": "Bearer"})

def check_permissions(required_roles: list):
    def role_checker(user: dict = Depends(get_current_user)):
        if not FORJA_AUTH_REQUIRED:
            return True
        user_roles = user.get("roles", [])
        if "ADMIN" in user_roles:
            return True
        for role in required_roles:
            if role in user_roles:
                return True
        raise HTTPException(status_code=403, detail="Acesso Negado. Nível insuficiente.")
    return role_checker

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.execute(text("SELECT id, email, password_hash, status FROM users WHERE email = :email"), {"email": req.email}).fetchone()
    
    ip = request.client.host if request.client else "unknown"
    ua = request.headers.get("user-agent", "unknown")

    if not user or not verify_password(req.password, user[2]):
        if user:
            log_access(db, user[0], "LOGIN_FAILED", "FAILED", "local", ip, ua)
        else:
            log_access(db, None, "LOGIN_FAILED", "FAILED", "local", ip, ua, f'{{"attempted_email": "{req.email}"}}')
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais incorretas")

    if user[3] != 'ACTIVE':
        log_access(db, user[0], "LOGIN_BLOCKED", "FAILED", "local", ip, ua)
        raise HTTPException(status_code=403, detail="Usuário bloqueado")

    # Fetch roles
    roles = db.execute(text("""
        SELECT r.name FROM roles r 
        JOIN user_roles ur ON r.id = ur.role_id 
        WHERE ur.user_id = :uid
    """), {"uid": user[0]}).fetchall()
    roles_list = [r[0] for r in roles]

    payload = {"sub": str(user[0]), "email": user[1], "roles": roles_list}
    
    access_token, jti = create_access_token(data=payload)
    refresh_token = create_refresh_token(data={"sub": str(user[0])})

    from datetime import timedelta
    expire_date = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    register_session(db, user[0], jti, ip, ua, expire_date)
    log_access(db, user[0], "LOGIN_SUCCESS", "SUCCESS", "local", ip, ua)

    return {"access_token": access_token, "refresh_token": refresh_token}

@router.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    return {"user": user}
