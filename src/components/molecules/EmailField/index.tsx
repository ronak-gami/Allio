import Input from '@components/atoms/Input';
import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';

interface EmailFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  style?: ViewStyle | TextStyle;
}

const EmailField: React.FC<EmailFieldProps> = ({
  value,
  onChangeText,
  error,
  style,
}) => {
  return (
    <Input
      style={style}
      placeholder="Email"
      value={value}
      onChangeText={onChangeText}
      keyboardType="email-address"
      autoCapitalize="none"
      error={error}
    />
  );
};

export default EmailField;
