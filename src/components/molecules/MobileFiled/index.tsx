import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import Input from '../../atoms/Input';

interface MobilenoFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  styleInput?: StyleProp<TextStyle>;
}

const MobilenoField: React.FC<MobilenoFieldProps> = ({
  value,
  onChangeText,
  error,
  styleInput,
}) => {
  return (
    <Input
      style={styleInput}
      keyboardType="numeric"
      placeholder="Mobile No."
      value={value}
      onChangeText={onChangeText}
      error={error}
    />
  );
};

export default MobilenoField;
