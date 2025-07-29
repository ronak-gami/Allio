import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { Formik } from 'formik';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import Input from '@components/atoms/Input';
import OTPInput from '@components/atoms/OTPInput';
import useStyle from './style';
import { useForgotPassword } from './useForgetpassForm';
import useValidation from '@utils/validationSchema';
import { useNavigation, useTheme } from '@react-navigation/native';

interface MpinForgetpasswordFormProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MpinForgetpasswordForm: React.FC<MpinForgetpasswordFormProps> = ({
  setLoading,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { forgotPasswordSchema } = useValidation();
  const style = useStyle();

  const {
    handleForgotPassword,
    handleOTPVerify,
    handleResendOtp,
    otp,
    setOtp,
    showOtpBox,
    isVerifying,
    resendTimer,
    isSubmittingEmail,
  } = useForgotPassword(setLoading);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    return () => clearTimeout(timer);
  }, [resendTimer]);

  return (
    <View style={style.container}>
      {!showOtpBox ? (
        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleForgotPassword}>
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={style.form}>
              <View style={style.buttonGrow}>
                <Text
                  type="bold"
                  style={[style.title, { color: colors.primary }]}
                  label="mpin_forgot_title"
                />
                <Text
                  type="medium"
                  style={style.subtitle}
                  label="mpin_forgot_subtitle"
                />

                <Input
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  error={touched.email ? errors.email : ''}
                />

                <Pressable
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.5 : 1,
                      marginVertical: 20,
                      alignSelf: 'center',
                    },
                  ]}>
                  <Text style={style.forgotpassText} type="semibold">
                    Go to MPin?{' '}
                    <Text
                      type="semibold"
                      style={{ color: colors.primary }}
                      onPress={() => navigation.navigate('MPIN')}>
                      MPin
                    </Text>
                  </Text>
                </Pressable>
              </View>

              <Button
                title="mpin_forgot_button"
                onPress={handleSubmit as () => void}
                isLabel
                loading={isSubmittingEmail}
              />
            </View>
          )}
        </Formik>
      ) : (
        <View style={style.form}>
          <View style={style.buttonGrow}>
            <Text
              type="bold"
              style={[style.title, { color: colors.primary }]}
              label="mpin_otp_title"
            />

            <Text
              type="medium"
              style={style.subtitle}
              label="mpin_otp_subtitle"
            />
            <View style={style.otpInput}>
              <OTPInput value={otp} onChange={setOtp} />
            </View>

            <Text
              type="medium"
              disabled={resendTimer > 0}
              onPress={handleResendOtp}
              label={
                resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend otp'
              }
              style={[
                style.textResetotp,
                { color: resendTimer > 0 ? colors.gray : colors.primary },
              ]}
            />
          </View>

          <Button
            title="Verify OTP"
            onPress={() => handleOTPVerify({ email: '' })}
            disabled={isVerifying || otp.length < 4}
            loading={isVerifying}
          />
        </View>
      )}
    </View>
  );
};

export default MpinForgetpasswordForm;
