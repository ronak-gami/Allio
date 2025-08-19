import React from 'react';
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  GestureResponderHandlers,
} from 'react-native';

import { useTheme } from '@react-navigation/native';

import Text from '../Text';
import useStyle from './style';
import { Color } from '@assets/theme/colors';

interface ButtonProps extends GestureResponderHandlers {
  title: string;
  onPress?: () => void;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  prefixLogo?: React.ReactNode;
  postfixLogo?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  bgColor?: Color;
  outlineColor?: Color;
  outlineWidth?: number;
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({
  title,
  textColor,
  style,
  prefixLogo,
  postfixLogo,
  loading = false,
  disabled = false,
  bgColor,
  outlineColor,
  outlineWidth = 1,
  ...props
}) => {
  const { colors } = useTheme();
  const styles = useStyle();

  // Determine button type based on props
  const isOutlineType = outlineColor !== undefined;
  const isFillType = !isOutlineType;

  // Button wrapper styles
  const wrapperStyles: StyleProp<ViewStyle> = [
    styles.button,
    // Fill type styling
    isFillType && {
      backgroundColor: bgColor || colors.primary,
      borderWidth: 0,
    },
    // Outline type styling
    isOutlineType && {
      backgroundColor: 'transparent',
      borderColor: outlineColor,
      borderWidth: outlineWidth,
    },
    // Disabled/loading state
    (disabled || loading) && { opacity: 0.45 },
    style,
  ];

  // Text color logic
  let currentTextColor = colors.black;
  if (textColor) {
    // Custom text color takes priority
    currentTextColor = textColor;
  } else if (isOutlineType) {
    // For outline buttons, use outline color as text color
    currentTextColor = outlineColor;
  } else if (isFillType) {
    // For fill buttons, use white text by default (or custom logic)
    currentTextColor = colors.black;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={loading || disabled}
      style={wrapperStyles}
      {...props}>
      {loading ? (
        <ActivityIndicator color={currentTextColor} size="small" />
      ) : (
        <View style={styles.content}>
          {prefixLogo && <View style={styles.icon}>{prefixLogo}</View>}
          <Text
            type="SEMIBOLD"
            style={[styles.text, { color: currentTextColor }]}>
            {title}
          </Text>
          {postfixLogo && <View style={styles.icon}>{postfixLogo}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
