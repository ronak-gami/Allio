import React from 'react';
import { useNavigation } from '@react-navigation/native';

import AboutDetails from '@components/organisms/AboutDetails';
import ImageSlider from '@components/organisms/ImageSlider';
import { IMAGES } from '@assets/index';
import { FeaturesCarousel } from '@components/organisms/FeaturesCorozal';
import { FeaturesDataItem } from '@utils/constant';
import { HOME } from '@utils/constant';
import { HomeTabsNavigationProp } from '@types/navigations';
import Container from '@components/molecules/Container';
import { ContactUsSection } from '@components/index';

const promoImages = [
  IMAGES.OnboardingThree,
  IMAGES.SecondOnboarding,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeTabsNavigationProp>();
  const handleProfilePress = () => {
    navigation.navigate(HOME.More);
  };
  const handleFeaturePress = (buttonText: string) => {
    switch (buttonText) {
      case 'ScanQR':
        navigation.navigate(HOME.ScanQR);
        break;
      case 'Video Editing':
        navigation.navigate(HOME.Video);
        break;
      case 'Photo Editing':
        navigation.navigate(HOME.Photo);
        break;
      case 'Home':
        navigation.navigate(HOME.Home);
        break;
      default:
        break;
    }
  };
  return (
    <Container
      onProfilePress={handleProfilePress}
      title="Home"
      showAppLogo
      showProfileLogo
      keyboardAvoiding>
      <AboutDetails />
      <ImageSlider images={promoImages} />
      <FeaturesCarousel data={FeaturesDataItem} onPress={handleFeaturePress} />
      <ContactUsSection />
    </Container>
  );
};

export default HomeScreen;
