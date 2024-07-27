import axios from 'axios';

const API_BASE_URL = 'https://api.adaptation.com';

export const uploadCSV = async (userId, storeId, csvData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/heatmap`, {
      userId,
      storeId,
      csvData
    });
    console.log('Heatmap data uploaded successfully');
    return response.data;
  } catch (error) {
    console.error('Error uploading heatmap data:', error);
  }
};

export const getAggregatedHeatmap = async (storeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/heatmap/${storeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching aggregated heatmap:', error);
  }
};