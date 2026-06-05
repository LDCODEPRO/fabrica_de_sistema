from .mission_generator import MissionGenerator
from .task_allocator import TaskAllocator
from .dependency_resolver import DependencyResolver
from .priority_engine import PriorityEngine

class AutoOrchestrator:
    def __init__(self):
        self.mission_gen = MissionGenerator()
        self.task_alloc = TaskAllocator()
        self.dep_resolver = DependencyResolver()
        self.priority_engine = PriorityEngine()

    def orchestrate(self, blueprint: str, project_id: str) -> dict:
        """Lê o blueprint, gera missões e aloca tarefas."""
        missions = self.mission_gen.generate_missions(blueprint, project_id)
        
        all_tasks = []
        for mission in missions:
            tasks = self.task_alloc.allocate_tasks(mission)
            tasks = self.dep_resolver.resolve_dependencies(tasks)
            tasks = self.priority_engine.assign_priorities(tasks)
            all_tasks.extend(tasks)
            
        board = self._generate_board(missions, all_tasks)
        return {
            "missions": missions,
            "tasks": all_tasks,
            "board": board
        }

    def _generate_board(self, missions, tasks) -> str:
        board = "# MISSION BOARD\n\n"
        for m in missions:
            board += f"## {m['name']}\n"
            m_tasks = [t for t in tasks if t['mission_name'] == m['name']]
            for t in m_tasks:
                board += f"- [{t['status']}] {t['role']}: {t['name']} (Priority: {t['priority']})\n"
        return board
