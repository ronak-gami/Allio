import React from 'react';
import { View, Image } from 'react-native';

import StatusBar from '@components/atoms/StatusBar';
import { IMAGES } from '@assets/index';
import useStyle from './style';

const Splash: React.FC = () => {
  const styles = useStyle();
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.statusBar.backgroundColor}
      />
      <View style={styles.container}>
        <Image source={IMAGES.Allio_Logo} resizeMode="contain" />
      </View>
    </>
  );
};
export default Splash;
