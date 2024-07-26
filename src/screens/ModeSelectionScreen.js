// ModeSelectionScreen.js
import React from 'react';
import { View, Button } from 'react-native';

export default function ModeSelectionScreen({ setMode }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Shopper Mode" onPress={() => setMode('shopper')} />
      <Button title="Store Mode" onPress={() => setMode('store')} />
    </View>
  );
}