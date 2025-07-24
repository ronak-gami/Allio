import { IMAGES } from '../assets/index';

export const onboardingData = [
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

export const AUTH = {
  Splash: 'Splash',
  Onboarding: 'Onboarding',
  Login: 'Login',
  Register: 'Register',
  ForgotPassword: 'Forgot Password',
  ResetPassword: 'Reset Password',
};

export const HOME = {
  Home: 'Home',
  Photo: 'Photo',
  ScanQR: 'ScanQR',
  Video: 'Video',
  More: 'More',
};
