// mobile/AdaptMobile/AdaptMobile/src/services/CartManager.js
export class CartManager {
    constructor() {
        this.cart = [];
    }

    addToCart(item, quantity) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({ ...item, quantity });
        }
    }

    getCart() {
        return this.cart;
    }

    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity = newQuantity;
        }
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
    }

    // Add this method to mobile/AdaptMobile/AdaptMobile/src/services/CartManager.js
    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

}