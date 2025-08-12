// src/components/common/CustomRadioButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  View,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';

import Text from '../Text';
import useStyle from './style';

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
}

const CustomRadioButton: React.FC<RadioButtonProps> = ({
  label,
  selected,
  onPress,
  disabled = false,
  error,
  containerStyle,
}) => {
  const styles = useStyle();

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}>
        <View style={[styles.circle, selected && styles.selectedCircle]}>
          {selected && <View style={styles.innerCircle} />}
        </View>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default CustomRadioButton;
