import React from 'react';
import { View, Image } from 'react-native';
import useStyle from './style';
import { IMAGES } from '@assets/index';

const Splash: React.FC = () => {
  const styles = useStyle();
  return (
    <View style={styles.container}>
      <Image source={IMAGES.Allio_Logo} resizeMode="contain" />
    </View>
  );
};
export default Splash;
