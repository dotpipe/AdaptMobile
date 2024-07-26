// src/components/StoreDoorPosition.js
import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { updateStoreDoorPosition } from '../services/api';

const StoreDoorPosition = ({ storeId }) => {
  const [doorPosition, setDoorPosition] = useState(null);

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setDoorPosition({ latitude, longitude });
      },
      error => console.log('Error getting location:', error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const saveDoorPosition = async () => {
    if (doorPosition) {
      try {
        await updateStoreDoorPosition(storeId, doorPosition);
        alert('Door position updated successfully!');
      } catch (error) {
        console.error('Error updating door position:', error);
        alert('Failed to update door position. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Store Door Position</Text>
      <Button title="Get Current Location" onPress={getCurrentPosition} />
      {doorPosition && (
        <Text style={styles.coordinates}>
          Lat: {doorPosition.latitude.toFixed(6)}, Lon: {doorPosition.longitude.toFixed(6)}
        </Text>
      )}
      <Button title="Save Door Position" onPress={saveDoorPosition} disabled={!doorPosition} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  coordinates: {
    marginVertical: 10,
  },
});

export default StoreDoorPosition;