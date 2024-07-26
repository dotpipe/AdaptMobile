// StoreScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const storePages = [
  'Dashboard',
  'Inventory',
  'Orders',
  'Analytics',
  'Settings',
  'CustomerManagement'
];

export default function StoreScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate(item)}>
      <Text style={{ padding: 10, fontSize: 18 }}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Store Pages</Text>
      <FlatList
        data={storePages}
        renderItem={renderItem}
        keyExtractor={item => item}
      />
    </View>
  );
}