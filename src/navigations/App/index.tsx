import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import { HomeStackParamList } from '@types/navigations';
import MPINSetupScreen from '@screens/App/MPIN';
import MpinForgetPassword from '@screens/App/MpinForgetPassword';
import { HOME } from '@utils/constant';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={HOME.MPIN} component={MPINSetupScreen} />
      <Stack.Screen
        name={HOME.MpinForgetPassword}
        component={MpinForgetPassword}
      />
      <Stack.Screen name={HOME.HomeTabs} component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
