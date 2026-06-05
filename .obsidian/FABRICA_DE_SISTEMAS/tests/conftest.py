import pytest
import os
import sys

# Ensure the root of 22_DATABASE_CORE is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database_manager import DatabaseManager

@pytest.fixture
def db_manager():
    # Use memory for tests to avoid WinError 32
    test_db_path = "file::memory:?cache=shared"
    
    db = DatabaseManager(db_path=test_db_path, migrations_dir=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "migrations"))
    db.run_migrations()
    
    yield db
    # No cleanup needed for :memory:
