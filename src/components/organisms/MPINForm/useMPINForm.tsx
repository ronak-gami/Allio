import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Buffer } from 'buffer';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

const useMPINForm = () => {
  const navigation = useNavigation();
  const userData = useSelector((state: RootState) => state.auth.userData);

  const [userDocId, setUserDocId] = useState('');
  const [storedEncryptedMPIN, setStoredEncryptedMPIN] = useState('');
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('userData in useMPINForm:', userData);
    if (userData?.email) {
      checkIfMPINExists(userData.email );
    } else {
      console.warn('No email in userData');
      setLoading(false);
    }
  }, [userData?.email]);

  const checkIfMPINExists = async (email: string) => {
    try {
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
      Alert.alert('Firestore Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const encryptMPIN = (value: string) => {
    return Buffer.from(value).toString('base64');
  };

  const handleMpinInput = (text: string) => {
    setMpin(text);
    if (!isExistingUser && confirmMpin.length === 4 && text !== confirmMpin) {
      setErrorMessage('MPINs do not match');
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
    }
  };

  const handleSubmit = async () => {
    try {
      if (!userDocId) {
        Alert.alert('Error', 'User document not found');
        return;
      }

      if (isExistingUser) {
        const encryptedInput = encryptMPIN(mpin);
        if (encryptedInput === storedEncryptedMPIN) {
          await AsyncStorage.setItem('@user_mpin', encryptedInput);
          navigation.replace('HomeTabs');

          console.log('ca;;;');
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
         navigation.replace('HomeTabs');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const isButtonDisabled =
    mpin.length !== 4 ||
    (!isExistingUser && (confirmMpin.length !== 4 || mpin !== confirmMpin));

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
