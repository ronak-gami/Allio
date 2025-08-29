import React from 'react';
import {
  Text as RNText,
  TextStyle,
  StyleProp,
  GestureResponderEvent,
  TextProps as RNTextProps,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { FONTS } from '@assets/index';

interface TextProps extends RNTextProps {
  label?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  onPress?: (event: GestureResponderEvent) => void;
  type?: string;
  children?: string | React.ReactNode;
  fontFamily?: string;
}

const Text: React.FC<TextProps> = ({
  label,
  style,
  type = 'regular',
  children,
  ...rest
}) => {
  const { t } = useTranslation();

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
      case 'extralight':
        return FONTS.extraLight;
      case 'medium':
        return FONTS.medium;
      case 'semibold':
        return FONTS.semiBold;
      default:
        return FONTS.regular;
    }
  };

  let content: React.ReactNode = null;

  if (label) {
    content = t(label);
  } else if (typeof children === 'string') {
    content = t(children);
  } else {
    content = children;
  }

  return (
    <RNText style={[style, { fontFamily: getFontFamily() }]} {...rest}>
      {content}
    </RNText>
  );
};

export default Text;
