import sqlite3
import os
from datetime import datetime

def expand_db():
    conn = sqlite3.connect('nexus.db')
    c = conn.cursor()
    
    # 1. Tabela agent_skills
    c.execute("""
        CREATE TABLE IF NOT EXISTS agent_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            agent_id INTEGER,
            skill_path VARCHAR,
            version VARCHAR DEFAULT '1.0',
            created_at DATETIME,
            updated_at DATETIME,
            FOREIGN KEY(agent_id) REFERENCES agents(id)
        )
    """)
    
    # 2. Tabela agent_memories
    c.execute("""
        CREATE TABLE IF NOT EXISTS agent_memories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            agent_id INTEGER,
            mission_id INTEGER,
            content TEXT,
            created_at DATETIME,
            updated_at DATETIME,
            FOREIGN KEY(agent_id) REFERENCES agents(id),
            FOREIGN KEY(mission_id) REFERENCES missions(id)
        )
    """)
    
    conn.commit()
    print("Tabelas agent_skills e agent_memories criadas/verificadas com sucesso.")
    conn.close()

if __name__ == "__main__":
    expand_db()
