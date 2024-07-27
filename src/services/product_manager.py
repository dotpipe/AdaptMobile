# src/services/product_manager.py

from database import Database

class ProductManager:
    def __init__(self):
        self.db = Database()

    async def get_all_products(self):
        return await self.db.get_all_products()

    async def get_product_by_id(self, product_id):
        return await self.db.get_product_by_id(product_id)

    async def add_product(self, product_data):
        return await self.db.add_product(product_data)

    async def update_product(self, product_id, updated_data):
        return await self.db.update_product(product_id, updated_data)

    async def delete_product(self, product_id):
        return await self.db.delete_product(product_id)

    async def get_featured_products(self):
        all_products = await self.get_all_products()
        return [product for product in all_products if product.is_featured]

    async def update_product_inventory(self, product_id, quantity):
        return await self.db.update_product_inventory(product_id, quantity)