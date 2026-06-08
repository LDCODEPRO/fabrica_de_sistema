import os
import sqlite3
import importlib
import sys
import uuid
import datetime

# Supress bcrypt warning if any
import warnings
warnings.filterwarnings("ignore")

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append('.')

try:
    ps = importlib.import_module('17_RUNTIME.auth.password_service')
    get_password_hash = ps.get_password_hash
except Exception as e:
    print(f"Erro ao carregar password_service: {e}")
    sys.exit(1)

def create_admin(email="admin@forja.local", password="admin"):
    conn = sqlite3.connect('nexus.db')
    c = conn.cursor()
    
    # Check if user exists
    c.execute("SELECT id FROM users WHERE email = ?", (email,))
    if c.fetchone():
        print(f"Usuário {email} já existe.")
        conn.close()
        return
        
    user_id = str(uuid.uuid4())
    hashed = get_password_hash(password)
    now = datetime.datetime.utcnow().isoformat()
    
    try:
        # Insert user
        c.execute("""
            INSERT INTO users (email, password_hash, status, created_at, updated_at)
            VALUES (?, ?, 'active', ?, ?)
        """, (email, hashed, now, now))
        
        user_id = c.lastrowid
        
        # Check if ADMIN role exists
        c.execute("SELECT id FROM roles WHERE name = 'ADMIN'")
        role = c.fetchone()
        if not role:
            c.execute("INSERT INTO roles (name, description, created_at) VALUES ('ADMIN', 'Administrador Global', ?)", (now,))
            role_id = c.lastrowid
        else:
            role_id = role[0]
            
        # Assign role to user
        c.execute("INSERT INTO user_roles (user_id, role_id, assigned_at) VALUES (?, ?, ?)", (user_id, role_id, now))
        
        conn.commit()
        print(f"Usuário admin criado com sucesso!\nEmail: {email}\nSenha: {password}")
    except Exception as e:
        conn.rollback()
        print(f"Erro ao criar usuário: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    create_admin()
