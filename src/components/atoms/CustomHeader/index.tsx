import React, { memo } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

import CustomLogo from '@components/molecules/HeaderLogo';
import CustomProfileButton from '@components/molecules/ProfileButton';
import { ICONS, IMAGES } from '@assets/index';
import useStyle from './style';
import { useNavigation } from '@react-navigation/native';
import type { HomeTabsNavigationProp } from '@navigation/types';
import Text from '../Text';

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
  const navigate = useNavigation<HomeTabsNavigationProp>();

  return (
    <View style={styles.headerContainer}>
      {/* Left: Back Arrow or Logo */}
      <View style={styles.leftContainer}>
        {showBackArrow ? (
          <TouchableOpacity
            onPress={() => {
              onBackPress ? onBackPress() : navigate.goBack();
            }}
            style={styles.backButton}>
            <Image
              source={ICONS.BackArrow}
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
          <Text type="BOLD" style={styles.title} numberOfLines={1}>
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

export default memo(CustomHeader);
