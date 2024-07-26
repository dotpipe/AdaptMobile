// src/navigation/CustomerNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import DealsScreen from '../screens/DealsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdBannerComponent from '../components/AdBannerComponent';

const Tab = createBottomTabNavigator();

const CustomerNavigator = ({ route }) => {
  const { currentAds } = route.params;

  return (
    <>
      <AdBannerComponent ads={currentAds} />
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Deals" component={DealsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </>
  );
};

export default CustomerNavigator;