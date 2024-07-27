import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { HeatmapGenerator } from '../services/heatmap_generator';

const { width, height } = Dimensions.get('window');

const HeatmapScreen = () => {
  const navigation = useNavigation();
  const [heatmapData, setHeatmapData] = useState(null);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      const generator = new HeatmapGenerator(50, 75);
      await generator.generateHeatMap();
      setHeatmapData(generator.getHeatmapData());
    };

    fetchHeatmapData();
  }, []);

  const renderHeatmap = () => {
    if (!heatmapData) return null;

    return heatmapData.map((row, y) => (
      <View key={y} style={styles.row}>
        {row.map((intensity, x) => (
          <View
            key={`${x}-${y}`}
            style={[
              styles.cell,
              { backgroundColor: `rgba(255, 0, 0, ${intensity})` },
            ]}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text h2>Store Heatmap</Text>
      <View style={styles.heatmapContainer}>{renderHeatmap()}</View>
      <Button
        title="Back to Dashboard"
        onPress={() => navigation.navigate('Dashboard')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  heatmapContainer: {
    width: width * 0.9,
    height: height * 0.6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: (width * 0.9) / 50,
    height: (height * 0.6) / 75,
  },
});

export default HeatmapScreen;