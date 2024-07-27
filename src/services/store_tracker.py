import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from collections import defaultdict
from typing import List, Tuple, Dict
from geopy import distance

class StoreTracker:
    def __init__(self, store_id: str, door_locations: List[Tuple[float, float]], grid_size_feet: float = 2.5):
        self.store_id = store_id
        self.door_locations = door_locations
        self.grid_size_feet = grid_size_feet
        self.grid = np.zeros((1, 1))
        self.customers: Dict[str, Tuple[float, float]] = {}
        self.heatmap = np.zeros((1, 1))

    def update_customer_location(self, customer_id: str, lat: float, lon: float) -> None:
        if customer_id not in self.customers:
            if self._is_entering_store(lat, lon):
                self.customers[customer_id] = (lat, lon)
                self._update_grid(lat, lon)
        else:
            self.customers[customer_id] = (lat, lon)
            self._update_heatmap(lat, lon)

    def _is_entering_store(self, lat: float, lon: float) -> bool:
        return any(distance.distance((lat, lon), door).feet < 5 for door in self.door_locations)

    def _update_grid(self, lat: float, lon: float) -> None:
        if self.grid.size == 1:
            self.grid = np.zeros((1, 1))
            self.heatmap = np.zeros((1, 1))
        
        x, y = self._gps_to_grid(lat, lon)
        if x >= self.grid.shape[1] or y >= self.grid.shape[0]:
            new_shape = (max(y+1, self.grid.shape[0]), max(x+1, self.grid.shape[1]))
            self.grid = np.pad(self.grid, ((0, new_shape[0] - self.grid.shape[0]), (0, new_shape[1] - self.grid.shape[1])))
            self.heatmap = np.pad(self.heatmap, ((0, new_shape[0] - self.heatmap.shape[0]), (0, new_shape[1] - self.heatmap.shape[1])))

    def _update_heatmap(self, lat: float, lon: float) -> None:
        x, y = self._gps_to_grid(lat, lon)
        if 0 <= x < self.heatmap.shape[1] and 0 <= y < self.heatmap.shape[0]:
            self.heatmap[y, x] += 1

    def _gps_to_grid(self, lat: float, lon: float) -> Tuple[int, int]:
        ref_lat, ref_lon = self.door_locations[0]
        y = int(distance.distance((ref_lat, ref_lon), (lat, ref_lon)).feet / self.grid_size_feet)
        x = int(distance.distance((ref_lat, ref_lon), (ref_lat, lon)).feet / self.grid_size_feet)
        return x, y

    def get_heatmap(self) -> np.ndarray:
        return self.heatmap

class HeatMapGenerator:
    def __init__(self, store_width, store_length, grid_size=2.5):
        self.grid_width = int(store_width / grid_size)
        self.grid_length = int(store_length / grid_size)
        self.heat_map = np.zeros((self.grid_width, self.grid_length))
        self.movement_data = defaultdict(list)
        self.store_tracker = StoreTracker("store_123", [(0, 0)], grid_size)

    def record_movement(self, customer_id, x, y):
        self.movement_data[customer_id].append((x, y))
        lat, lon = self._grid_to_gps(x, y)
        self.store_tracker.update_customer_location(customer_id, lat, lon)

    def _grid_to_gps(self, x: int, y: int) -> Tuple[float, float]:
        # This is a placeholder conversion. In a real scenario, you'd use actual GPS coordinates.
        return (y * 0.00001, x * 0.00001)

    def generate_heat_map(self):
        self.heat_map = self.store_tracker.get_heatmap()

    def visualize_heat_map(self):
        plt.figure(figsize=(12, 8))
        custom_cmap = LinearSegmentedColormap.from_list("custom", ["#FFFFFF", "#0000FF", "#FF0000"])
        plt.imshow(self.heat_map.T, cmap=custom_cmap, interpolation='nearest', alpha=0.8)
        plt.colorbar(label='Traffic Intensity')
        plt.title('Store Traffic Heat Map')
        plt.xlabel('Store Width')
        plt.ylabel('Store Length')
        plt.show()

    def get_high_traffic_lanes(self, threshold=0.75):
        return np.where(self.heat_map > np.quantile(self.heat_map, threshold))

    def get_common_routes(self):
        routes = defaultdict(int)
        for movements in self.movement_data.values():
            routes[tuple(movements)] += 1
        return sorted(routes.items(), key=lambda x: x[1], reverse=True)

