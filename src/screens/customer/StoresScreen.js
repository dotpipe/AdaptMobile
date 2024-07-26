// src/screens/customer/StoresScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchStores, makeReservation } from '../../services/api';
import StoreCard from '../../components/StoreCard';
import ReservationModal from '../../components/ReservationModal';

const StoresScreen = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchStores().then(setStores);
  }, []);

  const handleReservation = (storeId, timeSlot) => {
    makeReservation(storeId, timeSlot)
      .then(() => {
        // Handle successful reservation
        setModalVisible(false);
      })
      .catch(error => {
        // Handle reservation error
        console.error('Reservation failed:', error);
      });
  };

  const renderStoreItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedStore(item);
      setModalVisible(true);
    }}>
      <StoreCard store={item} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nearby Stores</Text>
      <FlatList
        data={stores}
        renderItem={renderStoreItem}
        keyExtractor={item => item.id.toString()}
      />
      {selectedStore && (
        <ReservationModal
          visible={modalVisible}
          store={selectedStore}
          onClose={() => setModalVisible(false)}
          onReserve={handleReservation}
        />
      )}
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
});

export default StoresScreen;