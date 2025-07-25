import Input from '@components/atoms/Input';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

interface PasswordFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  styleInput?: StyleProp<TextStyle>;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChangeText,
  error,
  styleInput,
}) => {
  return (
    <Input
    maxlength={12}
      style={styleInput}
      placeholder="Password"
      value={value}
      onChangeText={onChangeText}
      isPassword={true}
      error={error}
    />
  );
};

export default PasswordField;
