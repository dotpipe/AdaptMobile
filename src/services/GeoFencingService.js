import BackgroundGeolocation from 'react-native-background-geolocation';
import { updateHeatmap } from './heatmapService';

export const startGeofenceMonitoring = (userId) => {
  BackgroundGeolocation.onGeofence(geofenceEvent => {
    console.log('[geofence] ', geofenceEvent.identifier, geofenceEvent.action);
    if (geofenceEvent.action === 'ENTER') {
      enterStore(geofenceEvent.identifier);
    } else if (geofenceEvent.action === 'EXIT') {
      leaveStore();
    }
  });

  BackgroundGeolocation.ready({
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 5,
    stopOnTerminate: false,
    startOnBoot: true,
    debug: true,
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    geofenceInitialTriggerEntry: true,
  }, (state) => {
    console.log("- BackgroundGeolocation is ready: ", state);
    BackgroundGeolocation.start();
  });
};

let storeInterval = null;

export const enterStore = (storeId) => {
  storeInterval = setInterval(() => {
    BackgroundGeolocation.getCurrentPosition({
      samples: 1,
      persist: true
    }, (location) => {
      console.log('[store location] ', location);
      updateHeatmap(location.coords.latitude, location.coords.longitude);
    });
  }, 15 * 1000); // 15 seconds interval
};

export const leaveStore = () => {
  if (storeInterval) {
    clearInterval(storeInterval);
    storeInterval = null;
  }
};

export const manualLocationUpdate = () => {
  BackgroundGeolocation.getCurrentPosition({
    samples: 1,
    persist: true
  }, (location) => {
    console.log('[manual location] ', location);
    updateHeatmap(location.coords.latitude, location.coords.longitude);
  });
};