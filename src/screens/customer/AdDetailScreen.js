// mobile/AdaptMobile/AdaptMobile/src/screens/AdDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { CartManager } from '../services/CartManager';
import WebSocketService from '../services/WebSocketService';

const AdDetailScreen = ({ route }) => {
  const { ad } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [remainingPercentage, setRemainingPercentage] = useState(100);
  const [itemsLeft, setItemsLeft] = useState(ad.initialQuantity);
  const [dealLimit, setDealLimit] = useState(ad.dealLimit || Infinity);
  const navigation = useNavigation();
  const cartManager = new CartManager();
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    WebSocketService.subscribe(`adUpdate_${ad.id}`, handleAdUpdate);
    return () => WebSocketService.unsubscribe(`adUpdate_${ad.id}`, handleAdUpdate);
  }, [ad.id]);

  const handleAdUpdate = (updatedAd) => {
    setRemainingPercentage(updatedAd.remainingPercentage);
    setItemsLeft(updatedAd.itemsLeft);
    setDealLimit(updatedAd.dealLimit || Infinity);
    animateUpdate();
  };

  const animateUpdate = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
    ]).start();
  };

  const increaseQuantity = () => {
    if (quantity < Math.min(itemsLeft, dealLimit)) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const addToCart = () => {
    cartManager.addToCart(ad, quantity);
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Icon name="close" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>{ad.title}</Text>
      <Text style={styles.description}>{ad.description}</Text>
      <Text style={styles.price}>${ad.price}</Text>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.remaining}>{remainingPercentage}% remaining</Text>
        <Text style={styles.itemsLeft}>{itemsLeft} items left</Text>
        <Text style={styles.dealLimit}>Limit: {dealLimit} per customer</Text>
      </Animated.View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={decreaseQuantity}>
          <Icon name="remove" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity onPress={increaseQuantity}>
          <Icon name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={styles.addToCartButton} 
        onPress={addToCart}
        disabled={quantity > itemsLeft || quantity > dealLimit}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
  remaining: {
    fontSize: 16,
    color: 'orange',
    marginBottom: 5,
  },
  itemsLeft: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 5,
  },
  dealLimit: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdDetailScreen;