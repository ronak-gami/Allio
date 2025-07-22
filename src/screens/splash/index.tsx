import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import {scale} from 'react-native-size-matters';

import {height, width} from '../../utils/helper';
import {useStyle} from './style';

const styles = useStyle(); 

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/animation/splash.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Text style={styles.text}>ALLIO APP</Text>
    </View>
  );
};

export default SplashScreen;
