import React from 'react';
import { FlatList, Text, View } from 'react-native';

const DealList = ({ deals }) => (
  <FlatList
    data={deals}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <View>
        <Text>{item.store_name}</Text>
        <Text>{item.description}</Text>
      </View>
    )}
  />
);

export default DealList;