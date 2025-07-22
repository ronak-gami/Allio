import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import Input from '../../atoms/Input';

interface FirstnameFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  styleInput?: StyleProp<TextStyle>;
}

const FirstnameField: React.FC<FirstnameFieldProps> = ({
  value,
  onChangeText,
  error,
  styleInput,
  // Assuming it's passed to Input or can be removed
}) => {
  return (
    <Input
      style={styleInput}
      placeholder="Firstname"
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
      error={error}
    />
  );
};

export default FirstnameField;
