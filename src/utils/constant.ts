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

const BASE_URL = 'https://842b8dc4546c.ngrok-free.app/api';

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
};

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
  AiAssistant: 'AiAssistant',
  LocationScreen: 'LocationScreen',
  UpdateProfile: 'UpdateProfile',
};

const LICENSE_KEY =
  'z_9lMDUqcUwlNkjjU52ZLFQbwBvxJ60uSd_ouvwBDRCKtmK5fbZAtHFd3889zr9v';

const WORD_COUNT_THRESHOLD = 20;

const FeaturesDataItem = [
  {
    image: IMAGES.Notification,
    title: 'features.scanQR.title',
    description: 'features.scanQR.description',
    buttonText: 'features.scanQR.button',
  },
  {
    image: IMAGES.Notification,
    title: 'features.videoEditing.title',
    description: 'features.videoEditing.description',
    buttonText: 'features.videoEditing.button',
  },
  {
    image: IMAGES.Notification,
    title: 'features.photoEditing.title',
    description: 'features.photoEditing.description',
    buttonText: 'features.photoEditing.button',
  },
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
  WORD_COUNT_THRESHOLD,
};
