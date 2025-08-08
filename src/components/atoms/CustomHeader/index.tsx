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
  showLogo?: boolean;
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
      <View>
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
          <CustomLogo logoStyle={styles.logoStyle} />
        ) : (
          <></>
        )}
      </View>

      {/* Center: Title */}
      <View>
        {title && (
          <Text type="BOLD" style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      {/* Right: Profile Icon */}
      <View style={styles.rightContainer}>
        {showProfile && (
          <CustomProfileButton onPress={onProfilePress ?? (() => {})} />
        )}
      </View>
    </View>
  );
};

export default memo(CustomHeader);
