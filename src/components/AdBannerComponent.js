// src/components/AdBannerComponent.js

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const AdBannerComponent = ({ ads }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // Change ad every 5 seconds

    return () => clearInterval(interval);
  }, [ads]);

  const handleAdPress = () => {
    const currentAd = ads[currentAdIndex];
    navigation.navigate('DealDetails', { deal: currentAd });
  };

  if (!ads || ads.length === 0) return null;

  return (
    <TouchableOpacity onPress={handleAdPress}>
      <Image
        source={{ uri: ads[currentAdIndex].imageUrl }}
        style={styles.adImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  adImage: {
    width: width,
    height: 100,
  },
});

export default AdBannerComponent;