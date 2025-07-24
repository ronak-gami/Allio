import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import useStyle from './style';

const PhotoMedia: React.FC = () => {
  const styles = useStyle();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PhotoMedia</Text>
    </View>
  );
};
export default PhotoMedia;
