// src/screens/customer/HomeScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AdManager } from '../../services/ad_manager';

const featuredProducts = await AdManager.get_featured_products();
const deals = await AdManager.get_current_deals();

const HomeScreen = () => {
  const navigation = useNavigation();

  const renderFeaturedProduct = ({ item }) => (
    <TouchableOpacity style={styles.featuredProductItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderDeal = ({ item }) => (
    <View style={styles.dealItem}>
      <Text style={styles.dealName}>{item.name}</Text>
      <Text style={styles.dealDiscount}>{item.discount}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to Adaptation</Text>
      
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <FlatList
          horizontal
          data={featuredProducts}
          renderItem={renderFeaturedProduct}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('ProductList')}
        >
          <Text style={styles.buttonText}>Browse Products</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.buttonText}>View Cart</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dealsSection}>
        <Text style={styles.sectionTitle}>Today's Deals</Text>
        <FlatList
          data={deals}
          renderItem={renderDeal}
          keyExtractor={item => item.id}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredSection: {
    marginBottom: 16,
  },
  featuredProductItem: {
    marginRight: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productName: {
    marginTop: 4,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dealsSection: {
    marginBottom: 16,
  },
  dealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dealName: {
    fontSize: 16,
  },
  dealDiscount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default HomeScreen;