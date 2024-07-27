// StoreManagerNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import DashboardScreen from '../screens/DashboardScreen';
import HeatmapScreen from '../screens/HeatmapScreen';
import InventoryScreen from '../screens/InventoryScreen';
import SalesReportScreen from '../screens/SalesReportScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Tab = createBottomTabNavigator();

export default function StoreManagerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Heatmap') {
            iconName = 'map';
          } else if (route.name === 'Inventory') {
            iconName = 'inventory';
          } else if (route.name === 'Sales') {
            iconName = 'bar-chart';
          } else if (route.name === 'Notifications') {
            iconName = 'notifications';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Heatmap" component={HeatmapScreen} />
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      <Tab.Screen name="Sales" component={SalesReportScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}