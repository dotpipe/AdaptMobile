# src/services/sync_manager.py

import hashlib
import asyncio
from datetime import datetime
from src.services.api import API
from src.utils.database import Database

class SyncManager:
    def __init__(self):
        self.api = API()
        self.db = Database()

    async def sync_deals(self):
        current_zip = await self.db.get_user_zip_code()
        server_hash = await self.api.get_deals_hash(current_zip)
        local_hash = await self.db.get_local_deals_hash()

        if server_hash != local_hash:
            new_deals = await self.api.get_deals(current_zip)
            await self.db.update_deals(new_deals)
            await self.db.set_local_deals_hash(server_hash)

    async def start_sync_loop(self):
        while True:
            await self.sync_deals()
            await asyncio.sleep(900)  # 15 minutes