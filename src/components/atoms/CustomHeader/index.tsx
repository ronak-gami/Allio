import React, { memo } from 'react';

import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Text from '../Text';
import CustomLogo from '@components/molecules/HeaderLogo';
import CustomProfileButton from '@components/molecules/ProfileButton';
import { ICONS } from '@assets/index';

import type { HomeTabsNavigationProp } from '@navigation/types';
import useStyle from './style';

interface CustomHeaderProps {
  showBackArrow?: boolean;
  onBackPress?: () => void;
  showAppLogo?: boolean;
  title?: string;
  showProfileLogo?: boolean;
  onProfilePress?: () => void;
}
// Import the correct navigation prop type from your navigation types file
// Adjust the path as needed

const CustomHeader: React.FC<CustomHeaderProps> = ({
  showBackArrow = false,
  onBackPress,
  showAppLogo = false,
  title,
  showProfileLogo = false,
  onProfilePress,
}) => {
  const styles = useStyle();
  const navigate = useNavigation<HomeTabsNavigationProp>();
  //i click on back arrow i want to nevigate go back screen when back arrow is pressed

  const handleBackPress = () => {
    onBackPress ? onBackPress() : navigate.goBack();
  };

  const handleProfilePress = () => {
    onProfilePress ? onProfilePress() : () => {};
  };

  return (
    <View style={styles.headerContainer}>
      {/* Left: Back Arrow or App Logo (Absolute Position) */}
      {showBackArrow && (
        <TouchableOpacity onPress={handleBackPress} style={styles.leftButton}>
          <Image
            source={ICONS.BackArrow}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      {showAppLogo && (
        <View style={styles.leftLogo}>
          <CustomLogo logoStyle={styles.logoStyle} />
        </View>
      )}

      {/* Center: Title (Flex 1 with Center Alignment) */}
      <View style={styles.centerContainer}>
        {title && (
          <Text type="BOLD" style={styles.title}>
            {title}
          </Text>
        )}
      </View>

      {/* Right: Profile Logo (Absolute Position) */}
      {showProfileLogo && (
        <View style={styles.rightButton}>
          <CustomProfileButton onPress={handleProfilePress} />
        </View>
      )}
    </View>
  );
};

export default memo(CustomHeader);
