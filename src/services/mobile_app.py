from datetime import datetime
import pytz

class MobileApp:
    def __init__(self, api_client):
        self.api_client = api_client
        self.current_zipcode = None

    def update_location(self, new_zipcode):
        if self.current_zipcode != new_zipcode:
            self.current_zipcode = new_zipcode
            self.fetch_ads()

    def fetch_ads(self):
        current_time = datetime.now(pytz.utc).replace(minute=0, second=0, microsecond=0)
        ads = self.api_client.get_ads(self.current_zipcode, current_time)
        self.display_ads(ads)

    def display_ads(self, ads):
        for ad in ads:
            print(f"Displaying ad: {ad['content']}")