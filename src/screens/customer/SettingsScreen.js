// src/screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { getSettings, updateSettings } from '../services/api';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const userSettings = await getSettings();
    setSettings(userSettings);
  };

  const handleToggle = async (key) => {
    const updatedSettings = { ...settings, [key]: !settings[key] };
    setSettings(updatedSettings);
    await updateSettings(updatedSettings);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.setting}>
        <Text>Push Notifications</Text>
        <Switch value={settings.pushNotifications} onValueChange={() => handleToggle('pushNotifications')} />
      </View>
      <View style={styles.setting}>
        <Text>Location Services</Text>
        <Switch value={settings.locationServices} onValueChange={() => handleToggle('locationServices')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  setting: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
});

export default SettingsScreen;