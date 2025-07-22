import React from 'react';
import {StyleSheet, StyleProp, TextStyle} from 'react-native';
import Input from '../../atoms/Input';
import {scale} from 'react-native-size-matters';
import {COLORS} from '../../../utils/color';

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
  placeholder,
}) => {
  return (
    <Input
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

const Styles = StyleSheet.create({
  passwordText: {
    alignSelf: 'flex-start',
    fontSize: scale(14),
    fontWeight: '400', // ✅ TypeScript requires this as a string
    color: COLORS.gray,
  },
});
