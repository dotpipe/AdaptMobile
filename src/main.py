from datetime import datetime
from ad_scheduler import AdScheduler
from mobile_app import MobileApp

# Usage example
scheduler = AdScheduler(db_connection)
scheduler.schedule_ad(ad_id=1, 
                      start_date=datetime(2023, 5, 1), 
                      end_date=datetime(2023, 5, 28),
                      selected_hours=[9, 12, 15, 18],
                      daily_budget=20)

mobile_app = MobileApp(api_client)
mobile_app.update_location("12345")