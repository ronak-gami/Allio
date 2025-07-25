import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './TabNavigator';
import { HomeStackParamList } from '@types/navigations';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={Tabs} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
