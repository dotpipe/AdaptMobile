// StoreOccupancy.js
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { isInDistributionCircle } from '../utils/geofence';
import { updateStoreOccupancy, fetchStoreOccupancy } from '../services/api';

const StoreOccupancy = ({ store, userLocation }) => {
  const [occupancy, setOccupancy] = useState(0);
  const [isNearby, setIsNearby] = useState(false);
  const [peakTimeAdvisory, setPeakTimeAdvisory] = useState('');

  useEffect(() => {
    const checkProximity = () => {
      const nearby = isInDistributionCircle(userLocation, [store.latitude, store.longitude], store.radius);
      setIsNearby(nearby);
      if (nearby) {
        updateStoreOccupancy(store.id, 1);
      }
    };

    checkProximity();
    const occupancyInterval = setInterval(() => {
      fetchStoreOccupancy(store.id).then(data => {
        setOccupancy(data.occupancy);
        setPeakTimeAdvisory(calculatePeakTimeAdvisory(data.occupancy, data.capacity));
      });
    }, 60000); // Update every minute

    return () => {
      clearInterval(occupancyInterval);
      if (isNearby) {
        updateStoreOccupancy(store.id, -1);
      }
    };
  }, [store, userLocation]);

  const calculatePeakTimeAdvisory = (currentOccupancy, capacity) => {
    const occupancyPercentage = (currentOccupancy / capacity) * 100;
    if (occupancyPercentage < 30) return "Quiet now, great time to visit!";
    if (occupancyPercentage < 60) return "Moderately busy";
    if (occupancyPercentage < 90) return "Very busy, expect some wait";
    return "Extremely busy, long waits likely";
  };

  return (
    <View>
      <Text>Current Occupancy: {occupancy}</Text>
      <Text>Advisory: {peakTimeAdvisory}</Text>
    </View>
  );
};

export default StoreOccupancy;