// import React, { useRef, useState, useEffect } from 'react';
// import { View, TouchableOpacity, Platform } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// import { useFocusEffect, useTheme } from '@react-navigation/native';
// import {
//   CustomFlatList,
//   LanguageOrganism,
//   LogoutOrganism,
//   Text,
//   ThemeOrganism,
// } from '@components/index';
// import useStyle from './style';
// import {
//   CustomBottomSheetModal,
//   BottomSheetWrapper,
// } from '@components/molecules/CustomBottomSheetModal';
// import { logout } from '@redux/slices/AuthSlice';
// import firestore from '@react-native-firebase/firestore';
// import crashlytics from '@react-native-firebase/crashlytics';
// import { getAuth } from '@react-native-firebase/auth';
// import { setDarkMode } from '@redux/slices/ThemeSlice';
// import i18n from '@assets/i18n';
// import { TabParamList } from '@types/navigations';
// import { height } from '@utils/helper';
// import DeleteProfileOrganism from '@components/organisms/Deleteorganism';

// type Props = BottomTabScreenProps<TabParamList, 'More'>;

// const settingsData = [
//   { key: 'profile', title: 'Profile' },
//   { key: 'friends', title: 'My Friends' },
//   { key: 'theme', title: 'Theme' },
//   { key: 'language', title: 'Language' },
//   { key: 'delete', title: 'Delete Account' },
//   { key: 'logout', title: 'Logout' },
// ];

// const More: React.FC<Props> = ({ navigation }) => {
//   const styles = useStyle();
//   const dispatch = useDispatch();
//   const { colors } = useTheme();
//   const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);

//   const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light'>(
//     isDarkMode ? 'dark' : 'light',
//   );
//   const [selectedLanguage, setSelectedLanguage] = useState<string>(
//     i18n.language || 'en' || 'hi' || 'gu',
//   );
//   const [sheetType, setSheetType] = useState<
//     'theme' | 'language' | 'logout' | 'delete' | null
//   >(null);

//   const sheetRef = useRef<any>(null);

//   const originalTabBarStyle = {
//     height: Platform.OS === 'ios' ? height * 0.1 : height * 0.07,
//     backgroundColor: colors.primary,
//   };

//   const handleTabBarVisibility = (visible: boolean) => {
//     navigation.setOptions({
//       tabBarStyle: visible ? originalTabBarStyle : { display: 'none' },
//     });
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       navigation.setOptions({
//         tabBarStyle: originalTabBarStyle,
//       });

//       return () => {
//         navigation.setOptions({
//           tabBarStyle: originalTabBarStyle,
//         });
//       };
//     }, [navigation, colors.primary]),
//   );
//   const handleDeleteProfile = async () => {
//     try {
//       const authInstance = getAuth();
//       const user = authInstance.currentUser;

//       if (user) {
//         // Remove from Firestore
//         await firestore().collection('users').doc(user.uid).delete();

//         // Optional: delete other user-specific data e.g. subcollections

//         // Delete the user account in Firebase Auth (user must have signed in recently)
//         await user.delete();

//         dispatch(logout());
//         sheetRef.current?.dismiss();
//       }
//     } catch (error) {
//       console.error('Delete account error:', error);
//       crashlytics().recordError(error as Error);
//     }
//   };

//   const handleItemPress = (key: string) => {
//     if (key === 'theme') {
//       setSheetType('theme');
//       sheetRef.current?.present();
//     } else if (key === 'language') {
//       setSheetType('language');
//       sheetRef.current?.present();
//     } else if (key === 'logout') {
//       setSheetType('logout');
//       sheetRef.current?.present();
//     } else if (key === 'delete') {
//       setSheetType('delete');
//       sheetRef.current?.present();
//     }
//     // handle other keys as needed
//   };

//   const handleLogout = async () => {
//     try {
//       const authInstance = getAuth();
//       const currentUser = authInstance.currentUser;

//       if (currentUser) {
//         await firestore().collection('users').doc(currentUser.uid).update({
//           fcmToken: firestore.FieldValue.delete(),
//           fcmUpdatedAt: firestore.FieldValue.delete(),
//         });

//         await authInstance.signOut();
//         dispatch(logout());
//         sheetRef.current?.dismiss();
//       }
//     } catch (error) {
//       console.error('Logout Error:', error);
//       crashlytics().recordError(error as Error);
//     }
//   };

//   const handleApply = () => {
//     if (sheetType === 'theme') {
//       dispatch(setDarkMode(selectedTheme === 'dark'));
//     } else if (sheetType === 'language') {
//       i18n.changeLanguage(selectedLanguage);
//     }
//     sheetRef.current?.dismiss();
//   };

//   const handleSheetClose = () => {
//     sheetRef.current?.dismiss();
//     // Small delay to ensure smooth animation
//     setTimeout(() => {
//       navigation.setOptions({
//         tabBarStyle: originalTabBarStyle,
//       });
//     }, 10);
//   };

//   const getSheetTitle = () => {
//     switch (sheetType) {
//       case 'theme':
//         return 'Select Theme';
//       case 'language':
//         return 'Select Language';
//       case 'logout':
//         return 'Confirm Logout';
//       case 'delete':
//         return 'Delete Account';
//       default:
//         return '';
//     }
//   };
//   const getButtonTitle = () => {
//     switch (sheetType) {
//       case 'theme':
//       case 'language':
//         return 'Apply';
//       case 'logout':
//         return 'Logout';
//       case 'delete':
//         return 'Delete';
//       default:
//         return '';
//     }
//   };

//   const handleButtonPress = () => {
//     if (sheetType === 'logout') {
//       return handleLogout;
//     }
//     if (sheetType === 'delete') {
//       return handleDeleteProfile;
//     }
//     return handleApply;
//   };

//   const renderItem = ({ item }: { item: { key: string; title: string } }) => (
//     <TouchableOpacity
//       style={styles.item}
//       onPress={() => handleItemPress(item.key)}>
//       <Text style={styles.itemText} type="semibold">
//         {item.title}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderSheetContent = () => {
//     switch (sheetType) {
//       case 'theme':
//         return (
//           <ThemeOrganism
//             selectedTheme={selectedTheme}
//             onSelect={setSelectedTheme}
//           />
//         );
//       case 'language':
//         return (
//           <LanguageOrganism
//             selectedLanguage={selectedLanguage}
//             onSelect={setSelectedLanguage}
//           />
//         );
//       case 'logout':
//         return <LogoutOrganism onConfirm={handleLogout} />;
//       case 'delete':
//         return <DeleteProfileOrganism onConfirm={handleDeleteProfile} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <BottomSheetWrapper>
//       <View style={styles.container}>
//         <Text style={styles.title} type="BOLD">
//           More.More
//         </Text>
//         <CustomFlatList data={settingsData} renderItem={renderItem} />

//         <CustomBottomSheetModal
//           ref={sheetRef}
//           title={getSheetTitle()}
//           buttonTitle={getButtonTitle()}
//           onButtonPress={handleButtonPress()}
//           onClose={handleSheetClose}
//           onTabBarVisibilityChange={handleTabBarVisibility}
//           enableBackdrop={true}
//           enableHandle={true}
//           backdropOpacity={0.7}>
//           {renderSheetContent()}
//         </CustomBottomSheetModal>
//       </View>
//     </BottomSheetWrapper>
//   );
// };

// export default More;
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CustomFlatList,
  LanguageOrganism,
  LogoutOrganism,
  Text,
  ThemeOrganism,
} from '@components/index';
import useStyle from './style';
import {
  CustomBottomSheetModal,
  BottomSheetWrapper,
} from '@components/molecules/CustomBottomSheetModal';
import DeleteProfileOrganism from '@components/organisms/Deleteorganism';
import useMore, { settingsData } from './useMore';
import { TabParamList } from '@types/navigations';

type Props = BottomTabScreenProps<TabParamList, 'More'>;

const More: React.FC<Props> = ({ navigation }) => {
  const styles = useStyle();
  const more = useMore(navigation);

  const renderItem = ({ item }: { item: { key: string; title: string } }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => more.handleItemPress(item.key)}>
      <Text style={styles.itemText} type="semibold">
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderSheetContent = () => {
    switch (more.sheetType) {
      case 'theme':
        return (
          <ThemeOrganism
            selectedTheme={more.selectedTheme}
            onSelect={more.setSelectedTheme}
          />
        );
      case 'language':
        return (
          <LanguageOrganism
            selectedLanguage={more.selectedLanguage}
            onSelect={more.setSelectedLanguage}
          />
        );
      case 'logout':
        return <LogoutOrganism onConfirm={more.handleLogout} />;
      case 'delete':
        return <DeleteProfileOrganism onConfirm={more.handleDeleteProfile} />;
      default:
        return null;
    }
  };

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <Text style={styles.title} type="BOLD">
          More.More
        </Text>
        <CustomFlatList data={settingsData} renderItem={renderItem} />

        <CustomBottomSheetModal
          ref={more.sheetRef}
          title={more.getSheetTitle()}
          buttonTitle={more.getButtonTitle()}
          onButtonPress={more.handleButtonPress()}
          onClose={more.handleSheetClose}
          onTabBarVisibilityChange={more.handleTabBarVisibility}
          enableBackdrop={true}
          enableHandle={true}
          backdropOpacity={0.7}>
          {renderSheetContent()}
        </CustomBottomSheetModal>
      </View>
    </BottomSheetWrapper>
  );
};

export default More;
