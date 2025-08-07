import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeStackParamList } from '@types/navigations';
import MPINSetupScreen from '@screens/App/MPIN';
import ForgetMPIN from '@screens/App/ForgetMPIN';
import { HOME } from '@utils/constant';
import StatusBar from '@components/atoms/CustomStatusBar';

import TabNavigator from './TabNavigator';
import { COLORS } from '@utils/color';
import MyQR from '@screens/App/MyOR';
import MyFriends from '@screens/App/MyFriends';
const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
  return (
    <>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={HOME.MPIN} component={MPINSetupScreen} />
        <Stack.Screen name={HOME.ForgetMPIN} component={ForgetMPIN} />
        <Stack.Screen name={HOME.MyQR} component={MyQR} />
        <Stack.Screen name={HOME.MyFriends} component={MyFriends} />
        <Stack.Screen name={HOME.HomeTabs} component={TabNavigator} />
      </Stack.Navigator>
    </>
  );
};

export default HomeNavigator;
