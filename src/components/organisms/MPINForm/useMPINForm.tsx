import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Buffer } from 'buffer';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '@redux/store';
import type { HomeStackParamList } from '@types/navigations';
import { HOME } from '@utils/constant';
import { showError, showSuccess } from '@utils/toast';

type MPINNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'MPIN'>;

type UseMPINFormProps = {
  email?: string;
  resetMpin?: boolean;
};

const useMPINForm = ({ email, resetMpin = false }: UseMPINFormProps = {}) => {
  const navigation = useNavigation<MPINNavigationProp>();
  const userData = useSelector((state: RootState) => state.auth.userData);

  const [userDocId, setUserDocId] = useState('');
  const [storedEncryptedMPIN, setStoredEncryptedMPIN] = useState('');
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resetMpin) {
      setLoading(false);
      return;
    }

    const userEmail = userData?.email || email;

    if (userEmail) {
      checkIfMPINExists(userEmail);
    } else {
      showError('Email does not exist!');
      setLoading(false);
    }
  }, [userData?.email, email, resetMpin]);

  const checkIfMPINExists = async (email: string) => {
    try {
      setLoading(true);
      const normalizedEmail = email.trim().toLowerCase();
      const snapshot = await firestore()
        .collection('users')
        .where('email', '==', normalizedEmail)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        setUserDocId(doc.id);

        if (data?.mpinSet && data?.mpin) {
          setIsExistingUser(true);
          setStoredEncryptedMPIN(data.mpin);
        }
      } else {
        Alert.alert('Error', 'User not found in Firestore');
      }
    } catch (error: any) {
      showError('Failed to check MPIN');
    } finally {
      setLoading(false);
    }
  };

  const encryptMPIN = (value: string) => {
    return Buffer.from(value).toString('base64');
  };

  const handleMpinInput = (text: string) => {
    setMpin(text);
    if (
      (resetMpin || !isExistingUser) &&
      confirmMpin.length === 4 &&
      text !== confirmMpin
    ) {
      setErrorMessage('MPINs do not match');
      showError('MPINs do not match');
    } else {
      setErrorMessage('');
    }
  };

  const handleConfirmInput = (text: string) => {
    setConfirmMpin(text);
    if (mpin.length === 4 && text === mpin) {
      setErrorMessage('');
    } else if (text.length === 4 && text !== mpin) {
      setErrorMessage('MPINs do not match');
      showError('MPINs do not match');
    }
  };

  const handleResetMpin = async () => {
    try {
      setLoading(true);
      if (!email) {
        showError('Email is missing');
        return;
      }
      const response = await axios.post(
        'https://64dc1112a1f9.ngrok-free.app/api/user/set-new-mpin',
        {
          email,
          newMpin: mpin,
        },
      );
      if (response?.data?.status === true) {
        showSuccess('MPIN reset successfully');
        await AsyncStorage.setItem('@mpin_setup_done', 'true');
        navigation.navigate('HomeTabs');
      }
    } catch (error: any) {
      console.log('Reset MPIN error:', error);
      showError(
        error?.response?.data?.message || 'Failed to reset MPIN. Try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (resetMpin) {
      await handleResetMpin();
      return;
    }

    try {
      setLoading(true);
      if (!userDocId) {
        showError('User document not found');
        return;
      }

      if (isExistingUser) {
        const encryptedInput = encryptMPIN(mpin);
        if (encryptedInput === storedEncryptedMPIN) {
          await AsyncStorage.setItem('@user_mpin', encryptedInput);
          navigation.navigate('HomeTabs', { screen: HOME.Home });
        } else {
          setErrorMessage('Incorrect MPIN');
        }
      } else {
        const encryptedMPIN = encryptMPIN(mpin);
        await firestore().collection('users').doc(userDocId).update({
          mpin: encryptedMPIN,
          mpinSet: true,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        await AsyncStorage.setItem('@mpin_setup_done', 'true');
        navigation.navigate('HomeTabs', { screen: HOME.Home });
      }
    } catch (error: any) {
      console.error('Error during MPIN setup:', error);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled =
    mpin.length !== 4 ||
    (!isExistingUser &&
      !resetMpin &&
      (confirmMpin.length !== 4 || mpin !== confirmMpin)) ||
    (resetMpin && (confirmMpin.length !== 4 || mpin !== confirmMpin));

  return {
    loading,
    mpin,
    confirmMpin,
    errorMessage,
    isExistingUser,
    isButtonDisabled,
    handleMpinInput,
    handleConfirmInput,
    handleSubmit,
  };
};

export default useMPINForm;
