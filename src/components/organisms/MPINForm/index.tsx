import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import OTPInput from '@components/atoms/OTPInput';
import Button from '@components/atoms/Button';
import Text from '@components/atoms/Text';
import useMPINForm from './useMPINForm';
import useStyle from './style';
import { HOME } from '@utils/constant';

type MPINFormProps = {
  email?: string;
  resetMpin?: boolean;
};

const MPINForm: React.FC<MPINFormProps> = ({ resetMpin = false, email }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
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
  } = useMPINForm({ email, resetMpin });

  if (loading) return null;

  const showConfirmField = resetMpin || !isExistingUser;

  const titleLabel = resetMpin
    ? 'mpin_reset_title'
    : isExistingUser
    ? 'mpin_enter_title'
    : 'mpin_set_title';

  const subtitleLabel = resetMpin
    ? 'mpin_reset_subtitle'
    : isExistingUser
    ? 'mpin_enter_subtitle'
    : 'mpin_set_subtitle';

  const buttonLabel = resetMpin
    ? 'mpin_reset_button'
    : isExistingUser
    ? 'mpin_enter_button'
    : 'mpin_set_button';

  return (
    <View style={styles.container}>
      <View style={styles.subView}>
        <Text
          type="bold"
          style={[styles.title, { color: colors.primary }]}
          label={titleLabel}
        />

        <Text type="medium" style={styles.subtitle} label={subtitleLabel} />

        <OTPInput label="enter_mpin" value={mpin} onChange={handleMpinInput} />

        {showConfirmField && (
          <OTPInput
            label="confirm_mpin"
            value={confirmMpin}
            onChange={handleConfirmInput}
          />
        )}

        {isExistingUser && !resetMpin && (
          <Pressable
            onPress={() => navigation.navigate(HOME.ForgetMPIN)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 1,
                marginBottom: 20,
                alignSelf: 'flex-end',
              },
            ]}>
            <Text
              style={styles.forgotpassText}
              type="semibold"
              label="forgot_password"
            />
          </Pressable>
        )}

        {errorMessage.length > 0 && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
      </View>

      <View style={styles.button}>
        <Button
          title={buttonLabel}
          onPress={handleSubmit}
          disabled={isButtonDisabled}
          loading={loading}
        />
      </View>
    </View>
  );
};

export default MPINForm;
