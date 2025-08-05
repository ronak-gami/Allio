import React from 'react';
import { View, Image } from 'react-native';
import { IMAGES } from '@assets/index';
import useStyle from './style';

const HeaderLogo: React.FC = () => {
  const styles = useStyle();
  return (
    <View style={styles.logoContainer}>
      <Image source={IMAGES.Allio_Logo} style={styles.logo} />
    </View>
  );
};

export default HeaderLogo;
