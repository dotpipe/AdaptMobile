import numpy as np
import matplotlib.pyplot as plt
from collections import defaultdict

class HeatMapGenerator:
    def __init__(self, store_width, store_length, grid_size=2.5):
        self.grid_width = int(store_width / grid_size)
        self.grid_length = int(store_length / grid_size)
        self.heat_map = np.zeros((self.grid_width, self.grid_length))
        self.movement_data = defaultdict(list)

    def record_movement(self, customer_id, x, y):
        self.movement_data[customer_id].append((x, y))

    def generate_heat_map(self):
        for movements in self.movement_data.values():
            for i in range(len(movements) - 1):
                start, end = movements[i], movements[i + 1]
                self._add_movement_to_heat_map(start, end)

    def _add_movement_to_heat_map(self, start, end):
        x1, y1 = start
        x2, y2 = end
        dx = abs(x2 - x1)
        dy = abs(y2 - y1)
        sx = 1 if x1 < x2 else -1
        sy = 1 if y1 < y2 else -1
        err = dx - dy

        while True:
            self.heat_map[int(x1), int(y1)] += 1
            if int(x1) == int(x2) and int(y1) == int(y2):
                break
            e2 = 2 * err
            if e2 > -dy:
                err -= dy
                x1 += sx
            if e2 < dx:
                err += dx
                y1 += sy

    def visualize_heat_map(self):
        plt.imshow(self.heat_map.T, cmap='hot', interpolation='nearest')
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
