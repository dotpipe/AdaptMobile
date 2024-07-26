// src/navigation/CustomerNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/customer/HomeScreen';
import DealsScreen from '../screens/customer/DealsScreen';
import StoresScreen from '../screens/customer/StoresScreen';

const Tab = createBottomTabNavigator();

export default function CustomerNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Deals" component={DealsScreen} />
      <Tab.Screen name="Stores" component={StoresScreen} />
    </Tab.Navigator>
  );
}