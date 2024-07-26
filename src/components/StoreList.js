// src/components/StoreList.js
import React from 'react';
import { FlatList, View, Text } from 'react-native';
import StoreOccupancy from './StoreOccupancy';

const StoreList = ({ stores, userLocation }) => (
  <FlatList
    data={stores}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <View>
        <Text>{item.name}</Text>
        <Text>{item.address}</Text>
        <StoreOccupancy store={item} userLocation={userLocation} />
      </View>
    )}
  />
);

export default StoreList;