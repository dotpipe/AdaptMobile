// mobile/AdaptMobile/AdaptMobile/src/navigation/AppNavigator.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import AdDetailScreen from '../screens/AdDetailScreen';
import CartScreen from '../screens/CartScreen';
import { CartManager } from '../services/CartManager';

const Stack = createStackNavigator();
const cartManager = new CartManager();

const CartIcon = ({ navigation }) => {
  const cartItemCount = cartManager.getCartItemCount();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="shopping-cart" size={24} color="#000" />
        <Text style={{ marginLeft: 5 }}>{cartItemCount}</Text>
      </View>
    </TouchableOpacity>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({
            headerRight: () => <CartIcon navigation={navigation} />
          })}
        />
        <Stack.Screen 
          name="AdDetail" 
          component={AdDetailScreen} 
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;