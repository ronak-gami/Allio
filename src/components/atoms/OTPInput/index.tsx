

import React from 'react';
import { View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

import { useStyle } from './style';
import Text from '../Text';

interface OTPInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const OTPInput = ({ label, value, onChange }: OTPInputProps) => {
  const styles = useStyle();
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text type="medium" style={styles.label}>
        {label}
      </Text>

      <OtpInput
        numberOfDigits={4}
        value={value}
        onTextChange={onChange}
        focusColor={colors.primary}
        autoFocus={false}
        secureTextEntry
        theme={{
          pinCodeContainerStyle: {
            width: scale(70),
            height: scale(60),
            borderWidth: 1,
            borderRadius: scale(10),
            justifyContent: 'center',
            alignItems: 'center',
          },
          focusedPinCodeContainerStyle: {
            borderColor: colors.primary,
            borderWidth: 2,
          },
          pinCodeTextStyle: {
            color: colors.text,
          },
        }}
      />
    </View>
  );
};

export default OTPInput;
