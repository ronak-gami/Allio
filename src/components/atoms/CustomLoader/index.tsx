import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import styles from './style';
import { COLORS } from '@utils/color';

interface LoaderProps {
  visible: boolean;
  text?: string;
  size?: 'small' | 'large';
  color?: string;
  backgroundColor?: string;
  textColor?: string;
}

const CustomLoader: React.FC<LoaderProps> = ({
  visible,
  text = 'Loading...',
  size = 'large',
  color = COLORS.primary,
  backgroundColor = 'rgba(0, 0, 0, 0.5)',
  textColor = COLORS.primary,
}) => {
  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={size} color={color} />
        {text && (
          <Text style={[styles.loadingText, { color: textColor }]}>{text}</Text>
        )}
      </View>
    </View>
  );
};

export default CustomLoader;
