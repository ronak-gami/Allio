import React from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { IMAGES } from '@assets/index'; // IMAGES = { noPosts: require('...'), ... }
import useStyle from './style';

interface ListEmptyCardProps {
  title: string;
  subtitle: string;
  image: keyof typeof IMAGES; // <- Pass the key, e.g. "noPosts"
}

const ListEmptyCard: React.FC<ListEmptyCardProps> = ({
  title,
  subtitle,
  image,
}) => {
  const styles = useStyle();

  return (
    <View style={styles.emptyStateContainer}>
      <Image
        source={IMAGES[image]}
        style={styles.noGalleryIcon}
        resizeMode="contain"
      />
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateSubtitle}>{subtitle}</Text>
    </View>
  );
};

export default ListEmptyCard;
