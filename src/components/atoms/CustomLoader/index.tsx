import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import useStyle from './style';

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
  color,
  backgroundColor,
  textColor,
}) => {
  const { colors } = useTheme();
  const styles = useStyle();
  const loaderColor = color || colors.primary;
  const loaderBgColor = backgroundColor || colors.modelbg;
  const loaderTextColor = textColor || colors.primary;

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: loaderBgColor }]}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={size} color={loaderColor} />
        {text && (
          <Text style={[styles.loadingText, { color: loaderTextColor }]}>
            {text}
          </Text>
        )}
      </View>
    </View>
  );
};

export default CustomLoader;
