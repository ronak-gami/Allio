import { IMAGES } from '@assets/index';

interface OnboardingItem {
  id: string;
  image: any;
  title: string;
  description: string;
}

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
  Home: 'Home' as const,
  Photo: 'Photo' as const,
  ScanQR: 'ScanQR' as const,
  Video: 'Video' as const,
  More: 'More' as const,
  MPIN: 'MPIN' as const,
  ForgotPassword: 'ForgotPassword' as const,
} as const;

export { onboardingData, AUTH, HOME };
