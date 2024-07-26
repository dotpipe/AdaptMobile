// src/screens/AdManagementScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { getAds, createAd, updateAd, deleteAd } from '../services/api';

const AdManagementScreen = () => {
  const [ads, setAds] = useState([]);
  const [newAd, setNewAd] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    const adList = await getAds();
    setAds(adList);
  };

  const handleCreateAd = async () => {
    await createAd(newAd);
    setNewAd({ title: '', description: '' });
    fetchAds();
  };

  const handleUpdateAd = async (id, updatedAd) => {
    await updateAd(id, updatedAd);
    fetchAds();
  };

  const handleDeleteAd = async (id) => {
    await deleteAd(id);
    fetchAds();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ad Management</Text>
      <TextInput
        style={styles.input}
        value={newAd.title}
        onChangeText={(text) => setNewAd({ ...newAd, title: text })}
        placeholder="Ad Title"
      />
      <TextInput
        style={styles.input}
        value={newAd.description}
        onChangeText={(text) => setNewAd({ ...newAd, description: text })}
        placeholder="Ad Description"
      />
      <Button title="Create Ad" onPress={handleCreateAd} />
      <FlatList
        data={ads}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.adItem}>
            <Text>{item.title}</Text>
            <Button title="Update" onPress={() => handleUpdateAd(item.id, { ...item, title: 'Updated Title' })} />
            <Button title="Delete" onPress={() => handleDeleteAd(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 },
  adItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
});

export default AdManagementScreen;