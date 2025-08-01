import React from 'react';
import { View, Image } from 'react-native';

import { IMAGES } from '@assets/index';

import useStyle from './style';
const Splash: React.FC = () => {
  const styles = useStyle();
  return (
    <View style={styles.container}>
      <Image source={IMAGES.Allio_Logo} resizeMode="contain" />
    </View>
  );
};
export default Splash;
