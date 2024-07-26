import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchHotDeals, fetchUserPreferences } from '../../services/api';
import DealCard from '../../components/DealCard';
import { getCurrentLocation } from '../../utils/geofence';

const HomeScreen = () => {
  const [personalizedDeals, setPersonalizedDeals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const loadPersonalizedContent = async () => {
      const location = await getCurrentLocation();
      setUserLocation(location);

      const userPrefs = await fetchUserPreferences();
      const hotDeals = await fetchHotDeals(location);

      const tailoredDeals = hotDeals.filter(deal => 
        userPrefs.categories.includes(deal.category) ||
        userPrefs.favoriteStores.includes(deal.storeId)
      );

      setPersonalizedDeals(tailoredDeals);
    };

    loadPersonalizedContent();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome back!</Text>
      <Text style={styles.subheader}>Deals just for you</Text>
      <FlatList
        data={personalizedDeals}
        renderItem={({ item }) => <DealCard deal={item} userLocation={userLocation} />}
        keyExtractor={item => item.id.toString()}
      />
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
    marginBottom: 8,
  },
  subheader: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default HomeScreen;