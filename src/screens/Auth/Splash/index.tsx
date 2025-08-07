import React from 'react';
import { View, Image } from 'react-native';

import { useTheme } from '@react-navigation/native';
import { IMAGES } from '@assets/index';
import { CustomStatusBar } from '@components/index';
import useStyle from './style';

const Splash: React.FC = () => {
  const styles = useStyle();
  const { colors } = useTheme();
  return (
    <>
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor={colors.primary}
      />
      <View style={styles.container}>
        <Image source={IMAGES.Allio_Logo} resizeMode="contain" />
      </View>
    </>
  );
};
export default Splash;
