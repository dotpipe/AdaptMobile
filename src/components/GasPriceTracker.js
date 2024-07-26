// src/components/GasPriceTracker.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchGasPrices, updateGasPrice, fetchCrowdData } from '../services/api';
import { getCurrentLocation, isInDistributionCircle } from '../utils/geofence';

const GasPriceTracker = () => {
  const [gasPrices, setGasPrices] = useState({});
  const [crowdData, setCrowdData] = useState([]);
  const [newZipcode, setNewZipcode] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const location = await getCurrentLocation();
    setUserLocation(location);
    const prices = await fetchGasPrices(location);
    setGasPrices(prices);
    const crowd = await fetchCrowdData(location);
    setCrowdData(crowd);
  };

  const addGasPrice = async () => {
    if (newZipcode && newPrice) {
      await updateGasPrice(newZipcode, parseFloat(newPrice));
      setNewZipcode('');
      setNewPrice('');
      loadData();
    }
  };

  const renderGasPrice = ({ item }) => (
    <View style={styles.priceItem}>
      <Text style={styles.zipcode}>{item.zipcode}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      <Text style={styles.crowdInfo}>Crowd: {item.crowdCount || 'N/A'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gas Prices and Crowd Info Near You</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || 0,
          longitude: userLocation?.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {crowdData.map((point, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            pinColor="red"
          />
        ))}
      </MapView>
      <FlatList
        data={Object.entries(gasPrices).map(([zipcode, price]) => ({
          zipcode,
          price,
          crowdCount: crowdData.filter(point => 
            isInDistributionCircle([point.latitude, point.longitude], [price.latitude, price.longitude], 0.5)
          ).length
        }))}
        renderItem={renderGasPrice}
        keyExtractor={item => item.zipcode}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Zipcode"
          value={newZipcode}
          onChangeText={setNewZipcode}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={newPrice}
          onChangeText={setNewPrice}
          keyboardType="numeric"
        />
        <Button title="Add Price" onPress={addGasPrice} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  map: {
    height: 200,
    marginBottom: 10,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  zipcode: {
    fontSize: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  crowdInfo: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default GasPriceTracker;