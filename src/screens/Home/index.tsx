import React from 'react';
import {  View } from 'react-native';
import { Text } from 'react-native-paper';
import styles from './style';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeScreen</Text>
    </View>
  );
};
export default HomeScreen;
