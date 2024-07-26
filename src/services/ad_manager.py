# src/services/ad_manager.py

class AdManager:
    def __init__(self):
        self.db = Database()

    async def get_current_ads(self):
        all_ads = await self.db.get_all_ads()
        current_hour = datetime.now().hour
        return [ad for ad in all_ads if current_hour in ad.display_hours]

    async def update_ad_schedule(self, ad_id, display_hours):
        await self.db.update_ad_schedule(ad_id, display_hours)