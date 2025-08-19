import { IMAGES } from '@assets/index';

import { width } from '@utils/helper';
interface OnboardingItem {
  id: string;
  image: any;
  title: string;
  description: string;
}
const WEB_CLIENT_ID =
  '299086233123-40u7rfe1tdb4q5m7341rtdqo5qabf7eu.apps.googleusercontent.com';

const CARD_WIDTH = width * 0.94;
const SPACING = (width - CARD_WIDTH) / 0.6;

const BASE_URL = 'https://7b74655f430e.ngrok-free.app/api' as const;

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    image: IMAGES.First,
    title: 'Smart Tools, One App',
    description:
      'From QR scanning to social login, access all smart tools in one place.',
  },
  {
    id: '2',
    image: IMAGES.SecondOnboarding,
    title: 'Secure & Private',
    description:
      'Biometrics, PIN lock, and encrypted messaging for ultimate security.',
  },
  {
    id: '3',
    image: IMAGES.OnboardingThree,
    title: 'Smarter Media',
    description:
      'Capture, edit, and share videos or photos with advanced tools.',
  },
  {
    id: '4',
    image: IMAGES.First,
    title: 'Real-Time & Background Features',
    description:
      'Enable push notifications, background tasks, and live tracking.',
  },
  {
    id: '5',
    image: IMAGES.SecondOnboarding,
    title: 'Multi-language + Voice Assistant',
    description:
      'Speak to control, read text aloud, and use your app in any language.',
  },
];

const AUTH = {
  Splash: 'Splash',
  Onboarding: 'Onboarding',
  Login: 'Login',
  Register: 'Register',
  ForgotPassword: 'ForgotPassword',
} as const;

const HOME = {
  HomeTabs: 'HomeTabs',
  Home: 'Home',
  Photo: 'Photo',
  ScanQR: 'ScanQR',
  Video: 'Video',
  More: 'More',
  MPIN: 'MPIN',
  ForgetMPIN: 'ForgetMPIN',
  Profile: 'Profile',
  MyQR: 'MyQR',
  MyFriends: 'MyFriends',
  ChatDetailsScreen: 'ChatDetailsScreen',
  LocationPicker: 'LocationPicker',
} as const;

const LICENSE_KEY =
  'z_9lMDUqcUwlNkjjU52ZLFQbwBvxJ60uSd_ouvwBDRCKtmK5fbZAtHFd3889zr9v';

const FeaturesDataItem = [
  {
    image: IMAGES.Notification,
    title: ' ScanQR',
    description: 'Scan documents quickly and save them securely.',
    buttonText: 'ScanQR',
  },
  {
    image: IMAGES.Notification,
    title: 'Video Editing',
    description: 'Stay updated with instant alerts and reminders.',
    buttonText: 'Video Editing',
  },
  {
    image: IMAGES.Notification,
    title: 'Photo Editing',
    description: 'Scan QR codes and barcodes with ease.',
    buttonText: 'Photo Editing',
  },

  {
    image: IMAGES.Scanner,
    title: 'Home',
    description: 'Fast and reliable scanning for all your needs.',
    buttonText: 'Home',
  },
];

const settingsData = [
  { key: 'profile', title: 'Profile' },
  { key: 'friends', title: 'My Friends' },
  { key: 'theme', title: 'Theme' },
  { key: 'language', title: 'Language' },
  { key: 'delete', title: 'Delete Account' },
  { key: 'logout', title: 'Logout' },
];
export {
  WEB_CLIENT_ID,
  BASE_URL,
  onboardingData,
  AUTH,
  HOME,
  LICENSE_KEY,
  CARD_WIDTH,
  SPACING,
  FeaturesDataItem,
  settingsData,
};
