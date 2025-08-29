import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import { getUserData, uploadToCloudinary } from '@utils/helper';
import { showSuccess } from '@utils/toast';

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  mobileNo?: string;
  profileImage?: string;
}

export const useUpdateProfile = (email: string) => {
  const [userData, setUserData] = useState<UserData>({
    email: '',
    firstName: '',
    lastName: '',
    mobileNo: '',
    profileImage: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchUserData = async () => {
    if (!email) return;
    try {
      const data = await getUserData(email);
      if (data) {
        setUserData({
          email: data.email || email,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          mobileNo: data.mobileNo || '',
          profileImage: data.profileImage || '',
        });
      }
    } catch (error) {
      console.error('[useUpdateProfile] Failed to load user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [email]);

  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo' });
      if (result.didCancel || !result.assets?.[0]) return;
      const file = result.assets[0];
      setUserData(prev => ({ ...prev, profileImage: file.uri }));
    } catch (error) {
      console.error('[useUpdateProfile] Pick image error:', error);
    }
  };

  const handleSave = async () => {
    if (!email) return;
    try {
      setSaving(true);

      let imageUrl = userData.profileImage;

      if (imageUrl && !imageUrl.startsWith('http')) {
        setLoading(true);
        imageUrl = await uploadToCloudinary({
          uri: userData.profileImage!,
          type: 'image/jpeg',
          fileName: 'profile.jpg',
        });
        setLoading(false);
      }

      const querySnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await docRef.set(
          {
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            mobileNo: userData.mobileNo || '',
            profileImage: imageUrl || '',
          },
          { merge: true },
        );
        showSuccess('Profile updated successfully!');
      } else {
      }
    } catch (error) {
      console.error('[useUpdateProfile] Save error:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    userData,
    setUserData,
    loading,
    saving,
    handlePickImage,
    handleSave,
  };
};
