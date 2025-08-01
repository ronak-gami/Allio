import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import useStyle from './style';
import Text from '../Text';

export interface OnboardingScreenProps {
  image: ImageSourcePropType;
  title: string;
  description: string;
  width: number;
}

const CustomOnboarding: React.FC<OnboardingScreenProps> = ({
  image,
  title,
  description,
  width,
}) => {
  const styles = useStyle();
  return (
    <View style={[styles.container, { width }]}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text label={title} style={styles.title} type="SEMIBOLD" />
      <Text label={description} style={styles.description} />
    </View>
  );
};

export default CustomOnboarding;
