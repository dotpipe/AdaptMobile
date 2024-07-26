# src/models/ad.py

class Ad:
    def __init__(self, id, content, display_hours):
        self.id = id
        self.content = content
        self.display_hours = [int(h) for h in display_hours.split(',')]

    def should_display(self):
        current_hour = datetime.now().hour
        return current_hour in self.display_hours