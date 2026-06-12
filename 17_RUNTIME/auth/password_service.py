"""Hash/verificação de senha com bcrypt DIRETO (sem passlib).

passlib 1.7.4 é incompatível com bcrypt >= 4.1 (self-test interno estoura
"password cannot be longer than 72 bytes"). bcrypt puro gera/verifica os
mesmos hashes $2b$, então os usuários existentes continuam válidos.
"""
import bcrypt

# bcrypt ignora bytes além de 72; truncamos explicitamente para evitar o
# ValueError introduzido no bcrypt 5.x.
_MAX = 72


def _to_bytes(password: str) -> bytes:
    return password.encode("utf-8")[:_MAX]


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha em texto plano corresponde ao hash."""
    try:
        return bcrypt.checkpw(_to_bytes(plain_password), hashed_password.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def get_password_hash(password: str) -> str:
    """Retorna o hash bcrypt da senha."""
    return bcrypt.hashpw(_to_bytes(password), bcrypt.gensalt()).decode("utf-8")
