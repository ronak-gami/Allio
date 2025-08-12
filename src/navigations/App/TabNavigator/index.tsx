import React, { useImperativeHandle, useRef } from 'react';
import { Platform, Image, ImageSourcePropType, Animated } from 'react-native';
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
import GlobalBottomSheet from '@components/atoms/GlobalBottomSheet';
import { useBottomSheet } from '../../../context/BottomSheetContext';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  const styles = useStyle();
  const { colors } = useTheme();
  // const { tabBarRef } = useBottomSheet();
  // const tabBarOpacity = useRef(new Animated.Value(1)).current;
  // const tabBarTranslateY = useRef(new Animated.Value(0)).current;

  // useImperativeHandle(ref, () => ({
  //   setTabBarVisible: visible => {
  //     Animated.parallel([
  //       Animated.timing(tabBarOpacity, {
  //         toValue: visible ? 1 : 0,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(tabBarTranslateY, {
  //         toValue: visible ? 0 : 100,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }),
  //     ]).start();
  //   },
  // }));

  // React.useEffect(() => {
  //   if (tabBarRef) {
  //     tabBarRef.current = ref?.current || {
  //       setTabBarVisible: () => {},
  //     };
  //   }
  // }, [tabBarRef, ref]);

  const icons: Record<keyof TabParamList, ImageSourcePropType> = {
    Home: IMAGES.Home,
    Photo: IMAGES.ImageMedia,
    ScanQR: IMAGES.ScanQR,
    Video: IMAGES.VideoMedia,
    More: IMAGES.Setting,
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
        <Tab.Screen name={HOME.Photo} component={PhotoMedia} />
        <Tab.Screen name={HOME.ScanQR} component={ScanQR} />
        <Tab.Screen name={HOME.Video} component={VideoMedia} />
        <Tab.Screen name={HOME.More} component={More} />
      </Tab.Navigator>
    </GlobalBottomSheet>
  );
};

export default TabNavigator;
