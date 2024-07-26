import asyncio
from datetime import datetime, timedelta
from geopy.distance import distance
from src.services.api import API
from src.utils.geofence import is_in_distribution_circle

class DealManager:
    def __init__(self):
        self.api = API()
        self.cache = {}
        self.cache_expiry = timedelta(minutes=5)

    async def create_deal(self, store_id, deal_data):
        response = await self.api.post(f'/stores/{store_id}/deals', deal_data)
        if response.status == 201:
            await self.invalidate_cache(store_id)
        return response.json()

    async def get_deals(self, user_location, radius=10):
        cache_key = f"deals_{user_location[0]}_{user_location[1]}_{radius}"
        if cache_key in self.cache and datetime.now() < self.cache[cache_key]['expiry']:
            return self.cache[cache_key]['data']

        deals = await self.api.get('/deals')
        filtered_deals = [
            deal for deal in deals
            if is_in_distribution_circle(user_location, (deal['latitude'], deal['longitude']), radius)
        ]
        self.cache[cache_key] = {
            'data': filtered_deals,
            'expiry': datetime.now() + self.cache_expiry
        }
        return filtered_deals

    async def update_deal(self, deal_id, update_data):
        response = await self.api.patch(f'/deals/{deal_id}', update_data)
        if response.status == 200:
            await self.invalidate_cache()
        return response.json()

    async def delete_deal(self, deal_id):
        response = await self.api.delete(f'/deals/{deal_id}')
        if response.status == 204:
            await self.invalidate_cache()
        return True

    async def get_deal_analytics(self, deal_id):
        return await self.api.get(f'/deals/{deal_id}/analytics')

    async def rate_deal(self, deal_id, user_id, rating):
        return await self.api.post(f'/deals/{deal_id}/ratings', {'user_id': user_id, 'rating': rating})

    async def invalidate_cache(self, store_id=None):
        if store_id:
            keys_to_remove = [k for k in self.cache.keys() if k.startswith(f"deals_{store_id}")]
            for key in keys_to_remove:
                del self.cache[key]
        else:
            self.cache.clear()

    async def notify_users_of_new_deal(self, deal_id):
        deal = await self.api.get(f'/deals/{deal_id}')
        users = await self.api.get('/users')
        for user in users:
            if is_in_distribution_circle((user['latitude'], user['longitude']), (deal['latitude'], deal['longitude']), deal['radius']):
                await self.api.post('/notifications', {
                    'user_id': user['id'],
                    'message': f"New deal at {deal['store_name']}: {deal['description']}"
                })

    async def cleanup_expired_deals(self):
        current_time = datetime.now()
        deals = await self.api.get('/deals')
        for deal in deals:
            if datetime.fromisoformat(deal['end_time']) < current_time:
                await self.delete_deal(deal['id'])