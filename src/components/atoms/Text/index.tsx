import React from 'react';
import {
  Text as RNText,
  TextStyle,
  StyleProp,
  GestureResponderEvent,
  TextProps as RNTextProps,
} from 'react-native';

interface TextProps extends RNTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  onPress?: (event: GestureResponderEvent) => void;
}

const Text: React.FC<TextProps> = ({
  children,
  style,
  numberOfLines,
  onPress,
  ...rest
}) => {
  return (
    <RNText
      style={[{fontFamily: 'WinkyRough-Regular'}, style]}
      numberOfLines={numberOfLines}
      onPress={onPress}
      {...rest}>
      {children}
    </RNText>
  );
};

export default Text;
