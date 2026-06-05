import os
import re

root_dir = "20_OPERATIONAL_CORE"

for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(".py"):
            filepath = os.path.join(subdir, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Substituir "from ...05_DATABASE.models import X, Y"
            # por import dinâmico
            if "from ..." in content or "from .." in content:
                # Vamos substituir tudo com um regex simples.
                pass
            
            new_content = content
            
            # 1. mission_engine.py
            new_content = new_content.replace(
                "from ...05_DATABASE.models import Mission, AuditLog",
                "models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Mission', 'AuditLog'])\nMission = models.Mission\nAuditLog = models.AuditLog"
            )
            
            # 2. mission_queue.py
            new_content = new_content.replace(
                "from ...05_DATABASE.models import Mission",
                "models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Mission'])\nMission = models.Mission"
            )
            
            # 3. mission_state_manager.py
            new_content = new_content.replace(
                "from ...05_DATABASE.models import Mission, AuditLog",
                "models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Mission', 'AuditLog'])\nMission = models.Mission\nAuditLog = models.AuditLog"
            )
            
            # 4. mission_registry.py
            new_content = new_content.replace(
                "from ...05_DATABASE.models import Mission, AuditLog",
                "models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Mission', 'AuditLog'])\nMission = models.Mission\nAuditLog = models.AuditLog"
            )
            
            # 5. orchestrator.py
            new_content = new_content.replace(
                "from ...05_DATABASE.models import Mission, Agent, AuditLog",
                "models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Mission', 'Agent', 'AuditLog'])\nMission = models.Mission\nAgent = models.Agent\nAuditLog = models.AuditLog"
            )
            
            # 6. workflow_router.py
            new_content = new_content.replace(
                "from ...05_DATABASE.models import Mission",
                "models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Mission'])\nMission = models.Mission"
            )
            
            # 7. base_agent.py
            new_content = new_content.replace(
                "from ...05_DATABASE.models import Agent, MemoryEntry",
                "models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Agent', 'MemoryEntry'])\nAgent = models.Agent\nMemoryEntry = models.MemoryEntry"
            )
            
            # 8. main.py (KNOWLEDGE_API)
            new_content = new_content.replace(
                "from ...05_DATABASE.database import get_db",
                "database = __import__('20_OPERATIONAL_CORE.05_DATABASE.database', fromlist=['get_db'])\nget_db = database.get_db"
            )
            new_content = new_content.replace(
                "from ...05_DATABASE.models import KnowledgeQuery, Agent",
                "models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['KnowledgeQuery', 'Agent'])\nKnowledgeQuery = models.KnowledgeQuery\nAgent = models.Agent"
            )
            
            # 9. logger.py
            new_content = new_content.replace(
                "from ...05_DATABASE.models import AuditLog",
                "models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['AuditLog'])\nAuditLog = models.AuditLog"
            )
            
            # 10. metrics.py
            new_content = new_content.replace(
                "from ...05_DATABASE.models import Mission, Agent, KnowledgeQuery",
                "models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Mission', 'Agent', 'KnowledgeQuery'])\nMission = models.Mission\nAgent = models.Agent\nKnowledgeQuery = models.KnowledgeQuery"
            )

            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)

print("Imports corrigidos.")
