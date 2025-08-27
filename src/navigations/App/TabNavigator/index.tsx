import React from 'react';
import { Platform, Image, ImageSourcePropType } from 'react-native';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { ICONS } from '@assets/index';
import { height, width } from '@utils/helper';
import { HOME } from '@utils/constant';
import HomeScreen from '@screens/App/Home';
import ScanQR from '@screens/App/ScanQR';
import VideoMedia from '@screens/App/VideoMedia';
import More from '@screens/App/More';
import useStyle from './style';
import { useTheme } from '@react-navigation/native';
import { TabParamList } from '@types/navigations';
import GlobalBottomSheet from '@components/atoms/GlobalBottomSheet';
import MyFriends from '@screens/App/MyFriends';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  const styles = useStyle();
  const { colors } = useTheme();

  const icons: Record<keyof TabParamList, ImageSourcePropType> = {
    Home: ICONS.Home,
    MyFriends: ICONS.Chat,
    ScanQR: ICONS.ScanQR,
    Video: ICONS.Social,
    More: ICONS.More,
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
    <GlobalBottomSheet>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name={HOME.Home} component={HomeScreen} />
        <Tab.Screen name={HOME.MyFriends} component={MyFriends} />
        <Tab.Screen name={HOME.ScanQR} component={ScanQR} />
        <Tab.Screen name={HOME.Video} component={VideoMedia} />
        <Tab.Screen name={HOME.More} component={More} />
      </Tab.Navigator>
    </GlobalBottomSheet>
  );
};

export default TabNavigator;
