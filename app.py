from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from server_database import ServerDatabase
from store_database import StoreDatabase
from client_database import ClientDatabase
from ad_manager import AdManager
from sync_manager import SyncManager

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this!
jwt = JWTManager(app)

server_db = ServerDatabase()
store_db = StoreDatabase()
client_db = ClientDatabase()
ad_manager = AdManager()
sync_manager = SyncManager()

@app.route('/add_brand', methods=['POST'])
def api_add_brand():
    data = request.json
    brand_id = add_brand(data['brand_name'], data['head_quarters'], data['tax_id'], 
                         data['address1'], data['address2'], data['state'], data['city'], 
                         data['zip_code'], data['phone'], data['icon'])
    return jsonify({'brand_id': brand_id}), 200

@app.route('/add_franchise', methods=['POST'])
def api_add_franchise():
    data = request.json
    store_id = add_franchise(data['brand_id'], data['store_no'], data['owner_id'], 
                             data['manager'], data['addr_str'], data['city'], 
                             data['state'], data['phone'], data['email'])
    return jsonify({'store_id': store_id}), 200

@app.route('/add_ad', methods=['POST'])
def api_add_ad():
    data = request.json
    ad_id = add_ad(data['store_id'], data['slogan'], data['description'], 
                   data['img'], data['total_paid'], data['start'], 
                   data['end'], data['url'], data['zip_code'])
    return jsonify({'ad_id': ad_id}), 200

@app.route('/fetch_deals', methods=['GET'])
def api_fetch_deals():
    category_id = request.args.get('category_id', type=int)
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    deals = fetch_deals_by_category(category_id, (lat, lon))
    return jsonify({'deals': deals}), 200

@app.route('/get_hot_deals', methods=['GET'])
def api_get_hot_deals():
    user_id = request.args.get('user_id', type=int)
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    hot_deals = get_hot_deals(user_id, (lat, lon))
    return jsonify({'hot_deals': hot_deals}), 200

@app.route('/get_trending_deals', methods=['GET'])
def api_get_trending_deals():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    trending_deals = get_trending_deals((lat, lon))
    return jsonify({'trending_deals': trending_deals}), 200

@app.route('/calculate_price', methods=['GET'])
def api_calculate_price():
    num_zip_codes = request.args.get('num_zip_codes', type=int)
    num_ads = request.args.get('num_ads', type=int)
    price = calculate_ad_price(num_zip_codes, num_ads)
    return jsonify({'price': price}), 200

# Authentication
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    user = server_db.authenticate_user(username, password)
    if user:
        access_token = create_access_token(identity=user['id'])
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad username or password"}), 401

# Brand endpoints
@app.route('/api/brand/analytics', methods=['GET'])
@jwt_required
def brand_analytics():
    brand_id = get_jwt_identity()
    data = {
        'global_sales': server_db.get_global_sales(brand_id),
        'franchise_performance': server_db.get_franchise_performance(brand_id),
        'market_trends': server_db.get_market_trends(brand_id)
    }
    return jsonify(data)

@app.route('/api/brand/franchises', methods=['GET'])
@jwt_required
def get_brand_franchises():
    brand_id = get_jwt_identity()
    franchises = server_db.get_brand_franchises(brand_id)
    return jsonify(franchises)

# Franchise endpoints
@app.route('/api/franchise/analytics', methods=['GET'])
@jwt_required
def franchise_analytics():
    franchise_id = get_jwt_identity()
    data = {
        'overall_sales': server_db.get_franchise_sales(franchise_id),
        'store_performance': server_db.get_store_performance(franchise_id),
        'product_trends': server_db.get_product_trends(franchise_id)
    }
    return jsonify(data)

@app.route('/api/franchise/stores', methods=['GET'])
@jwt_required
def get_franchise_stores():
    franchise_id = get_jwt_identity()
    stores = server_db.get_franchise_stores(franchise_id)
    return jsonify(stores)

@app.route('/api/franchise/deals', methods=['GET', 'POST'])
@jwt_required
def franchise_deals():
    franchise_id = get_jwt_identity()
    if request.method == 'GET':
        deals = server_db.get_franchise_deals(franchise_id)
        return jsonify(deals)
    elif request.method == 'POST':
        data = request.json
        deal_id = server_db.add_franchise_deal(franchise_id, data['deal_name'], 
                                               data['discount_percentage'], data['start_date'], data['end_date'])
        return jsonify({"success": True, "deal_id": deal_id})

# Store endpoints
@app.route('/api/store/analytics', methods=['GET'])
@jwt_required
def store_analytics():
    store_id = get_jwt_identity()
    data = {
        'sales_report': store_db.get_sales_report(store_id),
        'inventory_levels': store_db.get_inventory_levels(store_id),
        'customer_traffic': store_db.get_customer_traffic(store_id),
        'popular_products': store_db.get_popular_products(store_id),
        'performance_metrics': store_db.get_performance_metrics(store_id),
        'current_holds': store_db.get_current_holds(store_id)
    }
    return jsonify(data)

@app.route('/api/store/inventory', methods=['GET', 'POST'])
@jwt_required
def store_inventory():
    store_id = get_jwt_identity()
    if request.method == 'GET':
        inventory = store_db.get_inventory(store_id)
        return jsonify(inventory)
    elif request.method == 'POST':
        data = request.json
        success = store_db.update_inventory(store_id, data['product_id'], data['quantity'])
        return jsonify({"success": success})

@app.route('/api/store/deals', methods=['GET', 'POST'])
@jwt_required
def store_deals():
    store_id = get_jwt_identity()
    if request.method == 'GET':
        deals = store_db.get_store_deals(store_id)
        return jsonify(deals)
    elif request.method == 'POST':
        data = request.json
        deal_id = store_db.add_store_deal(store_id, data['deal_name'], 
                                          data['discount_percentage'], data['start_date'], data['end_date'])
        return jsonify({"success": True, "deal_id": deal_id})

@app.route('/api/store/holds', methods=['GET', 'POST'])
@jwt_required
def store_holds():
    store_id = get_jwt_identity()
    if request.method == 'GET':
        holds = store_db.get_current_holds(store_id)
        return jsonify(holds)
    elif request.method == 'POST':
        data = request.json
        hold_id = store_db.create_hold(store_id, data['user_id'], data['product_id'], data['quantity'])
        return jsonify({"success": True, "hold_id": hold_id})

# Client endpoints
@app.route('/api/client/profile', methods=['GET', 'PUT'])
@jwt_required
def client_profile():
    client_id = get_jwt_identity()
    if request.method == 'GET':
        profile = client_db.get_client_profile(client_id)
        return jsonify(profile)
    elif request.method == 'PUT':
        data = request.json
        success = client_db.update_client_profile(client_id, data)
        return jsonify({"success": success})

@app.route('/api/client/orders', methods=['GET', 'POST'])
@jwt_required
def client_orders():
    client_id = get_jwt_identity()
    if request.method == 'GET':
        orders = client_db.get_client_orders(client_id)
        return jsonify(orders)
    elif request.method == 'POST':
        data = request.json
        order_id = client_db.create_order(client_id, data['store_id'], data['items'])
        return jsonify({"success": True, "order_id": order_id})

@app.route('/api/client/cart', methods=['GET', 'POST', 'DELETE'])
@jwt_required
def client_cart():
    client_id = get_jwt_identity()
    if request.method == 'GET':
        cart = client_db.get_client_cart(client_id)
        return jsonify(cart)
    elif request.method == 'POST':
        data = request.json
        success = client_db.add_to_cart(client_id, data['product_id'], data['quantity'])
        return jsonify({"success": success})
    elif request.method == 'DELETE':
        data = request.json
        success = client_db.remove_from_cart(client_id, data['product_id'])
        return jsonify({"success": success})

# Ad management
@app.route('/api/ads/current', methods=['GET'])
def get_current_ads():
    ads = ad_manager.get_current_ads()
    return jsonify(ads)

@app.route('/api/ads/update', methods=['POST'])
@jwt_required
def update_ad_schedule():
    data = request.json
    success = ad_manager.update_ad_schedule(data['ad_id'], data['display_hours'])
    return jsonify({"success": success})

# Sync management
@app.route('/api/sync', methods=['POST'])
@jwt_required
def trigger_sync():
    sync_manager.start_sync_loop()
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4322)
    