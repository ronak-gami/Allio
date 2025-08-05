import React from 'react';
import { Image, Pressable } from 'react-native';
import useStyle from './style';

interface Props {
  uri: string;
  onLongPress: () => void;
}

const MediaCard: React.FC<Props> = ({ uri, onLongPress }) => {
  const styles = useStyle();

  return (
    <Pressable onLongPress={onLongPress} style={styles.card}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
    </Pressable>
  );
};

export default MediaCard;
