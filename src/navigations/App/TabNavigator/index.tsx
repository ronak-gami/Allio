import React from 'react';
import { Platform, Image, ImageSourcePropType } from 'react-native';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { IMAGES } from '@assets/index';
import { height, width } from '@utils/helper';
import { HOME } from '@utils/constant';
import HomeScreen from '@screens/App/Home';
import PhotoMedia from '@screens/App/PhotoMedia';
import ScanQR from '@screens/App/ScanQR';
import VideoMedia from '@screens/App/VideoMedia';
import More from '@screens/App/More';
import useStyle from './style';
import { useTheme } from '@react-navigation/native';
import { TabParamList } from '@types/navigations';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  const styles = useStyle();
  const { colors } = useTheme();
  const icons: Record<keyof TabParamList, ImageSourcePropType> = {
    Home: IMAGES.Home,
    Photo: IMAGES.ImageMedia,
    ScanQR: IMAGES.ScanQR,
    Video: IMAGES.VideoMedia,
    More: IMAGES.More,
  };

  const getIconByRouteName = (name: keyof TabParamList): ImageSourcePropType =>
    icons[name];

  const screenOptions = ({
    route,
  }: {
    route: { name: keyof TabParamList };
  }): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarHideOnKeyboard: true,
    tabBarShowLabel: false,
    tabBarStyle: {
      height: Platform.OS === 'ios' ? height * 0.09 : height * 0.07,
      backgroundColor: colors.primary,
    },
    tabBarItemStyle: {
      alignItems: 'center',
      paddingVertical: width * 0.013,
    },
    tabBarIcon: ({ focused }) => (
      <Image
        source={getIconByRouteName(route.name)}
        style={[
          styles.tabIcon,
          {
            tintColor: focused ? colors.white : colors.black,
            alignSelf: 'center',
          },
        ]}
        resizeMode="contain"
      />
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
