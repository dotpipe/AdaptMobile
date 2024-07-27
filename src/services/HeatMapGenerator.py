import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from collections import defaultdict

class HeatMapGenerator:
    def __init__(self, store_width, store_length, grid_size=2.5):
        self.grid_width = int(store_width / grid_size)
        self.grid_length = int(store_length / grid_size)
        self.heat_map = np.zeros((self.grid_width, self.grid_length, 24))  # 24 hours
        self.price_map = np.zeros((self.grid_width, self.grid_length))
        self.movement_data = defaultdict(list)

    def record_movement(self, customer_id, x, y, hour, price):
        self.movement_data[customer_id].append((x, y, hour))
        self.price_map[int(x), int(y)] = price

    def generate_heat_map(self):
        for movements in self.movement_data.values():
            for i in range(len(movements) - 1):
                start, end = movements[i], movements[i + 1]
                self._add_movement_to_heat_map(start, end)

    def _add_movement_to_heat_map(self, start, end):
        x1, y1, h1 = start
        x2, y2, h2 = end
        dx = abs(x2 - x1)
        dy = abs(y2 - y1)
        sx = 1 if x1 < x2 else -1
        sy = 1 if y1 < y2 else -1
        err = dx - dy

        while True:
            self.heat_map[int(x1), int(y1), int(h1)] += 1
            if int(x1) == int(x2) and int(y1) == int(y2):
                break
            e2 = 2 * err
            if e2 > -dy:
                err -= dy
                x1 += sx
            if e2 < dx:
                err += dx
                y1 += sy

    def visualize_heat_map_3d(self):
        fig = plt.figure(figsize=(12, 8))
        ax = fig.add_subplot(111, projection='3d')

        x = np.arange(self.grid_width)
        y = np.arange(self.grid_length)
        X, Y = np.meshgrid(x, y)

        visits = np.sum(self.heat_map, axis=2)
        prices = self.price_map

        surf = ax.plot_surface(X, Y, visits, cmap='hot', alpha=0.8)
        price_points = ax.scatter(X, Y, visits, c=prices, cmap='viridis', s=20)

        ax.set_xlabel('Store Width')
        ax.set_ylabel('Store Length')
        ax.set_zlabel('Visit Frequency')
        ax.set_title('3D Store Traffic Heat Map with Price Levels')

        fig.colorbar(surf, label='Traffic Intensity', shrink=0.5, aspect=5)
        fig.colorbar(price_points, label='Price Level', shrink=0.5, aspect=5)

        plt.show()

    def get_high_traffic_lanes(self, threshold=0.75):
        total_visits = np.sum(self.heat_map, axis=2)
        return np.where(total_visits > np.quantile(total_visits, threshold))

    def get_common_routes(self):
        routes = defaultdict(int)
        for movements in self.movement_data.values():
            routes[tuple(movements)] += 1
        return sorted(routes.items(), key=lambda x: x[1], reverse=True)