// mobile/AdaptMobile/AdaptMobile/src/services/NetworkService.js
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

class NetworkService {
  constructor() {
    this.isConnected = true;
    this.listeners = [];
  }

  init() {
    NetInfo.addEventListener(state => {
      this.isConnected = state.isConnected;
      this.notifyListeners();
    });
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.isConnected));
  }

  async fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }

  async fetchWithCache(url, options = {}) {
    const cacheKey = `cache_${url}`;
    try {
      if (!this.isConnected) {
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      }

      const response = await this.fetchWithTimeout(url, options);
      const data = await response.json();
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      throw error;
    }
  }
}

export default new NetworkService();