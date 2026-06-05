"""
_compat_db.py — Shim de compatibilidade para o banco de dados.
Resolve o problema de importar módulos com números (20_OPERATIONAL_CORE).
"""
import os
import sys
from pathlib import Path

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{Path(__file__).parent / 'nexus.db'}")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Inicializa o banco criando tabelas que não existem ainda."""
    import _compat_models as models
    Base.metadata.create_all(bind=engine)
