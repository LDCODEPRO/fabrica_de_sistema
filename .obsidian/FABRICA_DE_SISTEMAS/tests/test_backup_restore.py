from services.backup_service import BackupService

def test_backup_service(db_manager):
    svc = BackupService(db_manager)
    event_id = svc.register_backup("C:/fake/path.bak", 1024)
    assert event_id is not None
    
    # Check if registered
    res = db_manager.execute_query("SELECT * FROM backup_events WHERE id = ?", (event_id,))
    assert len(res) == 1
    assert res[0]['backup_file_path'] == "C:/fake/path.bak"
    assert res[0]['size_bytes'] == 1024
