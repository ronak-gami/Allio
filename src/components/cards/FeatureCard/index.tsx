import React, { memo } from 'react';
import { View, Image } from 'react-native';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import { useTranslation } from 'react-i18next';
import useStyle from './style';
interface FeatureCardProps {
  image: any;
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  title,
  description,
  buttonText,
  onPress,
}) => {
  const styles = useStyle();
  const { t } = useTranslation();
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{t(title)}</Text>
      <Text style={styles.description}>{t(description)}</Text>
      <Button title={t(buttonText)} style={styles.button} onPress={onPress} />
    </View>
  );
};

export default memo(FeatureCard);
