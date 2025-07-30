import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import useStyle from './style';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '@types/navigations';
import { handleVideoPermissions } from '@utils/helper';

type Props = BottomTabScreenProps<TabParamList, 'Video'>;

const VideoMedia: React.FC<Props> = () => {
  useEffect(() => {
    const result = handleVideoPermissions();
    console.log(
      '-------------------result for permissions to check-------------------',
      result,
    );
  }, []);
  const styles = useStyle();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VideoMedia</Text>
    </View>
  );
};
export default VideoMedia;
