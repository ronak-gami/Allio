import React from 'react';
import {View, Text, Image, ImageSourcePropType} from 'react-native';
import {useStyle} from './style';

interface OnboardingScreenProps {
  image: ImageSourcePropType;
  title: string;
  description: string;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  image,
  title,
  description,
}) => {
  const styles = useStyle();

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      {/* <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text> */}
    </View>
  );
};

export default OnboardingScreen;
