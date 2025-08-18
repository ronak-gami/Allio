import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCameraPermission } from 'react-native-vision-camera';
import firestore from '@react-native-firebase/firestore';

import { RootState } from '@redux/store';
import useValidation from '@utils/validationSchema';
import { checkUserExistsByEmail } from '@utils/helper';
import { HomeNavigationProp } from '@types/navigations';
import { HOME } from '@utils/constant';
import api from '@api/index';

const useScanQR = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { requestPermission } = useCameraPermission();
  const { emailOnlyValidationSchema } = useValidation();
  const userData = useSelector((state: RootState) => state.auth.userData);

  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [torchOn, setTorchOn] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await requestPermission();
    })();
  }, [requestPermission]);

  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setEmailError('');
    }, []),
  );

  const states = {
    loading,
    setLoading,
    torchOn,
    setTorchOn,
    email,
    setEmail,
  };

  const toggleTorch = () => {
    setTorchOn(prev => !prev);
  };

  const handleOpenMyQR = async () => {
    setLoading(true);
    try {
      const snapshot = await firestore()
        .collection('media')
        .where('email', '==', userData?.email)
        .get();

      let qrCodeUrl = null;

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        qrCodeUrl = doc.data()?.QRCode;
      }

      if (
        qrCodeUrl &&
        typeof qrCodeUrl === 'string' &&
        qrCodeUrl.trim() !== ''
      ) {
        navigation.navigate(HOME.MyQR);
      } else {
        const qrRes = await api.QRCODE.generate({
          data: { email: userData?.email },
        });

        if (qrRes?.data?.success) {
          navigation.navigate(HOME.MyQR);
        } else {
        }
      }
    } catch (error) {
      console.error('QR code Firestore error:', error);
    } finally {
      setLoading(false);
    }
  };

  const externalSubmitHandler = async () => {
    setEmailError('');

    try {
      await emailOnlyValidationSchema.validate({ email });

      const exists = await checkUserExistsByEmail(email);
      if (!exists) {
        setEmailError('User with this email does not exist');
        return;
      }

      navigation.navigate(HOME.Profile, { email: email });
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        setEmailError(err.message);
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  const onQRCodeScanned = async (value: string) => {
    setEmail(value);
    try {
      await emailOnlyValidationSchema.validate({ email: value });
      const exists = await checkUserExistsByEmail(value);
      if (!exists) {
        setEmailError('User with this email does not exist');
        return;
      }
      navigation.navigate('Profile', {
        email: value,
      });
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        setEmailError(err.message);
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  return {
    emailError,
    toggleTorch,
    handleOpenMyQR,
    externalSubmitHandler,
    onQRCodeScanned,
    states,
  };
};

export default useScanQR;
