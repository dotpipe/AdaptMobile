import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Input } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AdScheduler } from '../services/AdScheduler';

const AdvertiserDashboard = () => {
  const [adContent, setAdContent] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedHours, setSelectedHours] = useState([]);
  const [dailyBudget, setDailyBudget] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleHourSelection = (hour) => {
    if (selectedHours.includes(hour)) {
      setSelectedHours(selectedHours.filter(h => h !== hour));
    } else {
      setSelectedHours([...selectedHours, hour]);
    }
  };

  const handleScheduleAd = async () => {
    const scheduler = new AdScheduler();
    try {
      await scheduler.scheduleAd(adContent, startDate, endDate, selectedHours, parseFloat(dailyBudget), zipCode);
      alert('Ad scheduled successfully!');
    } catch (error) {
      alert('Failed to schedule ad: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Schedule New Ad</Text>
      <Input
        placeholder="Ad Content"
        value={adContent}
        onChangeText={setAdContent}
      />
      <Text>Start Date:</Text>
      <DateTimePicker
        value={startDate}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => setStartDate(selectedDate)}
      />
      <Text>End Date:</Text>
      <DateTimePicker
        value={endDate}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => setEndDate(selectedDate)}
      />
      <Text>Select Hours:</Text>
      <View style={styles.hoursContainer}>
        {[...Array(24).keys()].map(hour => (
          <TouchableOpacity
            key={hour}
            style={[styles.hourButton, selectedHours.includes(hour) && styles.selectedHour]}
            onPress={() => handleHourSelection(hour)}
          >
            <Text>{hour}:00</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Input
        placeholder="Daily Budget"
        value={dailyBudget}
        onChangeText={setDailyBudget}
        keyboardType="numeric"
      />
      <Input
        placeholder="Target Zip Code"
        value={zipCode}
        onChangeText={setZipCode}
        keyboardType="numeric"
      />
      <Button title="Schedule Ad" onPress={handleScheduleAd} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  hourButton: {
    width: '15%',
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  selectedHour: {
    backgroundColor: '#007AFF',
  },
});

export default AdvertiserDashboard;