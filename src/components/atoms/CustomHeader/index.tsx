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

  const handleBackPress = () => {
    onBackPress ? onBackPress() : navigate.goBack();
  };

  const handleProfilePress = () => {
    onProfilePress ? onProfilePress() : () => {};
  };

  return (
    <View style={styles.headerContainer}>
      {showBackArrow && (
        <TouchableOpacity onPress={handleBackPress} style={styles.leftButton}>
          <Image
            source={ICONS.Left}
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
