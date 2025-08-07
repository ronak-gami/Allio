import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import useStyle from './style';
import { ICONS } from '@assets/index';

const VideoCard = ({
  item,
  handleSelectStoredVideo,
}: {
  item: any;
  handleSelectStoredVideo?(item: any): void;
}) => {
  const styles = useStyle();
  return (
    <TouchableOpacity style={styles.gridItem} onPress={handleSelectStoredVideo}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.gridItem}
        resizeMode="cover"
      />
      <Image
        source={ICONS.VideoPlay}
        style={styles.VideoPlayIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default VideoCard;
