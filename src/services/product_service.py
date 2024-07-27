class ProductService:
    def __init__(self, db):
        self.db = db

    def get_product_details(self, product_id):
        query = """
        SELECT name, price, quantity_remaining, percent_remaining, 
               show_percent_to_customers
        FROM products
        WHERE product_id = ?
        """
        return self.db.fetch_one(query, (product_id,))