// mobile/AdaptMobile/AdaptMobile/src/services/LocationService.js
import * as Location from 'expo-location';
import { AdManager } from './AdManager';

export class LocationService {
  constructor() {
    this.adManager = new AdManager();
    this.currentZipCode = null;
  }

  async startLocationTracking() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 60000, // Check every minute
        distanceInterval: 1000, // Or every 1000 meters
      },
      this.handleLocationUpdate
    );
  }

  handleLocationUpdate = async (location) => {
    const { latitude, longitude } = location.coords;
    const newZipCode = await this.getZipCodeFromCoordinates(latitude, longitude);
    
    if (newZipCode && newZipCode !== this.currentZipCode) {
      this.currentZipCode = newZipCode;
      const ads = await this.adManager.getAdsForLocation(newZipCode);
      // Trigger UI update with new ads
    }
  }

  async getZipCodeFromCoordinates(latitude, longitude) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`
      );
      const data = await response.json();
      const zipCode = data.results[0].address_components.find(
        component => component.types.includes('postal_code')
      ).long_name;
      return zipCode;
    } catch (error) {
      console.error('Error fetching zip code:', error);
      return null;
    }
  }
}