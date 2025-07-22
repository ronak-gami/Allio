import React from 'react';
import {
  Text as RNText,
  TextStyle,
  StyleProp,
  GestureResponderEvent,
  TextProps as RNTextProps,
} from 'react-native';
import {FONTS} from '../../../utils/helper';
import {useTranslation} from 'react-i18next';

interface TextProps extends RNTextProps {
  label?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  onPress?: (event: GestureResponderEvent) => void;
  type?: string;
  children?: React.ReactNode;
  fontFamily?: string;
}

const Text: React.FC<TextProps> = ({
  label,
  style,
  numberOfLines,
  onPress,
  type = 'regular',
  children,

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


  const {t} = useTranslation();

  const content = label ? t(label) : children;

  return (
    <RNText
      style={ style}
      numberOfLines={numberOfLines}
      onPress={onPress}
      {...rest}>
      {content}
    </RNText>
  );
};

export default Text;
