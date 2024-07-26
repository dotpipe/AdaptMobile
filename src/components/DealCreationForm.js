// src/components/DealCreationForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { DealManager } from '../services/DealManager';

const DealCreationForm = ({ storeId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const dealManager = new DealManager();

  const handleSubmit = async () => {
    const dealData = { title, description, expiryDate, storeId };
    await dealManager.create_deal(storeId, dealData);
    // Reset form or navigate away
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Deal Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Date (YYYY-MM-DD)"
        value={expiryDate}
        onChangeText={setExpiryDate}
      />
      <Button title="Create Deal" onPress={handleSubmit} />
    </View>
  );
};