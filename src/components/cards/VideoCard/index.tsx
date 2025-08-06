import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import useStyle from './style';
import { ICONS } from '@assets/index';
import useVideoMedia from '@screens/App/VideoMedia/useVideoMedia';

const VideoCard = ({ item }: { item: any }) => {
  const styles = useStyle();
  const { handleSelectStoredVideo } = useVideoMedia();
  return (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handleSelectStoredVideo(item)}>
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
