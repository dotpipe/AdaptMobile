// CustomerScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const customerPages = [
  'Home',
  'ProductList',
  'Cart',
  'Profile',
  'OrderHistory',
  'Notifications'
];

export default function CustomerScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate(item)}>
      <Text style={{ padding: 10, fontSize: 18 }}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Customer Pages</Text>
      <FlatList
        data={customerPages}
        renderItem={renderItem}
        keyExtractor={item => item}
      />
    </View>
  );
}