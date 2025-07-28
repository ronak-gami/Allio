// import React, { useEffect, useState } from 'react';
// import { View, Text, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import firestore from '@react-native-firebase/firestore';
// import { useNavigation, useTheme } from '@react-navigation/native';
// import { Buffer } from 'buffer';
// import { useStyle } from './style';
// import MPINForm from '../../components/molecules/MPINForm';
// import { useSelector } from 'react-redux';
// import { RootState } from '@redux/store';
// import { s } from 'react-native-size-matters';

// const MPINSetupScreen = () => {
//   const { colors } = useTheme();
//   const styles = useStyle();
//   const navigation = useNavigation();

//   const userData = useSelector((state: RootState) => state.auth.userData);
//   const [userId, setUserId] = useState('');
//   const [userDocId, setUserDocId] = useState('');
//   const [mpin, setMpin] = useState('');
//   const [confirmMpin, setConfirmMpin] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isExistingUser, setIsExistingUser] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       console.log("hello")
//       if (true) {

//         if (userData?.email) {
//           console.log('Hello');
//           await checkIfMPINExists(userData.email);
//         } else {
//           console.warn('No user email found in Redux');
//           setLoading(false);
//         }
//       }  else {
//         Alert.alert('Error', 'User ID not found');
//         setLoading(false);
//       }
//     })();
//   }, [userData.email]);

//   const checkIfMPINExists = async (email: string) => {
//     try {
//       const normalizedEmail = email.trim().toLowerCase();
//       console.log('Hello');

//       const snapshot = await firestore()
//         .collection('users')
//         .where('email', '==', normalizedEmail)
//         .limit(1)
//         .get();

//       console.log(snapshot.docs.length, 'user document(s) found');

//       if (!snapshot.empty) {
//         const doc = snapshot.docs[0];
//         const data = doc.data();

//         console.log('User document found:', doc.id, data);

//         setUserDocId(doc.id);

//         if (data?.mpinSet === true && data?.mpin) {
//           setIsExistingUser(true);
//         } else {
//           setIsExistingUser(false);
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
//     if (confirmMpin.length === 4 && text !== confirmMpin) {
//       setErrorMessage('MPINs do not match');
//     } else {
//       setErrorMessage('');
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
//         Alert.alert('Error', 'User document not found for update');
//         return;
//       }

//       const encryptedMPIN = encryptMPIN(mpin);

//       await firestore().collection('users').doc(userDocId).update({
//         uid: userId,
//         mpin: encryptedMPIN,
//         mpinSet: true,
//         createdAt: firestore.FieldValue.serverTimestamp(),
//       });

//       await AsyncStorage.setItem('@mpin_setup_done', 'true');
//       await AsyncStorage.setItem('@user_mpin', encryptedMPIN);

//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Home' as never }],
//       });
//     } catch (error: any) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const isButtonDisabled =
//     mpin.length !== 4 || confirmMpin.length !== 4 || mpin !== confirmMpin;

//   if (loading) return null;

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <Text style={[styles.title, { color: colors.text }]}>
//         {isExistingUser ? 'Enter 4‑Digit MPIN' : 'Set 4‑Digit MPIN'}
//       </Text>

//       <MPINForm
//         mpin={mpin}
//         confirmMpin={confirmMpin}
//         onMpinChange={handleMpinInput}
//         onConfirmChange={handleConfirmInput}
//         onSubmit={handleSubmit}
//         errorMessage={errorMessage}
//         disabled={isButtonDisabled}
//         colors={colors}
//         styles={styles}
//       />
//     </View>
//   );
// };

// export default MPINSetupScreen;

// import React, { useEffect, useState } from 'react';
// import { View, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import firestore from '@react-native-firebase/firestore';
// import { useNavigation, useTheme } from '@react-navigation/native';
// import { Buffer } from 'buffer';
// import { useStyle } from './style';
// import MPINForm from '../../components/molecules/MPINForm';
// import { useSelector } from 'react-redux';
// import { RootState } from '@redux/store';
// import Text from '@components/atoms/Text';

// const MPINSetupScreen = () => {
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
//         console.log(data, 'User document found:');

//         setUserDocId(doc.id);

//         if (data?.mpinSet === true && data?.mpin) {
//           setIsExistingUser(true);
//           setStoredEncryptedMPIN(data.mpin); // store for later check
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
//         // User already has MPIN, validate it
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
//         // New MPIN setup
//         const encryptedMPIN = encryptMPIN(mpin);
//         await firestore().collection('users').doc(userDocId).update({
//           uid: userId,
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
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <Text style={[styles.title, { color: colors.text }]}>
//         {isExistingUser ? 'Enter 4‑Digit MPIN' : 'Set 4‑Digit MPIN'}
//       </Text>

//       <MPINForm
//         mpin={mpin}
//         confirmMpin={confirmMpin}
//         onMpinChange={handleMpinInput}
//         onConfirmChange={handleConfirmInput}
//         onSubmit={handleSubmit}
//         errorMessage={errorMessage}
//         disabled={isButtonDisabled}
//         colors={colors}
//         styles={styles}
//         isConfirmVisible={!isExistingUser}
//       />
//     </View>
//   );
// };

// export default MPINSetupScreen;

// import React from 'react';
// import { View } from 'react-native';
// import { useTheme } from '@react-navigation/native';
// import useStyle from './style';
// import MPINForm from '@components/organisms/MPINForm';

// const MPINSetupScreen = () => {
//   const { colors } = useTheme();
//   const styles = useStyle();

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <MPINForm />
//     </View>
//   );
// };

// export default MPINSetupScreen;
import React from 'react';
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import useStyle from './style';
import MPINForm from '@components/organisms/MPINForm';
import { ICONS } from '@assets/index';

const MPINSetupScreen = () => {
  const { colors } = useTheme();
  const styles = useStyle();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      <ScrollView
        contentContainerStyle={{ backgroundColor: colors.background, flex: 1 }}
        keyboardShouldPersistTaps="handled">
        <View style={styles.iconWrapper}>
          <Image
            source={ICONS.mpinSecure}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <MPINForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MPINSetupScreen;
