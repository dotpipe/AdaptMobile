// src/screens/DealDetailsScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const DealDetailsScreen = ({ route }) => {
  const { deal } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{deal.title}</Text>
      <Image source={{ uri: deal.imageUrl }} style={styles.image} />
      <Text style={styles.description}>{deal.description}</Text>
      <Text style={styles.price}>Price: ${deal.price}</Text>
      <Text style={styles.expiry}>Expires: {deal.expiryDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  image: { width: '100%', height: 200, marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 10 },
  price: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  expiry: { fontSize: 14, color: 'gray' },
});

export default DealDetailsScreen;