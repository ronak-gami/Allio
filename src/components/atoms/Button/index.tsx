import React from 'react';
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  ViewStyle,
  GestureResponderEvent,
  StyleProp,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '@utils/color';
import Text from '../Text';
import useStyle from './style';

interface ButtonProps {
  title: string;
  textColor?: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  prefixLogo?: React.ReactNode;
  postfixLogo?: React.ReactNode;
  loading?: boolean;
  gradientColors?: string[];
  disabled?: boolean;
  bgColor?: string;
  outlineColor?: string;
  outlineWidth?: number;
}

const Button: React.FC<ButtonProps> = ({
  title,
  textColor,
  onPress,
  style,
  prefixLogo,
  postfixLogo,
  loading = false,
  disabled = false,
  bgColor,
  outlineColor,
  outlineWidth = 1,
}) => {
  const styles = useStyle();
  let currentTextColor = textColor;
  let wrapperStyles: StyleProp<ViewStyle>[] = [styles.button];
  let WrapperComponent: React.ElementType = View;
  let specificWrapperProps: any = {};

  if (outlineColor) {
    wrapperStyles.push({
      borderColor: outlineColor,
      borderWidth: outlineWidth,
      backgroundColor: 'transparent',
    });
    if (!textColor) {
      currentTextColor = outlineColor;
    }
  } else if (bgColor) {
    wrapperStyles.push({
      backgroundColor: bgColor,
    });
    if (!textColor) {
      currentTextColor = COLORS.white;
    }
  } else {
    // WrapperComponent = LinearGradient;
    // specificWrapperProps.colors = gradientColors;
    if (!textColor) {
      currentTextColor = COLORS.white;
    }
  }

  if (disabled || loading) {
    wrapperStyles.push({ opacity: 0.6 });
  }

  if (style) {
    wrapperStyles.push(style);
  }

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      disabled={disabled || loading}>
      <WrapperComponent {...specificWrapperProps} style={wrapperStyles}>
        {loading ? (
          <ActivityIndicator color={currentTextColor} />
        ) : (
          <View style={styles.content}>
            {prefixLogo && <View style={styles.icon}>{prefixLogo}</View>}
            <Text style={[styles.text, { color: currentTextColor }]}>
              {title}
            </Text>
            {postfixLogo && <View style={styles.icon}>{postfixLogo}</View>}
          </View>
        )}
      </WrapperComponent>
    </TouchableOpacity>
  );
};

export default Button;
