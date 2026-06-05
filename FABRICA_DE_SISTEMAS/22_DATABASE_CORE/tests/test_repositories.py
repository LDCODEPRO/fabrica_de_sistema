from repositories.core_repositories import ProjectRepository

def test_project_crud(db_manager):
    repo = ProjectRepository(db_manager)
    
    # Create
    pid = repo.create({
        "name": "Test Project",
        "description": "A test project",
        "client": "Test Client",
        "priority": "HIGH",
        "status": "ACTIVE"
    })
    
    # Get
    p = repo.get_by_id(pid)
    assert p is not None
    assert p['name'] == "Test Project"
    
    # Update
    repo.update(pid, {"name": "Updated Project"})
    p_updated = repo.get_by_id(pid)
    assert p_updated['name'] == "Updated Project"
    
    # List
    projects = repo.list()
    assert len(projects) == 1
    
    # Soft Delete
    repo.delete_soft(pid)
    assert repo.get_by_id(pid) is None
    
    # Check that it's still in the DB just with status DELETED
    res = db_manager.execute_query("SELECT status FROM projects WHERE id = ?", (pid,))
    assert res[0]['status'] == "DELETED"
