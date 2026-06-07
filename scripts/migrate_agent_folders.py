import os
import shutil
import sqlite3
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGENTS_DIR = os.path.join(ROOT, "20_AGENTS")
SKILLS_DIR = os.path.join(ROOT, "03_SKILLS")

AGENT_FOLDERS = [
    "architect", "designer", "developer", "qa", "docs", 
    "orchestrator", "analyst", "communication", "devops", "security", "data_engineer", "ai_engineer"
]

SKILL_MAPPING = {
    "ARCHITECT_MASTER": "architect",
    "SITE_DESIGNER": "designer",
    "ADMIN_DESIGNER": "designer", # Pode sobrescrever ou ignorar se já tiver
    "BACKEND_MASTER": "developer",
    "CORE_ADAPTER_MASTER": "developer",
    "QA_MASTER": "qa",
    "FORENSIC_AUDITOR": "qa",
    "CERTIFIER_MASTER": "qa",
    "DOCUMENTATION_MANAGER": "docs",
    "PROJECT_MANAGER": "orchestrator",
    "DEPLOY_MASTER": "devops"
}

def migrate():
    # 1. Create base folders
    os.makedirs(AGENTS_DIR, exist_ok=True)
    for agent in AGENT_FOLDERS:
        agent_path = os.path.join(AGENTS_DIR, agent)
        os.makedirs(os.path.join(agent_path, "prompts"), exist_ok=True)
        os.makedirs(os.path.join(agent_path, "memory"), exist_ok=True)
        os.makedirs(os.path.join(agent_path, "logs"), exist_ok=True)
        # Create a default skill file just in case it doesn't get migrated
        default_skill = os.path.join(agent_path, "skill.md")
        if not os.path.exists(default_skill):
            with open(default_skill, "w", encoding="utf-8") as f:
                f.write(f"# Skill: {agent.upper()}\n\nVocê é o agente {agent.upper()}.\n")

    # 2. README
    readme_path = os.path.join(AGENTS_DIR, "README.md")
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write("# Diretório Central de Agentes\n\nEste diretório contém os arquivos e estados de cada agente da FORJA OS.\n")
        f.write("- `skill.md`: Regras de negócio e persona do agente.\n")
        f.write("- `prompts/`: Templates de mensagens.\n")
        f.write("- `memory/`: Caches temporários.\n")
        f.write("- `logs/`: Logs de execução.\n")

    # 3. Migrate skills
    if os.path.exists(SKILLS_DIR):
        for folder in os.listdir(SKILLS_DIR):
            if folder in SKILL_MAPPING:
                src_file = os.path.join(SKILLS_DIR, folder, "SYSTEM_SKILL.md")
                if os.path.exists(src_file):
                    dest_agent = SKILL_MAPPING[folder]
                    dest_file = os.path.join(AGENTS_DIR, dest_agent, "skill.md")
                    # If we already copied one, don't overwrite
                    if os.path.exists(dest_file):
                        with open(dest_file, "r", encoding="utf-8") as df:
                            content = df.read()
                        if content.startswith("# Skill"):
                            # was just default, overwrite
                            shutil.copy2(src_file, dest_file)
                        else:
                            # Merge them
                            with open(src_file, "r", encoding="utf-8") as sf:
                                new_content = sf.read()
                            with open(dest_file, "a", encoding="utf-8") as df:
                                df.write("\n\n---\n\n" + new_content)
                    else:
                        shutil.copy2(src_file, dest_file)

    # 4. Insert into DB
    conn = sqlite3.connect(os.path.join(ROOT, 'nexus.db'))
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    agents = c.execute("SELECT id, name FROM agents").fetchall()
    
    now = datetime.utcnow().isoformat()
    for agent in agents:
        agent_name = agent['name'].lower()
        agent_id = agent['id']
        skill_path = f"20_AGENTS/{agent_name}/skill.md"
        
        # Check if already exists
        existing = c.execute("SELECT id FROM agent_skills WHERE agent_id = ?", (agent_id,)).fetchone()
        if not existing:
            c.execute("""
                INSERT INTO agent_skills (agent_id, skill_path, version, created_at, updated_at)
                VALUES (?, ?, '1.0', ?, ?)
            """, (agent_id, skill_path, now, now))
    
    conn.commit()
    conn.close()
    print("Migração de diretórios e skills concluída com sucesso.")

if __name__ == "__main__":
    migrate()
