import sqlite3
import os
import glob
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self, db_path="fabricadb.sqlite", migrations_dir="migrations"):
        self.db_path = db_path
        self.migrations_dir = migrations_dir

    def get_connection(self):
        """Returns a connection to the SQLite database."""
        # Use uri=True to allow shared memory databases
        conn = sqlite3.connect(self.db_path, uri=True)
        conn.row_factory = sqlite3.Row
        # Enable foreign keys for SQLite
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def run_migrations(self):
        """Discovers and runs SQL migrations in the migrations directory."""
        if not os.path.exists(self.migrations_dir):
            raise FileNotFoundError(f"Migrations directory not found: {self.migrations_dir}")

        migration_files = sorted(glob.glob(os.path.join(self.migrations_dir, "*.sql")))
        
        with self.get_connection() as conn:
            cursor = conn.cursor()
            # Create a table to track migrations if it doesn't exist
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS _migrations (
                    filename TEXT PRIMARY KEY,
                    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            for file_path in migration_files:
                filename = os.path.basename(file_path)
                cursor.execute('SELECT filename FROM _migrations WHERE filename = ?', (filename,))
                if cursor.fetchone() is None:
                    print(f"Applying migration: {filename}")
                    with open(file_path, 'r', encoding='utf-8') as f:
                        sql_script = f.read()
                        try:
                            cursor.executescript(sql_script)
                            cursor.execute('INSERT INTO _migrations (filename) VALUES (?)', (filename,))
                            conn.commit()
                        except Exception as e:
                            conn.rollback()
                            print(f"Failed to apply migration {filename}: {str(e)}")
                            raise e

    def health_check(self):
        """Runs a quick health check on the database."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT 1")
                return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e), "timestamp": datetime.utcnow().isoformat()}

    def execute_query(self, query, params=()):
        """Utility method to execute a custom query."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            return cursor.fetchall()
