import { useState } from 'react';
import { showError, showSuccess } from '@utils/toast';
import { checkUserExistsByEmail } from '@utils/helper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '@utils/constant';

interface useForgotPasswordProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useForgotPassword: React.FC<useForgotPasswordProps> = ({
  setLoading,
}) => {
  const navigation = useNavigation();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [Email, setEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(56);

  const startResendTimer = () => {
    setResendTimer(59);
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
      console.log('API CALLING');
      setIsSubmittingEmail(true);
      const userExists = await checkUserExistsByEmail(values.email);
      if (!userExists) {
        showError('No user found with this email.');
        return;
      }
      console.log(values.email);
      setEmail(values.email);
      console.log('API START');
      const response = await axios.post(`${BASE_URL}/send-otp`, {
        email: values.email,
      });
      console.log('response: ', response?.data);
      if (response?.data?.status === true) {
        setShowOtpBox(true);
        showSuccess('OTP sent to your email');
        startResendTimer();
      }
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Failed to send reset code');
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    console.log('handleResendOtp function called');
    try {
      const response = await axios.post(`${BASE_URL}/send-otp`, {
        email: Email,
      });
      if (response?.data?.status === true) {
        showSuccess('OTP resent to your email');
        startResendTimer();
      }
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (values: { email: string }) => {
    try {
      setIsVerifying(true);
      const response = await axios.post(`${BASE_URL}/validate-otp`, {
        email: Email,
        otp: otp,
      });

      if (response?.data?.status === true) {
        showSuccess('OTP verified');
        navigation.navigate('MPIN', {
          email: Email,
          resetMpin: true,
        });
      }
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
