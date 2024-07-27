import { uploadCSV } from './apiService';

const gridSize = 20; // 20x20 grid for more detailed heatmap
let heatmapData = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
let entryTime = null;

export const initializeHeatmap = () => {
  heatmapData = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
  entryTime = new Date();
};

export const updateHeatmap = (latitude, longitude) => {
  const x = Math.floor((longitude - storeBounds.west) / (storeBounds.east - storeBounds.west) * gridSize);
  const y = Math.floor((latitude - storeBounds.south) / (storeBounds.north - storeBounds.south) * gridSize);

  if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
    heatmapData[y][x] += 1;
  }
};

export const generateHeatmapCSV = (userId, storeId) => {
  let csv = 'x,y,intensity\n';
  const maxIntensity = Math.max(...heatmapData.flat());
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const normalizedIntensity = heatmapData[y][x] / maxIntensity;
      csv += `${x},${y},${normalizedIntensity}\n`;
    }
  }

  uploadCSV(userId, storeId, csv);
};