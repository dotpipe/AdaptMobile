// src/screens/customer/DealsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchDeals, subscribeToStoreOccupancy } from '../../services/api';
import DealCard from '../../components/DealCard';
import OccupancyIndicator from '../../components/OccupancyIndicator';

const DealsScreen = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const loadDeals = async () => {
      const fetchedDeals = await fetchDeals();
      setDeals(fetchedDeals);

      fetchedDeals.forEach(deal => {
        subscribeToStoreOccupancy(deal.storeId, (occupancy) => {
          setDeals(prevDeals => prevDeals.map(prevDeal => 
            prevDeal.id === deal.id ? { ...prevDeal, occupancy } : prevDeal
          ));
        });
      });
    };

    loadDeals();

    // Cleanup subscriptions on component unmount
    return () => {
      deals.forEach(deal => {
        // Unsubscribe from occupancy updates
      });
    };
  }, []);

  const renderDealItem = ({ item }) => (
    <View style={styles.dealContainer}>
      <DealCard deal={item} />
      <OccupancyIndicator occupancy={item.occupancy} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hot Deals</Text>
      <FlatList
        data={deals}
        renderItem={renderDealItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dealContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default DealsScreen;