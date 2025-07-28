// import React, { useEffect, useState } from 'react';
// import { View, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import firestore from '@react-native-firebase/firestore';
// import { useNavigation, useTheme } from '@react-navigation/native';
// import { Buffer } from 'buffer';
// import { useStyle } from './style';
// import OTPInput from '@components/atoms/OTPInput';
// import Button from '@components/atoms/Button';
// import Text from '@components/atoms/Text';
// import { useSelector } from 'react-redux';
// import { RootState } from '@redux/store';

// const MPINForm = () => {
//   const { colors } = useTheme();
//   const styles = useStyle();
//   const navigation = useNavigation();

//   const userData = useSelector((state: RootState) => state.auth.userData);

//   const [userDocId, setUserDocId] = useState('');
//   const [storedEncryptedMPIN, setStoredEncryptedMPIN] = useState('');
//   const [mpin, setMpin] = useState('');
//   const [confirmMpin, setConfirmMpin] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isExistingUser, setIsExistingUser] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       if (userData?.email) {
//         await checkIfMPINExists(userData.email);
//       } else {
//         console.warn('No email in userData');
//         setLoading(false);
//       }
//     })();
//   }, [userData.email]);

//   const checkIfMPINExists = async (email: string) => {
//     try {
//       const normalizedEmail = email.trim().toLowerCase();
//       const snapshot = await firestore()
//         .collection('users')
//         .where('email', '==', normalizedEmail)
//         .limit(1)
//         .get();

//       if (!snapshot.empty) {
//         const doc = snapshot.docs[0];
//         const data = doc.data();

//         setUserDocId(doc.id);

//         if (data?.mpinSet === true && data?.mpin) {
//           setIsExistingUser(true);
//           setStoredEncryptedMPIN(data.mpin);
//         }
//       } else {
//         Alert.alert('Error', 'User not found in Firestore');
//       }
//     } catch (error: any) {
//       Alert.alert('Firestore Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMpinInput = (text: string) => {
//     setMpin(text);
//     if (!isExistingUser) {
//       if (confirmMpin.length === 4 && text !== confirmMpin) {
//         setErrorMessage('MPINs do not match');
//       } else {
//         setErrorMessage('');
//       }
//     }
//   };

//   const handleConfirmInput = (text: string) => {
//     setConfirmMpin(text);
//     if (mpin.length === 4 && text === mpin) {
//       setErrorMessage('');
//     } else if (text.length === 4 && text !== mpin) {
//       setErrorMessage('MPINs do not match');
//     }
//   };

//   const encryptMPIN = (value: string): string => {
//     return Buffer.from(value).toString('base64');
//   };

//   const handleSubmit = async () => {
//     try {
//       if (!userDocId) {
//         Alert.alert('Error', 'User document not found');
//         return;
//       }

//       if (isExistingUser) {
//         const encryptedInput = encryptMPIN(mpin);
//         if (encryptedInput === storedEncryptedMPIN) {
//           await AsyncStorage.setItem('@user_mpin', encryptedInput);
//           navigation.reset({
//             index: 0,
//             routes: [{ name: 'Home' as never }],
//           });
//         } else {
//           setErrorMessage('Incorrect MPIN');
//         }
//       } else {
//         const encryptedMPIN = encryptMPIN(mpin);
//         await firestore().collection('users').doc(userDocId).update({
//           mpin: encryptedMPIN,
//           mpinSet: true,
//           createdAt: firestore.FieldValue.serverTimestamp(),
//         });

//         await AsyncStorage.setItem('@mpin_setup_done', 'true');

//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'Home' as never }],
//         });
//       }
//     } catch (error: any) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const isButtonDisabled =
//     mpin.length !== 4 ||
//     (isExistingUser ? false : confirmMpin.length !== 4 || mpin !== confirmMpin);

//   if (loading) return null;

//   return (
//     <View>
//       <Text style={[styles.title, { color: colors.text }]}>
//         {isExistingUser ? 'Enter 4‑Digit MPIN' : 'Set 4‑Digit MPIN'}
//       </Text>

//       <OTPInput label="Enter MPIN" value={mpin} onChange={handleMpinInput} />

//       {!isExistingUser && (
//         <OTPInput
//           label="Confirm MPIN"
//           value={confirmMpin}
//           onChange={handleConfirmInput}
//         />
//       )}

//       {errorMessage.length > 0 && (
//         <Text style={styles.errorText}>{errorMessage}</Text>
//       )}

//       <Button
//         title={isExistingUser ? 'Enter PIN' : 'Set MPIN'}
//         onPress={handleSubmit}
//         style={[styles.button, { opacity: isButtonDisabled ? 0.5 : 1 }]}
//         bgColor={colors.primary}
//         textColor={colors.background}
//         disabled={isButtonDisabled}
//       />
//     </View>
//   );
// };

// export default MPINForm;

// src/components/molecules/MPINForm.tsx
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import OTPInput from '@components/atoms/OTPInput';
import Button from '@components/atoms/Button';
import Text from '@components/atoms/Text';
import { useStyle } from './style';
import useMPINForm from './useMPINForm';
import { height } from '@utils/helper';

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

  if (loading) return null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        marginHorizontal: height * 0.02,
      }}>
      <View style={{ flexGrow: 1 }}>
        <Text type="bold" style={[styles.title, { color: colors.text }]}>
          {isExistingUser ? 'Enter 4‑Digit MPIN' : 'Set 4‑Digit MPIN'}
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
