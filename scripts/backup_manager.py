import os
import shutil
import datetime
import tarfile

BACKUP_DIR = "backups"
DB_FILE = "nexus.db"
REPORTS_DIR = "19_RELATORIOS"

def run_backup():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = os.path.join(BACKUP_DIR, f"forja_backup_{timestamp}.tar.gz")
    
    print(f"[Backup] Iniciando backup para {backup_filename}...")
    
    with tarfile.open(backup_filename, "w:gz") as tar:
        if os.path.exists(DB_FILE):
            tar.add(DB_FILE, arcname=DB_FILE)
            print(f"[Backup] Adicionado {DB_FILE}")
        else:
            print(f"[Backup] AVISO: {DB_FILE} nao encontrado.")
            
        if os.path.exists(REPORTS_DIR):
            tar.add(REPORTS_DIR, arcname=REPORTS_DIR)
            print(f"[Backup] Adicionado {REPORTS_DIR}")
        else:
            print(f"[Backup] AVISO: {REPORTS_DIR} nao encontrado.")
            
    print("[Backup] Concluido com sucesso.")
    return backup_filename

if __name__ == "__main__":
    run_backup()
