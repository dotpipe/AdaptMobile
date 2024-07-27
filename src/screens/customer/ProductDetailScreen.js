// src/screens/customer/ProductDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ProductManager } from '../../services/product_manager';
import { CartManager } from '../../services/cart_manager';
import { useProductDetails } from '../../hooks/useProductDetails';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const { product, loading } = useProductDetails(productId);
  const [quantity, setQuantity] = useState(1);
  const productManager = new ProductManager();
  const cartManager = new CartManager();

  const handleAddToCart = async () => {
    const userId = 'current_user_id'; // Replace with actual user ID
    await cartManager.add_to_cart(userId, productId, quantity);
    navigation.navigate('Cart');
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      {product.show_percent_to_customers && (
        <Text style={styles.remaining}>
          {product.percent_remaining.toFixed(1)}% remaining
        </Text>
      )}
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    color: '#007AFF',
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 24,
  },
  remaining: {
    fontSize: 16,
    color: 'orange',
    marginBottom: 16,
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;