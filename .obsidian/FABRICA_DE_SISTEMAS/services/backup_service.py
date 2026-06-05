from repositories.core_repositories import HealthRepository
from database_manager import DatabaseManager
import os
import shutil
from datetime import datetime

class BackupService:
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager

    def register_backup(self, backup_file_path: str, size_bytes: int):
        # We can use a direct query or repository if we create a BackupEventRepository
        # We will use direct query for this specific event to avoid creating another repo class just for this
        query = "INSERT INTO backup_events (id, backup_file_path, size_bytes) VALUES (?, ?, ?)"
        import uuid
        event_id = str(uuid.uuid4())
        with self.db_manager.get_connection() as conn:
            conn.execute(query, (event_id, backup_file_path, size_bytes))
            conn.commit()
        return event_id
