// Usage in DealDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShareButton from '../components/ShareButton';

const DealDetailsScreen = ({ route }) => {
  const { deal } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{deal.title}</Text>
      <Text style={styles.description}>{deal.description}</Text>
      <Text style={styles.price}>Price: ${deal.price}</Text>
      <Text style={styles.expiry}>Expires: {deal.expiryDate}</Text>
      <ShareButton deal={deal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 10 },
  price: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  expiry: { fontSize: 14, color: 'gray', marginBottom: 20 },
});

export default DealDetailsScreen;