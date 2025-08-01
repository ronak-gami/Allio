import React from 'react';
import {
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  ColorValue,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import useStyle from './style';
import Text from '../Text';

interface CustomChipProps {
  label: string;
  onPress?: () => void;
  bgColor?: ColorValue;
  textColor?: ColorValue;
  style?: StyleProp<ViewStyle>;
  outline?: boolean;
  outlineColor?: ColorValue;
}

const CustomChip: React.FC<CustomChipProps> = ({
  label,
  onPress,
  bgColor,
  textColor,
  style,
  outline = false,
  outlineColor,
}) => {
  const styles = useStyle();
  const { colors } = useTheme();

  const chipStyle: StyleProp<ViewStyle> = [
    styles.chip,
    outline
      ? {
          borderWidth: 1,
          borderColor: outlineColor || colors.primary,
          backgroundColor: 'transparent',
        }
      : {
          backgroundColor: bgColor || colors.primary,
        },
    style,
  ];

  const finalTextColor = outline
    ? outlineColor || colors.primary
    : textColor || colors.background;

  return (
    <TouchableOpacity style={chipStyle} onPress={onPress} activeOpacity={0.7}>
      <Text type="SEMIBOLD" style={[styles.text, { color: finalTextColor }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomChip;
