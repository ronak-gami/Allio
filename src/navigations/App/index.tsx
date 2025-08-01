import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeStackParamList } from '@types/navigations';
import MPINSetupScreen from '@screens/App/MPIN';
import ForgetMPIN from '@screens/App/ForgetMPIN';
import { HOME } from '@utils/constant';

import TabNavigator from './TabNavigator';
const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={HOME.MPIN} component={MPINSetupScreen} />
      <Stack.Screen name={HOME.ForgetMPIN} component={ForgetMPIN} />
      <Stack.Screen name={HOME.HomeTabs} component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
