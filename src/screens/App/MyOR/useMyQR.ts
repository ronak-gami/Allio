// src/screens/MyQR/useMyQR.ts

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import firestore from '@react-native-firebase/firestore';
import { RootState } from '@store/index';
import { handleMediaDownload, handleMediaShare } from '@utils/helper';

const useMyQR = () => {
  const [qrImageUri, setQrImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const userEmail = useSelector(
    (state: RootState) => state.auth.userData?.email,
  );
  const states = {
    loading,
  };

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const snapshot = await firestore()
          .collection('media')
          .where('email', '==', userEmail)
          .get();

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const qrUrl = doc.data()?.QRCode;

          if (qrUrl && typeof qrUrl === 'string' && qrUrl.trim() !== '') {
            setQrImageUri(qrUrl);
          } else {
            console.warn('QR code URL is missing.');
          }
        } else {
          console.warn('No QR code entry for this user.');
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchQRCode();
    }
  }, [userEmail]);

  const handleDownload = async () => {
    if (!qrImageUri) return;
    try {
      await handleMediaDownload(qrImageUri, 'photo', 'MyQR');
    } catch (error) {
      console.error('Download QR error:', error);
    }
  };

  const handleShare = async () => {
    if (!qrImageUri) return;
    try {
      await handleMediaShare(qrImageUri, 'photo');
    } catch (error) {
      console.error('Share QR error:', error);
    }
  };

  return {
    qrImageUri,
    handleDownload,
    handleShare,
    states,
  };
};

export default useMyQR;
