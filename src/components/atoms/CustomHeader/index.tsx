import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import CustomLogo from '@components/molecules/HeaderLogo';
import CustomProfileButton from '@components/molecules/ProfileButton';
import { ICONS, IMAGES } from '@assets/index';
import useStyle from './style';

interface CustomHeaderProps {
  showBackArrow?: boolean;
  onBackPress?: () => void;
  showLogo?: boolean;
  logoProps?: any;
  title?: string;
  showProfile?: boolean;
  onProfilePress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  showBackArrow = false,
  onBackPress,
  showLogo = true,
  title,
  showProfile = true,
  onProfilePress,
}) => {
  const styles = useStyle();

  return (
    <View style={styles.headerContainer}>
      {/* Left: Back Arrow or Logo */}
      <View style={styles.leftContainer}>
        {showBackArrow ? (
          <TouchableOpacity onPress={onBackPress}>
            <Image
              source={ICONS.Left}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : showLogo ? (
          <CustomLogo logo={IMAGES.Allio_Logo} />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Center: Title */}
      <View style={styles.centerContainer}>
        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>

      {/* Right: Profile Icon */}
      <View style={styles.rightContainer}>
        {showProfile ? (
          <CustomProfileButton onPress={onProfilePress ?? (() => {})} />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

export default CustomHeader;

// With back arrow and title:
// <CustomHeader showBackArrow onBackPress={() => navigation.goBack()} title="Home" showProfile onProfilePress={...} />

// Without back arrow and title:
// <CustomHeader showLogo logoProps={{ logo: IMAGES.Allio_Logo }} showProfile onProfilePress={...} />

{
  /* <CustomHeader title="Dashboard" /> */
}
