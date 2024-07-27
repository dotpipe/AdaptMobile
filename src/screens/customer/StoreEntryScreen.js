import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { checkZipHash, downloadNewZip, updateProductSearch } from '../services/StoreService';

const StoreEntryScreen = ({ route, navigation }) => {
  const { storeId } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleStoreEntry = async () => {
      try {
        const netInfo = await NetInfo.fetch();
        
        if (netInfo.isConnected) {
          const isNewZip = await checkZipHash(storeId);
          if (isNewZip) {
            await downloadNewZip(storeId);
            await updateProductSearch(storeId);
          }
          const storeData = await AsyncStorage.getItem(`store_${storeId}`);
          const parsedData = JSON.parse(storeData);
          Alert.alert(
            "Welcome to the Store!",
            "Product information has been updated.",
            [{ text: "OK", onPress: () => navigation.navigate('StoreSpace', { storeId, storeData: parsedData }) }]
          );
        } else {
          const cachedData = await AsyncStorage.getItem(`store_${storeId}`);
          if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            Alert.alert(
              "Welcome to the Store!",
              "You're offline. Using last known store information.",
              [{ text: "OK", onPress: () => navigation.navigate('StoreSpace', { storeId, storeData: parsedData }) }]
            );
          } else {
            Alert.alert("Offline", "No cached data available for this store.");
          }
        }
      } catch (error) {
        Alert.alert("Error", "Failed to update store information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    handleStoreEntry();
  }, [storeId, navigation]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Updating store information...</Text>
      </View>
    );
  }

  return null;
};

export default StoreEntryScreen;