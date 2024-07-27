// mobile/AdaptMobile/AdaptMobile/src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import AdCard from '../components/AdCard';
import WebSocketService from '../services/WebSocketService';
import NetworkService from '../services/NetworkService';

const HomeScreen = ({ navigation }) => {
  const [ads, setAds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    NetworkService.init();
    NetworkService.addListener(handleConnectivityChange);
    fetchAds();
    WebSocketService.connect();
    WebSocketService.subscribe('adUpdate', handleAdUpdate);

    return () => {
      NetworkService.removeListener(handleConnectivityChange);
      WebSocketService.unsubscribe('adUpdate', handleAdUpdate);
    };
  }, []);

  const handleConnectivityChange = (isConnected) => {
    setIsOffline(!isConnected);
    if (isConnected) {
      fetchAds();
    }
  };

  const fetchAds = async () => {
    try {
      setRefreshing(true);
      const data = await NetworkService.fetchWithCache('https://api.adaptmobile.com/ads');
      setAds(data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAdUpdate = (updatedAd) => {
    setAds(prevAds => prevAds.map(ad => 
      ad.id === updatedAd.id ? { ...ad, ...updatedAd } : ad
    ));
  };

  return (
    <View style={styles.container}>
      {isOffline && <Text style={styles.offlineText}>You are offline. Some features may be limited.</Text>}
      <FlatList
        data={ads}
        renderItem={({ item }) => <AdCard ad={item} onPress={() => navigation.navigate('AdDetail', { ad: item })} />}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAds} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  offlineText: {
    backgroundColor: 'red',
    color: 'white',
    textAlign: 'center',
    padding: 10,
  },
});

export default HomeScreen;