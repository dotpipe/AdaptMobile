// src/screens/AnalyticsDashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getAnalytics } from '../services/api';

const AnalyticsDashboardScreen = () => {
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const data = await getAnalytics();
    setAnalytics(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics Dashboard</Text>
      <Text>Total Views: {analytics.totalViews}</Text>
      <Text>Conversion Rate: {analytics.conversionRate}%</Text>
      <LineChart
        data={analytics.viewsOverTime}
        width={300}
        height={200}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default AnalyticsDashboardScreen;