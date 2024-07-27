import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProductManager } from '../../services/product_manager';

const ProductListScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const productManager = new ProductManager();

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await productManager.get_all_products();
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Products</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productItem: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
});

export default ProductListScreen;