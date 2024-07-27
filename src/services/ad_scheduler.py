from datetime import datetime, timedelta
import pytz

class AdScheduler:
    def __init__(self, db_connection):
        self.db = db_connection

    def schedule_ad(self, ad_id, start_date, end_date, selected_hours, daily_budget):
        current_date = start_date
        while current_date <= end_date and (end_date - start_date).days <= 28:
            for hour in selected_hours:
                self.db.execute_query("""
                    INSERT INTO ad_schedule (ad_id, scheduled_time, budget)
                    VALUES (?, ?, ?)
                """, (ad_id, current_date.replace(hour=hour), daily_budget / len(selected_hours)))
            current_date += timedelta(days=1)

    def cancel_ad(self, ad_id, scheduled_time):
        current_time = datetime.now(pytz.utc)
        if scheduled_time - current_time > timedelta(hours=3):
            self.db.execute_query("""
                DELETE FROM ad_schedule
                WHERE ad_id = ? AND scheduled_time = ?
            """, (ad_id, scheduled_time))
            return True
        return False

    def get_active_ads(self, zipcode, current_time):
        return self.db.fetch_all("""
            SELECT a.ad_id, a.content, a.target_zipcode, s.budget
            FROM ads a
            JOIN ad_schedule s ON a.ad_id = s.ad_id
            WHERE a.target_zipcode = ? AND s.scheduled_time = ?
        """, (zipcode, current_time))