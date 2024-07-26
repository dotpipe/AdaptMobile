// src/screens/RecommendationsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { get_recommendations_for_user } from '../services/recommendation_engine';
import { getCurrentUserId } from '../utils/auth';
import DealCard from '../components/DealCard';

const RecommendationsScreen = ({ navigation }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    const userId = await getCurrentUserId();
    const recommendedDeals = await get_recommendations_for_user(userId);
    setRecommendations(recommendedDeals);
    setLoading(false);
  };

  const renderDeal = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DealDetails', { deal: item })}>
      <DealCard deal={item} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personalized Deals for You</Text>
      {loading ? (
        <Text style={styles.loadingText}>Finding the best deals for you...</Text>
      ) : (
        <FlatList
          data={recommendations}
          renderItem={renderDeal}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity style={styles.refreshButton} onPress={fetchRecommendations}>
        <Text style={styles.refreshButtonText}>Refresh Recommendations</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecommendationsScreen;