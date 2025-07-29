import { useState } from 'react';
import { showError, showSuccess } from '@utils/toast';
import { checkUserExistsByEmail } from '@utils/helper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export const useForgotPassword = () => {
  const navigation = useNavigation();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [Email, setEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(56);

  const startResendTimer = () => {
    setResendTimer(56);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      setIsSubmittingEmail(true); // <- Start loading
      const userExists = await checkUserExistsByEmail(values.email);
      if (!userExists) {
        showError('No user found with this email.');
        return;
      }

      setEmail(values.email);
      const response = await axios.post(
        'https://allio-backend.onrender.com/api/user/send-otp',
        { email: values.email },
      );

      setShowOtpBox(true);
      const { verificationId } = response.data;
      setVerificationId(verificationId || '123456');
      showSuccess('OTP sent to your email');
      startResendTimer();
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Failed to send reset code');
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      showSuccess('OTP resent to your email');
      startResendTimer();
      const response = await axios.post(
        'https://allio-backend.onrender.com/api/user/send-otp',
        { email: Email },
      );

      const { verificationId } = response.data;
      setVerificationId(verificationId || '123456');
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const handleOTPVerify = async (values: { email: string }) => {
    try {
      setIsVerifying(true);
      const response = await axios.post(
        'https://allio-backend.onrender.com/api/user/validate-otp',
        {
          email: Email,
          otp: otp,
        },
      );

      showSuccess('OTP verified');
      navigation.navigate('MPIN', {
        email: Email,
        resetMpin: true,
      });
    } catch (error: any) {
      showError(error?.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    handleForgotPassword,
    handleOTPVerify,
    handleResendOtp,
    showOtpBox,
    otp,
    setOtp,
    isVerifying,
    resendTimer,
    startResendTimer,
    isSubmittingEmail,
  };
};
