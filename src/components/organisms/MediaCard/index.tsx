import React, { memo } from 'react';
import { Image, Pressable } from 'react-native';
import useStyle from './style';

interface MediaCard {
  uri: string;
  onLongPress: () => void;
}

const MediaCard = ({ uri, onLongPress }: MediaCard) => {
  const styles = useStyle();

  return (
    <Pressable onLongPress={onLongPress} style={styles.card}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
    </Pressable>
  );
};

export default memo(MediaCard);
