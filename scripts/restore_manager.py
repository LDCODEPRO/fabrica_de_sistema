import os
import sys
import tarfile
import shutil

BACKUP_DIR = "backups"
DB_FILE = "nexus.db"
REPORTS_DIR = "19_RELATORIOS"

def run_restore(backup_filename):
    if not os.path.exists(backup_filename):
        print(f"[Restore] ERRO: Arquivo {backup_filename} não encontrado.")
        sys.exit(1)
        
    print(f"[Restore] Iniciando restauração a partir de {backup_filename}...")
    
    # Fazer backup de segurança antes de restaurar
    if os.path.exists(DB_FILE):
        safe_copy = DB_FILE + ".bak"
        shutil.copy2(DB_FILE, safe_copy)
        print(f"[Restore] Backup de segurança criado: {safe_copy}")
        
    try:
        with tarfile.open(backup_filename, "r:gz") as tar:
            tar.extractall(path=".")
        print("[Restore] Restauração concluída com sucesso.")
    except Exception as e:
        print(f"[Restore] ERRO durante a restauração: {e}")
        if os.path.exists(DB_FILE + ".bak"):
            print("[Restore] Revertendo para o backup de segurança...")
            shutil.copy2(DB_FILE + ".bak", DB_FILE)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python restore_manager.py <caminho_do_backup>")
        sys.exit(1)
    run_restore(sys.argv[1])
