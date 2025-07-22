import React from 'react';
import {
  Text as RNText,
  TextStyle,
  StyleProp,
  GestureResponderEvent,
  TextProps as RNTextProps,
} from 'react-native';
import {FONTS} from '../../../utils/helper';

interface TextProps extends RNTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  onPress?: (event: GestureResponderEvent) => void;
  type?: string;
}

const Text: React.FC<TextProps> = ({
  children,
  style,
  numberOfLines,
  onPress,
  type = 'regular',
  ...rest
}) => {
  const getFontFamily = () => {
    switch (type.toLowerCase()) {
      case 'black':
        return FONTS.black;
      case 'bold':
        return FONTS.bold;
      case 'extrabold':
        return FONTS.extraBold;
      case 'light':
        return FONTS.light;
      case 'extraLight':
        return FONTS.extraLight;
      case 'medium':
        return FONTS.medium;
      case 'semibold':
        return FONTS.semiBold;
      case 'thin':
        return FONTS.thin;
      default:
        return FONTS.regular;
    }
  };

  return (
    <RNText
      style={[{fontFamily: getFontFamily()}, style]}
      numberOfLines={numberOfLines}
      onPress={onPress}
      {...rest}>
      {children}
    </RNText>
  );
};

export default Text;
