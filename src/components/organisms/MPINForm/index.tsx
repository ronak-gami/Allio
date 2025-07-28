import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import OTPInput from '@components/atoms/OTPInput';
import Button from '@components/atoms/Button';
import Text from '@components/atoms/Text';
import useMPINForm from './useMPINForm';
import useStyle from './style';

const MPINForm = () => {
  const { colors } = useTheme();
  const styles = useStyle();
  const {
    loading,
    mpin,
    confirmMpin,
    errorMessage,
    isExistingUser,
    isButtonDisabled,
    handleMpinInput,
    handleConfirmInput,
    handleSubmit,
  } = useMPINForm();

  if (loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.subView}>
        <Text type="bold" style={[styles.title, { color: colors.text }]}>
          {isExistingUser ? 'Enter 4-Digit MPIN' : 'Set 4-Digit MPIN'}
        </Text>
        <OTPInput label="Enter MPIN" value={mpin} onChange={handleMpinInput} />
        {!isExistingUser && (
          <OTPInput
            label="Confirm MPIN"
            value={confirmMpin}
            onChange={handleConfirmInput}
          />
        )}
        {errorMessage.length > 0 && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
      </View>
      <Button
        title={isExistingUser ? 'Enter PIN' : 'Set MPIN'}
        onPress={handleSubmit}
        disabled={isButtonDisabled}
      />
    </View>
  );
};

export default MPINForm;
