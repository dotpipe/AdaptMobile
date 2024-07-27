// mobile/AdaptMobile/AdaptMobile/src/screens/CartScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { CartManager } from '../services/CartManager';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const cartManager = new CartManager();

  useEffect(() => {
    const items = cartManager.getCart();
    setCartItems(items.map(item => ({
      ...item,
      animation: new Animated.Value(1)
    })));
  }, []);

  const removeItem = (itemId) => {
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      Animated.timing(cartItems[itemIndex].animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        cartManager.removeFromCart(itemId);
        setCartItems(cartItems.filter(item => item.id !== itemId));
      });
    }
  };

  const renderItem = ({ item }) => (
    <Animated.View style={[
      styles.item,
      {
        opacity: item.animation,
        transform: [{
          scale: item.animation
        }]
      }
    ]}>
      <Text>{item.title}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Text style={styles.removeButton}>Remove</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  removeButton: {
    color: 'red',
  },
});

export default CartScreen;