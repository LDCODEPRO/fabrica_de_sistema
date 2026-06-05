-- Migration 004: Evidence and Audit Tables

CREATE TABLE IF NOT EXISTS evidences (
    id TEXT PRIMARY KEY,
    mission_id TEXT,
    agent_id TEXT,
    evidence_type TEXT NOT NULL,
    file_path TEXT,
    status TEXT DEFAULT 'ACTIVE',
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(mission_id) REFERENCES missions(id),
    FOREIGN KEY(agent_id) REFERENCES agents(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    actor TEXT,
    target_id TEXT,
    status TEXT DEFAULT 'SUCCESS',
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS billing_events (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    provider_id TEXT,
    cost_estimate REAL NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'BILLED',
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(project_id) REFERENCES projects(id),
    FOREIGN KEY(provider_id) REFERENCES llm_providers(id)
);

CREATE TABLE IF NOT EXISTS system_health (
    id TEXT PRIMARY KEY,
    component_name TEXT NOT NULL,
    health_status TEXT NOT NULL,
    latency_ms INTEGER,
    status TEXT DEFAULT 'ACTIVE',
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS backup_events (
    id TEXT PRIMARY KEY,
    backup_file_path TEXT NOT NULL,
    size_bytes INTEGER,
    status TEXT DEFAULT 'SUCCESS',
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
