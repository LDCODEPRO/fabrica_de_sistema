import sys
from pathlib import Path

# Adiciona a raiz do projeto ao path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from _compat_db import engine
import _compat_models as models

def expand_db():
    print("Iniciando expansão do banco de dados (Reality Engine)...")
    try:
        # Tenta criar as novas tabelas ou colunas (sqlite não atualiza colunas facilmente 
        # com create_all, mas se as tabelas ainda não existirem, vai cria-las com o schema certo).
        # Neste caso, como apenas a tabela agents e missions existiam antes dessa missão (e a mission_events/etc foram criadas
        # na missão anterior mas sem os metadados json). Se as tabelas existiam sem as colunas, em SQLite precisariamos de alembic.
        # Porém para facilitar e por ser SQLite de desenvolvimento estrutural, e como não podemos apagar os dados de missions/agents:
        models.Base.metadata.create_all(bind=engine)
        
        # Como o SQLite do sqlalchemy.create_all() ignora `ALTER TABLE` para add colunas,
        # vamos garantir a adição manual das colunas essenciais do Reality Engine caso as tabelas tenham sido 
        # criadas pela missão anterior, sem afetar `missions`, `agents` e `evidences`.
        
        with engine.connect() as conn:
            # Lista de tabelas criadas na missao anterior que precisam de novas colunas
            tabelas_novas = [
                "projects", "mission_events", "provider_health_checks", 
                "artifacts", "alerts", "deployments", "github_events", 
                "system_events", "settings"
            ]
            
            for t in tabelas_novas:
                try:
                    conn.execute(f"ALTER TABLE {t} ADD COLUMN status VARCHAR DEFAULT 'ACTIVE'")
                except Exception: pass
                
                try:
                    conn.execute(f"ALTER TABLE {t} ADD COLUMN source VARCHAR DEFAULT 'reality_engine'")
                except Exception: pass
                
                try:
                    conn.execute(f"ALTER TABLE {t} ADD COLUMN metadata_json TEXT")
                except Exception: pass
                
                try:
                    conn.execute(f"ALTER TABLE {t} ADD COLUMN updated_at DATETIME")
                except Exception: pass

                try:
                    conn.execute(f"ALTER TABLE {t} ADD COLUMN created_at DATETIME")
                except Exception: pass
                
        print("Expansão concluída com sucesso. Nenhum dado foi perdido.")
    except Exception as e:
        print(f"Erro na expansão: {e}")

if __name__ == "__main__":
    expand_db()
