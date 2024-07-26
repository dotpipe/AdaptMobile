const API_URL = 'https://api.adapt.com';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';

export const updateStoreOccupancy = (storeId, change) => {
  const storeRef = firebase.database().ref(`stores/${storeId}/occupancy`);
  return storeRef.transaction(currentOccupancy => {
    return (currentOccupancy || 0) + change;
  });
};

export const fetchStoreOccupancy = (storeId) => {
  const storeRef = firebase.database().ref(`stores/${storeId}`);
  return storeRef.once('value').then(snapshot => snapshot.val());
};

export const subscribeToStoreOccupancy = (storeId, callback) => {
  const storeRef = firebase.database().ref(`stores/${storeId}`);
  storeRef.on('value', snapshot => callback(snapshot.val()));
  return () => storeRef.off('value');
};

export const fetchHotDeals = async () => {
  const response = await fetch(`${API_URL}/hot-deals`);
  return response.json();
};

export const fetchDeals = async () => {
  const response = await fetch(`${API_URL}/deals`);
  return response.json();
};

export const fetchStores = async () => {
  const response = await fetch(`${API_URL}/stores`);
  return response.json();
};

export const updateSettings = async (settings) => {
  const response = await fetch(`${API_URL}/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  return response.json();
};