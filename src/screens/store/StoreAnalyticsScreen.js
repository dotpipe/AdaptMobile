// src/screens/StoreAnalyticsScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { HeatMapGenerator } from '../services/HeatMapGenerator';
import { StoreService } from '../services/StoreService';

const StoreAnalyticsScreen = ({ route }) => {
  const { storeId } = route.params;
  const [heatmapHtml, setHeatmapHtml] = useState('');

  useEffect(() => {
    const fetchHeatmapData = async () => {
      const storeData = await StoreService.getStoreData(storeId);
      const heatMapGenerator = new HeatMapGenerator(storeData.width, storeData.length);
      await heatMapGenerator.fetchStoreData(storeId);
      heatMapGenerator.generate_heat_map();
      const html = heatMapGenerator.get_3d_heatmap_html();
      setHeatmapHtml(html);
    };

    fetchHeatmapData();
  }, [storeId]);

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: heatmapHtml }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default StoreAnalyticsScreen;