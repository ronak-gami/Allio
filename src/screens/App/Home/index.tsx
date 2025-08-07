import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AboutDetails from '@components/organisms/AboutDetails';
import ImageSlider from '@components/organisms/ImageSlider';
import { IMAGES } from '@assets/index';
import { FeaturesCarousel } from '@components/organisms/FeaturesCorozal';
import { FeaturesDataItem } from '@utils/constant';
import { useTheme } from '@react-navigation/native';
import { HOME } from '@utils/constant';
import { HomeTabsNavigationProp } from '@types/navigations';
import Container from '@components/molecules/Container';
import useStyle from './style';
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
  const colors = useTheme().colors;
  const styles = useStyle();
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
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.primary}
        translucent={false}
      />

      {/* if user do not need header so pass only showHeader={false} */}
      <Container
        showHeader
        onProfilePress={handleProfilePress}
        useScrollView
        keyboardAvoiding>
        <AboutDetails />
        <ImageSlider images={promoImages} />
        <FeaturesCarousel
          data={FeaturesDataItem}
          onPress={handleFeaturePress}
        />
        <ContactUsSection />
      </Container>
    </>
  );
};

export default HomeScreen;
