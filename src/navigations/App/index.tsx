import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@types/navigations';
import MPINSetupScreen from '@screens/App/MPIN';
import ForgetMPIN from '@screens/App/ForgetMPIN';
import { HOME } from '@utils/constant';
import TabNavigator from './TabNavigator';
import { COLORS } from '@utils/color';
import MyQR from '@screens/App/MyOR';
import MyFriends from '@screens/App/MyFriends';
import Profile from '@screens/App/Profile';
import { CustomStatusBar } from '@components/index';
import ChatDetailsScreen from '@screens/App/ChatDetails';
import AiAssistant from '@screens/App/AiAssistant';
import UpdateProfile from '@screens/App/UpdateProfile';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
  return (
    <>
      <CustomStatusBar
        backgroundColor={COLORS.primary}
        barStyle="dark-content"
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={HOME.MPIN} component={MPINSetupScreen} />
        <Stack.Screen name={HOME.ForgetMPIN} component={ForgetMPIN} />
        <Stack.Screen name={HOME.MyQR} component={MyQR} />
        <Stack.Screen name={HOME.MyFriends} component={MyFriends} />
        <Stack.Screen
          name={HOME.ChatDetailsScreen}
          component={ChatDetailsScreen}
        />
        <Stack.Screen name={HOME.AiAssistant} component={AiAssistant} />
        <Stack.Screen name={HOME.Profile} component={Profile} />
        <Stack.Screen name={HOME.UpdateProfile} component={UpdateProfile} />
        <Stack.Screen name={HOME.HomeTabs} component={TabNavigator} />
      </Stack.Navigator>
    </>
  );
};

export default HomeNavigator;
