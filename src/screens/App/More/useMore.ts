import { useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import { setDarkMode } from '@redux/slices/ThemeSlice';
import { logout } from '@redux/slices/AuthSlice';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import { getAuth } from '@react-native-firebase/auth';
import i18n from '@assets/i18n';
import { height } from '@utils/helper';

export const settingsData = [
  { key: 'profile', title: 'Profile' },
  { key: 'friends', title: 'My Friends' },
  { key: 'theme', title: 'Theme' },
  { key: 'language', title: 'Language' },
  { key: 'delete', title: 'Delete Account' },
  { key: 'logout', title: 'Logout' },
];

const useMore = (navigation: any) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);

  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light'>(
    isDarkMode ? 'dark' : 'light',
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    i18n.language || 'en',
  );
  const [sheetType, setSheetType] = useState<
    'theme' | 'language' | 'logout' | 'delete' | null
  >(null);

  const sheetRef = useRef<any>(null);

  const originalTabBarStyle = {
    height: Platform.OS === 'ios' ? height * 0.1 : height * 0.07,
    backgroundColor: colors.primary,
  };

  const handleTabBarVisibility = (visible: boolean) => {
    // navigation.setOptions({
    //   tabBarStyle: visible ? originalTabBarStyle : { display: 'none' },
    // });
  };

  const handleDeleteProfile = async () => {
    try {
      const authInstance = getAuth();
      const user = authInstance.currentUser;
      if (user) {
        await firestore().collection('users').doc(user.uid).delete();
        await user.delete();
        dispatch(logout());
        sheetRef.current?.close();
      }
    } catch (error) {
      console.error('Delete account error:', error);
      crashlytics().recordError(error as Error);
    }
  };

  const handleLogout = async () => {
    try {
      const authInstance = getAuth();
      const currentUser = authInstance.currentUser;
      if (currentUser) {
        await firestore().collection('users').doc(currentUser.uid).update({
          fcmToken: firestore.FieldValue.delete(),
          fcmUpdatedAt: firestore.FieldValue.delete(),
        });
        await authInstance.signOut();
        dispatch(logout());
        sheetRef.current?.close();
      }
    } catch (error) {
      console.error('Logout Error:', error);
      crashlytics().recordError(error as Error);
    }
  };

  const handleApply = () => {
    if (sheetType === 'theme') {
      dispatch(setDarkMode(selectedTheme === 'dark'));
    } else if (sheetType === 'language') {
      i18n.changeLanguage(selectedLanguage);
    }
    sheetRef.current?.close();
  };

  const handleSheetClose = () => {
    navigation.setOptions({
      tabBarStyle: originalTabBarStyle,
    });
    sheetRef.current?.close();
  };

  const handleItemPress = (key: string) => {
    setSheetType(key as any);
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
    sheetRef.current?.expand();
  };

  const getSheetTitle = () => {
    switch (sheetType) {
      case 'theme':
        return 'Select Theme';
      case 'language':
        return 'Select Language';
      case 'logout':
        return 'Confirm Logout';
      case 'delete':
        return 'Delete Account';
      default:
        return '';
    }
  };

  const getButtonTitle = () => {
    switch (sheetType) {
      case 'theme':
      case 'language':
        return 'Apply';
      case 'logout':
        return 'Logout';
      case 'delete':
        return 'Delete';
      default:
        return '';
    }
  };

  const handleButtonPress = () => {
    if (sheetType === 'logout') {
      return handleLogout;
    }
    if (sheetType === 'delete') {
      return handleDeleteProfile;
    }
    return handleApply;
  };

  return {
    styles: { originalTabBarStyle },
    sheetRef,
    selectedTheme,
    setSelectedTheme,
    selectedLanguage,
    setSelectedLanguage,
    sheetType,
    setSheetType,
    handleTabBarVisibility,
    handleDeleteProfile,
    handleLogout,
    handleApply,
    handleSheetClose,
    handleItemPress,
    getSheetTitle,
    getButtonTitle,
    handleButtonPress,
  };
};

export default useMore;
