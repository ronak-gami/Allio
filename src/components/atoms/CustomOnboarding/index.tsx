import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';

import useStyle from './style';

export interface OnboardingScreenProps {
  image: ImageSourcePropType;
  title: string;
  description: string;
}
const CustomOnboarding: React.FC<OnboardingScreenProps> = ({
  image,
  title,
  description,
}) => {
  const styles = useStyle();
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text label={title} style={styles.title} />
      <Text label={description} style={styles.description} />
    </View>
  );
};

export default CustomOnboarding;
