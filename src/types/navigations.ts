import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';

export type RootStackParamList = {
  AuthNavigator: undefined;
  HomeNavigator: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  MPIN: undefined;
  ForgetMPIN: undefined;
  MyQR: undefined;
  ChatDetailsScreen: undefined;
  HomeTabs: NavigatorScreenParams<TabParamList> | undefined;
  Profile: { email?: string };
  AiAssistant: undefined;
  LocationScreen: {
    location?: { lat: number; lng: number };
    liveShareId?: string;
  };
  UpdateProfile: {
    email?: string;
  };
};

export type TabParamList = {
  MyFriends: undefined;
  Home: undefined;
  ScanQR: undefined;
  Video: undefined;
  More: undefined;
};

// Navigation prop types for different navigators
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

// Composite navigation types for nested navigators
export type HomeTabsNavigationProp = CompositeNavigationProp<
  TabNavigationProp,
  HomeNavigationProp
>;

export type AuthToRootNavigationProp = CompositeNavigationProp<
  AuthNavigationProp,
  RootNavigationProp
>;
