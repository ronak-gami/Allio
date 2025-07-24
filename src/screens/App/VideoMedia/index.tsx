import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import useStyle from './style';

const VideoMedia: React.FC = () => {
  const styles = useStyle();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VideoMedia</Text>
    </View>
  );
};
export default VideoMedia;
