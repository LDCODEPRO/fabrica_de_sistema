def test_health_check(db_manager):
    status = db_manager.health_check()
    assert status["status"] == "healthy"

def test_migrations_applied(db_manager):
    # Verify tables exist
    res = db_manager.execute_query("SELECT name FROM sqlite_master WHERE type='table' AND name='projects'")
    assert len(res) == 1
    assert res[0]['name'] == 'projects'
