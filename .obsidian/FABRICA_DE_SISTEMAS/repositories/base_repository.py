import uuid
from datetime import datetime

class BaseRepository:
    def __init__(self, db_manager, table_name):
        self.db_manager = db_manager
        self.table_name = table_name

    def create(self, data: dict):
        if 'id' not in data:
            data['id'] = str(uuid.uuid4())
        
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['?'] * len(data))
        query = f"INSERT INTO {self.table_name} ({columns}) VALUES ({placeholders})"
        
        with self.db_manager.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, tuple(data.values()))
            conn.commit()
            return data['id']

    def get_by_id(self, entity_id: str):
        query = f"SELECT * FROM {self.table_name} WHERE id = ? AND status != 'DELETED'"
        with self.db_manager.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (entity_id,))
            row = cursor.fetchone()
            return dict(row) if row else None

    def list(self, filters: dict = None):
        query = f"SELECT * FROM {self.table_name} WHERE status != 'DELETED'"
        params = []
        if filters:
            for k, v in filters.items():
                query += f" AND {k} = ?"
                params.append(v)
        
        with self.db_manager.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, tuple(params))
            return [dict(row) for row in cursor.fetchall()]

    def update(self, entity_id: str, data: dict):
        # We only update updated_at if it's a table that has it
        # Actually most tables have it, so we try, but safely:
        if 'updated_at' not in data:
            data['updated_at'] = datetime.utcnow().isoformat()
        
        set_clause = ', '.join([f"{k} = ?" for k in data.keys()])
        query = f"UPDATE {self.table_name} SET {set_clause} WHERE id = ?"
        params = list(data.values()) + [entity_id]
        
        with self.db_manager.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, tuple(params))
            conn.commit()
            return cursor.rowcount > 0

    def delete_soft(self, entity_id: str):
        # Using UPDATE instead of DELETE
        query = f"UPDATE {self.table_name} SET status = 'DELETED' WHERE id = ?"
        with self.db_manager.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (entity_id,))
            conn.commit()
            return cursor.rowcount > 0
