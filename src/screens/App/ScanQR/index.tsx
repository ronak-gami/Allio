import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import useStyle from './style';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '@types/navigations';

type Props = BottomTabScreenProps<TabParamList, 'ScanQR'>;

const ScanQR: React.FC<Props> = () => {
  const styles = useStyle();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScanQR</Text>
    </View>
  );
};
export default ScanQR;
