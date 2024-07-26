import React from 'react';
import { View, Text, Image } from 'react-native';

const AdDisplay = ({ ad }) => (
  <View>
    <Text>{ad.slogan}</Text>
    <Image source={{ uri: ad.image_url }} style={{ width: 200, height: 200 }} />
    <Text>{ad.description}</Text>
  </View>
);

export default AdDisplay;