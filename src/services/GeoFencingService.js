// src/services/GeofencingService.js
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { updateStoreOccupancy } from './api';

export const startGeofencingService = (stores) => {
  BackgroundGeolocation.configure({
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    stationaryRadius: 50,
    distanceFilter: 50,
    debug: __DEV__,
    startOnBoot: false,
    stopOnTerminate: true,
    locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
    interval: 10000,
    fastestInterval: 5000,
    activitiesInterval: 10000,
  });

  BackgroundGeolocation.on('location', (location) => {
    stores.forEach(store => {
      const distance = calculateDistance(location, store);
      if (distance <= store.radius) {
        updateStoreOccupancy(store.id, 1);
      }
    });
  });

  BackgroundGeolocation.start();
};