import React from 'react';
import {
  Platform,
  StyleSheet,
  Image,
  Text,
  ImageSourcePropType,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import PhotoMedia from '../screens/PhotoMedia';
import ScanQR from '../screens/ScanQR';
import VideoMedia from '../screens/VideoMedia';
import MoreScreens from '../screens/More';
import { IMAGES } from '../assets';
import { height } from '../utils/helper';
import { COLORS } from '../utils/color';
import { scale } from 'react-native-size-matters';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { HOME } from '../utils/constant';

export type BottomTabParamList = {
  Home: undefined;
  Photo: undefined;
  ScanQR: undefined;
  Video: undefined;
  More: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigator: React.FC = () => {
  const icons: Record<keyof BottomTabParamList, ImageSourcePropType> = {
    Home: IMAGES.Home,
    Photo: IMAGES.ImageMedia,
    ScanQR: IMAGES.ScanQR,
    Video: IMAGES.VideoMedia,
    More: IMAGES.More,
  };

  const getIconByRouteName = (
    name: keyof BottomTabParamList,
  ): ImageSourcePropType => {
    return icons[name];
  };

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
      <Tab.Screen name={HOME.More} component={MoreScreens} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  tabIcon: {
    height: height * 0.03,
    width: height * 0.03,
    marginTop: 10,
  },
  tabLabel: {
    fontSize: scale(12),
    marginTop: 5,
  },
});
