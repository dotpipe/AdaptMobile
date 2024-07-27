# src/services/cart_manager.py

class CartManager:
    def __init__(self):
        self.db = Database()

    async def add_to_cart(self, user_id, product_id, quantity):
        return await self.db.add_to_cart(user_id, product_id, quantity)

    async def get_cart(self, user_id):
        return await self.db.get_cart(user_id)

    async def update_cart_item(self, user_id, product_id, quantity):
        return await self.db.update_cart_item(user_id, product_id, quantity)

    async def remove_from_cart(self, user_id, product_id):
        return await self.db.remove_from_cart(user_id, product_id)

    async def request_hold(self, user_id, store_id):
        cart_items = await self.get_cart(user_id)
        hold_limit = await self.db.get_store_hold_limit(store_id)
        
        if len(cart_items) <= hold_limit:
            hold_id = await self.db.create_hold(user_id, store_id, cart_items)
            await self.db.clear_cart(user_id)
            return hold_id
        else:
            raise Exception("Hold limit exceeded")

    async def get_hold_status(self, hold_id):
        return await self.db.get_hold_status(hold_id)
