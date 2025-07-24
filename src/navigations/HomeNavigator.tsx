import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './TabNavigator';
const Stack = createNativeStackNavigator();
const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Tabs} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
