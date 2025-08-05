import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HomeHeader from '@components/organisms/HomeHeader';
import AboutDetails from '@components/organisms/AboutDetails';
import ImageSlider from '@components/organisms/ImageSlider';
import { IMAGES } from '@assets/index';
import { FeaturesCarousel } from '@components/organisms/FeaturesCorozal';
import { FeaturesDataItem } from '@utils/constant';
import ContactUsSection from '@components/organisms/ContactUs';
import { useTheme } from '@react-navigation/native';
import { HOME } from '@utils/constant';
import { HomeTabsNavigationProp } from '@types/navigations';
import useStyle from './style';

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
      <View style={styles.container}>
        <HomeHeader onProfilePress={handleProfilePress} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <AboutDetails />
          <ImageSlider images={promoImages} />
          <FeaturesCarousel
            data={FeaturesDataItem}
            onPress={handleFeaturePress}
          />
          <ContactUsSection />
        </ScrollView>
      </View>
    </>
  );
};

export default HomeScreen;
