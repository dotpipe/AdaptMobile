// src/components/DealBrowser.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { DealManager } from '../services/DealManager';
import { getCurrentLocation } from '../utils/geofence';

const DealBrowser = () => {
  const [deals, setDeals] = useState([]);
  const dealManager = new DealManager();

  useEffect(() => {
    const fetchDeals = async () => {
      const userLocation = await getCurrentLocation();
      const nearbyDeals = await dealManager.get_deals(userLocation);
      setDeals(nearbyDeals);
    };
    fetchDeals();
  }, []);

  const renderDeal = ({ item }) => (
    <View style={styles.dealItem}>
      <Text style={styles.dealTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Expires: {item.expiryDate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nearby Deals</Text>
      <FlatList
        data={deals}
        renderItem={renderDeal}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dealItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export { DealCreationForm, DealBrowser };