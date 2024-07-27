// src/screens/customer/HoldingScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { CartManager } from '../../services/cart_manager';

const HoldingScreen = ({ route, navigation }) => {
  const { storeId } = route.params;
  const [holdItems, setHoldItems] = useState([]);
  const [holdStatus, setHoldStatus] = useState(null);
  const cartManager = new CartManager();

  useEffect(() => {
    const requestHold = async () => {
      try {
        const userId = 'current_user_id'; // Replace with actual user ID
        const holdId = await cartManager.request_hold(userId, storeId);
        setHoldStatus('Pending');
        checkHoldStatus(holdId);
      } catch (error) {
        setHoldStatus('Failed');
        console.error(error);
      }
    };
    requestHold();
  }, []);

  const checkHoldStatus = async (holdId) => {
    const status = await cartManager.get_hold_status(holdId);
    setHoldStatus(status);
  };

  const renderHoldItem = ({ item }) => (
    <View style={styles.holdItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Item Hold Request</Text>
      <Text style={styles.status}>Status: {holdStatus}</Text>
      <FlatList
        data={holdItems}
        renderItem={renderHoldItem}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Shopping</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  status: {
    fontSize: 18,
    marginBottom: 16,
  },
  holdItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemName: {
    fontSize: 16,
    flex: 2,
  },
  itemQuantity: {
    fontSize: 16,
    flex: 1,
  },
  backButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HoldingScreen;