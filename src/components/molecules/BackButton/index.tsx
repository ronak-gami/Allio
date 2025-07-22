import React from 'react';
import {Pressable, Image} from 'react-native';
import {ICONS} from '../../../assets';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import {useStyle} from './style';

const BackButton = () => {
  const styles = useStyle();
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={({pressed}) => [
        {opacity: pressed ? 0.5 : 1},
        {position: 'absolute', top: scale(18), left: scale(18), zIndex: 999},
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
