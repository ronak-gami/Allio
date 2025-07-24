import React from 'react';
import { Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import styles from './style';
import { ICONS } from '@assets/index';

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1 },
        { position: 'absolute', top: scale(18), left: scale(18), zIndex: 999 },
      ]}>
      <Image
        source={ICONS.BackArrow}
        style={styles.icon}
        resizeMode="contain"
      />
    </Pressable>
  );
};

export default BackButton;
