import React from 'react';
import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from '../../../utils/color';
import Input from '../../atoms/Input';

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

const styles = StyleSheet.create({
  emailText: {
    alignSelf: 'flex-start',
    fontSize: scale(14),
    fontWeight: '400',
    color: COLORS.gray,
  },
});
