import sys
from pathlib import Path

# Adiciona a raiz do projeto ao path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from _compat_db import engine
import _compat_models as models

def migrate():
    print("Iniciando migração de produção do banco de dados...")
    # Cria todas as tabelas (create_all) baseado nas definições do _compat_models
    # Tabelas já existentes não serão dropadas. Novas tabelas serão criadas.
    models.Base.metadata.create_all(bind=engine)
    print("Migração concluída com sucesso. Novas tabelas criadas no nexus.db.")

if __name__ == "__main__":
    migrate()
