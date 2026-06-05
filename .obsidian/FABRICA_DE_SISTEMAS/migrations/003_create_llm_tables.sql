-- Migration 003: LLM Tables

CREATE TABLE IF NOT EXISTS llm_providers (
    id TEXT PRIMARY KEY,
    provider_name TEXT NOT NULL UNIQUE,
    secret_ref TEXT, -- Reference to Vault, NO REAL SECRETS
    last_health_check DATETIME,
    status TEXT DEFAULT 'ACTIVE',
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS llm_models (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL,
    model_name TEXT NOT NULL,
    capabilities_json TEXT,
    status TEXT DEFAULT 'ACTIVE',
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(provider_id) REFERENCES llm_providers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS llm_routing_rules (
    id TEXT PRIMARY KEY,
    model_id TEXT NOT NULL,
    priority INTEGER,
    task_type TEXT,
    status TEXT DEFAULT 'ACTIVE',
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(model_id) REFERENCES llm_models(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS llm_calls (
    id TEXT PRIMARY KEY,
    provider_id TEXT,
    agent_id TEXT,
    mission_id TEXT,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    cost_estimate REAL,
    execution_time_ms INTEGER,
    status TEXT DEFAULT 'SUCCESS',
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(provider_id) REFERENCES llm_providers(id),
    FOREIGN KEY(agent_id) REFERENCES agents(id),
    FOREIGN KEY(mission_id) REFERENCES missions(id)
);

CREATE TABLE IF NOT EXISTS knowledge_queries (
    id TEXT PRIMARY KEY,
    agent_id TEXT,
    query_text TEXT NOT NULL,
    confidence REAL,
    status TEXT DEFAULT 'SUCCESS',
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(agent_id) REFERENCES agents(id)
);
