import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import { requestUserPermission, getFCMToken, notificationListener } from './services/notifications';
import { startGeofenceMonitoring } from './services/geofenceService';
import LoginScreen from './screens/LoginScreen';
import CustomerNavigator from './navigation/CustomerNavigator';
import StoreNavigator from './navigation/StoreNavigator';
import ModeSelectionScreen from './screens/ModeSelectionScreen';
import { SyncManager } from './services/sync_manager';
import { AdManager } from './services/ad_manager';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState(null);
  const [currentAds, setCurrentAds] = useState([]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(setUser);
    requestUserPermission();
    getFCMToken();
    notificationListener();
    if (user && mode === 'customer') {
      startGeofenceMonitoring(user.uid);
    }

    const initializeManagers = async () => {
      const syncManager = new SyncManager();
      syncManager.startSyncLoop();

      const adManager = new AdManager();
      const ads = await adManager.getCurrentAds();
      setCurrentAds(ads);
    };

    initializeManagers();

    return subscriber;
  }, [user, mode]);

  if (!user) {
    return <LoginScreen />;
  }

  if (!mode) {
    return <ModeSelectionScreen setMode={setMode} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        {mode === 'customer' ? (
          <Stack.Screen 
            name="CustomerMode" 
            component={CustomerNavigator} 
            initialParams={{ currentAds }}
          />
        ) : (
          <Stack.Screen name="StoreMode" component={StoreNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}