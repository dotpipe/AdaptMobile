# src/services/ticket_notifier.py

import hashlib
from datetime import datetime
from src.services.api import API
from src.utils.push_notifications import send_push_notification

class TicketNotifier:
    def __init__(self):
        self.api = API()

    def generate_ticket_hash(self, shopper_id, store_id, order_id):
        hash_string = f"{shopper_id}:{store_id}:{order_id}:{datetime.now().isoformat()}"
        return hashlib.sha256(hash_string.encode()).hexdigest()[:12]

    async def create_ticket(self, shopper_id, store_id, order_id, pickup_time):
        ticket_hash = self.generate_ticket_hash(shopper_id, store_id, order_id)
        ticket_data = {
            'hash': ticket_hash,
            'shopper_id': shopper_id,
            'store_id': store_id,
            'order_id': order_id,
            'pickup_time': pickup_time,
            'status': 'pending'
        }
        await self.api.create_ticket(ticket_data)
        return ticket_hash

    async def notify_pickup(self, ticket_hash):
        ticket = await self.api.get_ticket(ticket_hash)
        if ticket['status'] == 'pending':
            shopper = await self.api.get_shopper(ticket['shopper_id'])
            store = await self.api.get_store(ticket['store_id'])
            message = f"Your order at {store['name']} is ready for pickup! Ticket: {ticket_hash}"
            await send_push_notification(shopper['device_token'], message)
            await self.api.update_ticket_status(ticket_hash, 'notified')

    async def complete_pickup(self, ticket_hash):
        await self.api.update_ticket_status(ticket_hash, 'completed')