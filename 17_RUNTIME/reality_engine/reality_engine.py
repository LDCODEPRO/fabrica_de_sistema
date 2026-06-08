# Façade central do Reality Engine
from . import project_collector, mission_collector, provider_collector, github_collector, database_collector, filesystem_collector, timeline_collector, alert_collector, evidence_collector

def get_overview(db):
    missions = mission_collector.collect(db)
    projects = project_collector.collect(db)
    alerts = alert_collector.collect(db)
    deployments = {"status": "not_configured"} # TODO deployment_collector se existir
    
    return {
        "status": "ok",
        "active_missions": missions.get("active", 0),
        "total_projects": projects.get("total", 0),
        "system_alerts": alerts.get("total_unresolved", 0),
        "latest_deployment": deployments.get("status", "not_configured"),
        "source": "reality_engine"
    }

def get_health(db):
    return {
        "status": "ok",
        "database": database_collector.collect(db),
        "filesystem": filesystem_collector.collect(),
        "runtime": {"status": "active"}
    }

def get_providers(db):
    return provider_collector.collect(db)

def get_missions(db):
    return mission_collector.collect(db)

def get_github(db):
    return github_collector.collect(db)

def get_timeline(db):
    return timeline_collector.collect(db)

def get_alerts(db):
    return alert_collector.collect(db)

def get_evidence(db):
    return evidence_collector.collect(db)
