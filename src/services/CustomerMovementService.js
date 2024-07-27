// src/services/CustomerMovementService.js
import BackgroundService from 'react-native-background-actions';
import { StoreService } from './StoreService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

const uploadMovementData = async (taskData) => {
    await sleep(15 * 60 * 1000); // Wait for 15 minutes
    const { customerId, storeId } = taskData;
    const movementData = await AsyncStorage.getItem(`movement_${customerId}_${storeId}`);
    if (movementData) {
        await StoreService.uploadMovementData(storeId, JSON.parse(movementData));
        await AsyncStorage.removeItem(`movement_${customerId}_${storeId}`);
    }
};

export const CustomerMovementService = {
    recordMovement: async (customerId, storeId, x, y, timestamp) => {
        const key = `movement_${customerId}_${storeId}`;
        const existingData = await AsyncStorage.getItem(key);
        const movements = existingData ? JSON.parse(existingData) : [];
        movements.push({ x, y, timestamp });
        await AsyncStorage.setItem(key, JSON.stringify(movements));
    },

    startUploadTask: async (customerId, storeId) => {
        const options = {
            taskName: 'UploadMovementData',
            taskTitle: 'Uploading Movement Data',
            taskDesc: 'Uploading customer movement data to the server',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            parameters: {
                customerId,
                storeId,
            },
        };
        await BackgroundService.start(uploadMovementData, options);
    },

    stopUploadTask: async () => {
        await BackgroundService.stop();
    },
};