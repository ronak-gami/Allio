import React, { useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

import { useStyle } from './style';
import Text from '../Text';

interface OTPInputProps {
  label?: string;
  onChange: (value: string) => void;
  [key: string]: any;
}

export interface OTPInputHandle {
  focus: () => void;
  clear: () => void;
}

const OTPInput = React.forwardRef<OTPInputHandle, OTPInputProps>(
  ({ label, onChange, ...props }, ref) => {
    const styles = useStyle();
    const { colors } = useTheme();
    const internalRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        // library exposes focus on underlying TextInputs collectively
        internalRef.current?.focus?.();
      },
      clear: () => {
        internalRef.current?.clear?.();
      },
    }));

    return (
      <View style={styles.wrapper}>
        <Text type="medium" style={styles.label}>
          {label}
        </Text>

        <OtpInput
          ref={internalRef}
          numberOfDigits={4}
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
          {...props}
        />
      </View>
    );
  },
);

export default OTPInput;
