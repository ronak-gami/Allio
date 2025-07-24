import Input from '@components/atoms/Input';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

interface LastnameFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  styleInput?: StyleProp<TextStyle>;
}

const LastnameField: React.FC<LastnameFieldProps> = ({
  value,
  onChangeText,
  error,
  styleInput,
}) => {
  return (
    <Input
      style={styleInput}
      placeholder="Lastname"
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
      error={error}
    />
  );
};

export default LastnameField;
