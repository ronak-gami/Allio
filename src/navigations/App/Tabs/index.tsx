import React from 'react';
import { Platform, Image, Text, ImageSourcePropType } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { IMAGES } from '@assets/index';
import { height } from '@utils/helper';
import { COLORS } from '@utils/color';
import { HOME } from '@utils/constant';

import HomeScreen from '@screens/App/Home';
import PhotoMedia from '@screens/App/PhotoMedia';
import ScanQR from '@screens/App/ScanQR';
import VideoMedia from '@screens/App/VideoMedia';
import More from '@screens/App/More';

import useStyle from './style';

export type BottomTabParamList = {
  Home: undefined;
  Photo: undefined;
  ScanQR: undefined;
  Video: undefined;
  More: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigator: React.FC = () => {
  const styles = useStyle();

  const icons: Record<keyof BottomTabParamList, ImageSourcePropType> = {
    Home: IMAGES.Home,
    Photo: IMAGES.ImageMedia,
    ScanQR: IMAGES.ScanQR,
    Video: IMAGES.VideoMedia,
    More: IMAGES.More,
  };

  const getIconByRouteName = (
    name: keyof BottomTabParamList,
  ): ImageSourcePropType => icons[name];

  const screenOptions = ({
    route,
  }: {
    route: { name: keyof BottomTabParamList };
  }): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarHideOnKeyboard: true,
    tabBarStyle: {
      height: Platform.OS === 'ios' ? height * 0.1 : height * 0.075,
      backgroundColor: COLORS.primary,
    },
    tabBarIcon: ({ focused }) => (
      <Image
        source={getIconByRouteName(route.name)}
        style={[
          styles.tabIcon,
          { tintColor: focused ? COLORS.black : COLORS.lightgray },
        ]}
        resizeMode="contain"
      />
    ),
    tabBarLabel: ({ focused }) => (
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? COLORS.black : COLORS.lightgray },
        ]}>
        {route.name}
      </Text>
    ),
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name={HOME.Home} component={HomeScreen} />
      <Tab.Screen name={HOME.Photo} component={PhotoMedia} />
      <Tab.Screen name={HOME.ScanQR} component={ScanQR} />
      <Tab.Screen name={HOME.Video} component={VideoMedia} />
      <Tab.Screen name={HOME.More} component={More} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
