// src/components/TrafficAnalytics.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { fetchTrafficData } from '../services/api';

const TrafficAnalytics = ({ storeId }) => {
  const [trafficData, setTrafficData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTrafficData(storeId);
      setTrafficData(data);
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [storeId]);

  const chartData = {
    labels: trafficData.map(data => data.time),
    datasets: [
      {
        data: trafficData.map(data => data.count),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      }
    ]
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Traffic Analytics</Text>
      <LineChart
        data={chartData}
        width={350}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default TrafficAnalytics;