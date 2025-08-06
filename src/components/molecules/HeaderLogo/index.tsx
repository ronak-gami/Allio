import React from 'react';
import {
  View,
  Image,
  ImageSourcePropType,
  ImageStyle,
  ViewStyle,
} from 'react-native';

import { IMAGES } from '@assets/index';

import useStyle from './style';
interface Props {
  logo?: ImageSourcePropType;
  logoStyle?: ImageStyle;
  containerStyle?: ViewStyle;
}

const CustomLogo: React.FC<Props> = ({ logo, logoStyle, containerStyle }) => {
  const styles = useStyle();

  return (
    <View style={[styles.logoContainer, containerStyle]}>
      <Image
        source={logo || IMAGES.Allio_Logo}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

export default CustomLogo;
