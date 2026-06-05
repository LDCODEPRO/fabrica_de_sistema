class StatusTracker:
    def __init__(self):
        self.history = {}

    def update_status(self, task_id: str, new_status: str):
        if task_id not in self.history:
            self.history[task_id] = []
        self.history[task_id].append(new_status)
        return True
