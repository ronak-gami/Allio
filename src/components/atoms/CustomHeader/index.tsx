import React, { memo, useState, useEffect } from 'react';

import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

import Text from '../Text';
import CustomLogo from '@components/molecules/HeaderLogo';
import CustomProfileButton from '@components/molecules/ProfileButton';
import { ICONS } from '@assets/index';
import { isOnline } from '@utils/helper';

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
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const checkInitialStatus = async () => {
      const initialStatus = await isOnline();
      setOnline(initialStatus);
    };
    checkInitialStatus();

    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected =
        state?.isConnected && state?.isInternetReachable !== false;
      setOnline(isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

      <View style={styles.centerContainer}>
        {title && <Text type="BOLD" style={styles.title} label={title} />}
      </View>

      {showProfileLogo && (
        <View style={styles.rightButton}>
          <CustomProfileButton onPress={handleProfilePress} />
        </View>
      )}
      <View style={styles.rightButtonIcon}>
        <Image
          source={online ? ICONS.online : ICONS.offline}
          style={styles.offlineIcon}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default memo(CustomHeader);
