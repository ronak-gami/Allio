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
import { scale } from 'react-native-size-matters';

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

  const isOutline = typeof outlineColor === 'string';

  const wrapperStyles: StyleProp<ViewStyle> = [
    styles.button,
    {
      backgroundColor: isOutline ? 'transparent' : colors.primary,
    },
    !isOutline && bgColor && { backgroundColor: bgColor },
    isOutline && {
      borderColor: outlineColor,
      borderWidth: outlineWidth,
    },
    (disabled || loading) && { opacity: 0.45 },
    style,
  ];

  let currentTextColor = colors.black;
  if (textColor) {
    currentTextColor = textColor;
  } else if (isOutline) {
    currentTextColor = outlineColor;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={loading || disabled}
      {...props}>
      <View style={wrapperStyles}>
        {loading ? (
          <ActivityIndicator color={currentTextColor} />
        ) : (
          <View style={styles.content}>
            {prefixLogo && <View style={styles.icon}>{prefixLogo}</View>}
            <Text
              type="semibold"
              style={[styles.text, { color: currentTextColor }]}>
              {title}
            </Text>
            {postfixLogo && <View style={styles.icon}>{postfixLogo}</View>}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
