// src/utils/notifications.js

import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

export const configureNotifications = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios'
  });
};

export const showNotification = (title, message, data = {}) => {
  PushNotification.localNotification({
    title: title,
    message: message,
    data: data,
    largeIcon: "ic_launcher",
    smallIcon: "ic_notification",
    channelId: "default-channel-id",
    playSound: true,
    soundName: "default",
    importance: "high",
    priority: "high",
  });
};

// Usage in App.js
import { configureNotifications } from './src/utils/notifications';

// In your App component
useEffect(() => {
  configureNotifications();
}, []);

// To show a notification
import { showNotification } from './src/utils/notifications';

showNotification("New Deal!", "Check out this amazing offer!");