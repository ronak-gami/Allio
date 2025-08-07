// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import { useSelector } from 'react-redux';
// import firestore from '@react-native-firebase/firestore';
// import useStyle from './style';
// import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// import { useTheme } from '@react-navigation/native';

// import { RootState } from '@store/index';
// import { TabParamList } from '@types/navigations';
// import Text from '@components/atoms/Text';
// import Button from '@components/atoms/Button';
// import { handleMediaDownload, handleMediaShare } from '@utils/helper';

// type Props = BottomTabScreenProps<TabParamList, 'MyQR'>;

// const MyQR: React.FC<Props> = () => {
//   const styles = useStyle();
//   const { colors } = useTheme();
//   const [qrImageUri, setQrImageUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   const userEmail = useSelector(
//     (state: RootState) => state.auth.userData?.email,
//   );

//   useEffect(() => {
//     const fetchQRCode = async () => {
//       try {
//         const snapshot = await firestore()
//           .collection('media')
//           .where('email', '==', userEmail)
//           .get();

//         if (!snapshot.empty) {
//           const doc = snapshot.docs[0];
//           const qrUrl = doc.data()?.QRCode;

//           if (qrUrl && typeof qrUrl === 'string' && qrUrl.trim() !== '') {
//             setQrImageUri(qrUrl);
//           } else {
//             console.error('No QR code found', 'QR code URL is missing.');
//           }
//         } else {
//           console.error('Not Found', 'No QR code entry for this user.');
//         }
//       } catch (error) {
//         console.error('Error fetching QR code:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userEmail) {
//       fetchQRCode();
//     }
//   }, [userEmail]);

//   const handleDownload = async () => {
//     if (!qrImageUri) return;
//     try {
//       await handleMediaDownload(qrImageUri, 'photo', 'MyQR');
//     } catch (error) {
//       console.error('Download QR error:', error);
//     }
//   };

//   const handleShare = async () => {
//     if (!qrImageUri) return;
//     try {
//       await handleMediaShare(qrImageUri, 'photo');
//     } catch (error) {
//       console.error('Share QR error:', error);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollcontainer}
//         showsVerticalScrollIndicator={false}>
//         <View style={styles.titleRow}>
//           <Text style={styles.title} type="extrabold">
//             My QR
//           </Text>
//         </View>

//         <View style={styles.cameraContainer}>
//           <View style={styles.camera}>
//             {loading ? (
//               <ActivityIndicator size="large" color={colors.primary} />
//             ) : qrImageUri ? (
//               <Image
//                 source={{ uri: qrImageUri }}
//                 style={styles.qrImage}
//                 resizeMode="contain"
//               />
//             ) : (
//               <Text type="medium" style={{ color: colors.text }}>
//                 QR Code not available.
//               </Text>
//             )}
//           </View>
//         </View>

//         <View style={styles.orContainer}>
//           <View style={styles.line} />
//           <Text style={styles.orText} type="extrabold">
//             OR
//           </Text>
//           <View style={styles.line} />
//         </View>

//         <View style={styles.buttonGroup}>
//           <Button
//             title="Download QR"
//             onPress={handleDownload}
//             bgColor={colors.primary}
//             textColor={colors.text}
//           />
//           <Button
//             title="Share QR"
//             onPress={handleShare}
//             bgColor={colors.primary}
//             textColor={colors.text}
//           />
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default MyQR;

import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import useStyle from './style';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';

import { TabParamList } from '@types/navigations';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import useMyQR from './useMyQR';

type Props = BottomTabScreenProps<TabParamList, 'MyQR'>;

const MyQR: React.FC<Props> = () => {
  const styles = useStyle();
  const { colors } = useTheme();

  const { qrImageUri, handleDownload, handleShare, states } = useMyQR();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollcontainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={styles.title} type="extrabold">
            My QR
          </Text>
        </View>

        <View style={styles.cameraContainer}>
          <View style={styles.camera}>
            {states?.loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : qrImageUri ? (
              <Image
                source={{ uri: qrImageUri }}
                style={styles.qrImage}
                resizeMode="contain"
              />
            ) : (
              <Text type="medium" style={{ color: colors.text }}>
                QR Code not available.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText} type="extrabold">
            OR
          </Text>
          <View style={styles.line} />
        </View>

        <View style={styles.buttonGroup}>
          <Button
            title="Download QR"
            onPress={handleDownload}
            bgColor={colors.primary}
            textColor={colors.text}
          />
          <Button
            title="Share QR"
            onPress={handleShare}
            bgColor={colors.primary}
            textColor={colors.text}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MyQR;
