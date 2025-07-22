import React from 'react';
import {View, Image} from 'react-native';
import {IMAGES} from '../../assets';
import styles from './style';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={IMAGES.Allio_Logo} resizeMode="contain" />
    </View>
  );
};

export default SplashScreen;
