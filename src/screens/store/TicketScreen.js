// src/screens/TicketScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { getTicketInfo, completePickup } from '../services/api';

const TicketScreen = ({ route }) => {
  const { ticketHash } = route.params;
  const [ticketInfo, setTicketInfo] = useState(null);

  useEffect(() => {
    fetchTicketInfo();
  }, []);

  const fetchTicketInfo = async () => {
    const info = await getTicketInfo(ticketHash);
    setTicketInfo(info);
  };

  const handleCompletePickup = async () => {
    await completePickup(ticketHash);
    fetchTicketInfo();
  };

  if (!ticketInfo) {
    return <Text>Loading ticket information...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ticket Information</Text>
      <Text>Ticket Hash: {ticketInfo.hash}</Text>
      <Text>Store: {ticketInfo.store_name}</Text>
      <Text>Order ID: {ticketInfo.order_id}</Text>
      <Text>Pickup Time: {new Date(ticketInfo.pickup_time).toLocaleString()}</Text>
      <Text>Status: {ticketInfo.status}</Text>
      {ticketInfo.status === 'notified' && (
        <Button title="Complete Pickup" onPress={handleCompletePickup} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default TicketScreen;