import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import useStyle from './style';

const ScanQR: React.FC = () => {
  const styles = useStyle();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScanQR</Text>
    </View>
  );
};
export default ScanQR;
