// import React from 'react';
// import { View, TouchableOpacity } from 'react-native';
// import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// import {
//   CustomFlatList,
//   LanguageOrganism,
//   Text,
//   ThemeOrganism,
//   DeleteProfileOrganism,
//   LogoutOrganism,
//   CustomBottomSheetModal,
// } from '@components/index';
// import useStyle from './style';
// import { BottomSheetWrapper } from '@components/molecules/CustomBottomSheetModal';
// import useMore from './useMore';
// import { TabParamList } from '@types/navigations';
// import { settingsData } from '@utils/constant';

// type Props = BottomTabScreenProps<TabParamList, 'More'>;

// const More: React.FC<Props> = ({ navigation }) => {
//   const styles = useStyle();
//   const more = useMore(navigation);
//   const { states } = more;

//   const renderItem = ({ item }: { item: { key: string; title: string } }) => (
//     <TouchableOpacity
//       style={styles.item}
//       onPress={() => more.handleItemPress(item.key)}>
//       <Text style={styles.itemText} type="semibold">
//         {item.title}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderSheetContent = () => {
//     switch (states.sheetType) {
//       case 'theme':
//         return (
//           <ThemeOrganism
//             selectedTheme={states.selectedTheme}
//             onSelect={states.setSelectedTheme}
//           />
//         );
//       case 'language':
//         return (
//           <LanguageOrganism
//             selectedLanguage={states.selectedLanguage}
//             onSelect={states.setSelectedLanguage}
//           />
//         );
//       case 'logout':
//         return <LogoutOrganism onConfirm={more.handleLogout} />;
//       case 'delete':
//         return <DeleteProfileOrganism onConfirm={more.handleDeleteProfile} />;
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
//           ref={states.sheetRef}
//           title={more.getSheetTitle()}
//           buttonTitle={more.getButtonTitle()}
//           onButtonPress={more.handleButtonPress()}
//           onClose={more.handleSheetClose}
//           onTabBarVisibilityChange={more.handleTabBarVisibility}
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
// import React, { useState, useCallback } from 'react';
// import { View, TouchableOpacity } from 'react-native';
// import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// import {
//   CustomFlatList,
//   LanguageOrganism,
//   Text,
//   ThemeOrganism,
//   DeleteProfileOrganism,
//   LogoutOrganism,
// } from '@components/index';
// import useStyle from './style';
// import { useDispatch, useSelector } from 'react-redux';
// import { setDarkMode } from '@redux/slices/ThemeSlice';
// import { logout } from '@redux/slices/AuthSlice';
// import i18n from '@assets/i18n';
// import { getAuth } from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import crashlytics from '@react-native-firebase/crashlytics';
// import { TabParamList } from '@types/navigations';
// import { settingsData } from '@utils/constant';
// import { useBottomSheet } from '../../../context/BottomSheetContext';

// type Props = BottomTabScreenProps<TabParamList, 'More'>;

// const More: React.FC<Props> = ({ navigation }) => {
//   const styles = useStyle();
//   const dispatch = useDispatch();
//   const { showBottomSheet, hideBottomSheet } = useBottomSheet();
//   const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);
//   const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light'>(
//     isDarkMode ? 'dark' : 'light',
//   );
//   const [selectedLanguage, setSelectedLanguage] = useState<string>(
//     i18n.language || 'en',
//   );

//   // --- Organism handlers ---
//   const handleThemeApply = () => {
//     dispatch(setDarkMode(selectedTheme === 'dark'));
//     hideBottomSheet();
//   };

//   const handleLanguageApply = () => {
//     i18n.changeLanguage(selectedLanguage);
//     hideBottomSheet();
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
//         hideBottomSheet();
//       }
//     } catch (error) {
//       console.error('Logout Error:', error);
//       crashlytics().recordError(error as Error);
//     }
//   };

//   const handleDeleteProfile = async () => {
//     try {
//       const authInstance = getAuth();
//       const user = authInstance.currentUser;
//       if (user) {
//         await firestore().collection('users').doc(user.uid).delete();
//         await user.delete();
//         dispatch(logout());
//         hideBottomSheet();
//       }
//     } catch (error) {
//       console.error('Delete account error:', error);
//       crashlytics().recordError(error as Error);
//     }
//   };

//   // --- Open bottom sheet with correct organism ---
//   const handleItemPress = useCallback(
//     (key: string) => {
//       switch (key) {
//         case 'theme':
//           showBottomSheet({
//             title: 'Select Theme',
//             content: (
//               <ThemeOrganism
//                 selectedTheme={selectedTheme}
//                 onSelect={setSelectedTheme}
//               />
//             ),
//             buttons: [
//               {
//                 title: 'Apply',
//                 onPress: handleThemeApply,
//               },
//             ],
//             showCloseButton: true,
//             snapPoints: ['40%'],
//           });
//           break;
//         case 'language':
//           showBottomSheet({
//             title: 'Select Language',
//             content: (
//               <LanguageOrganism
//                 selectedLanguage={selectedLanguage}
//                 onSelect={setSelectedLanguage}
//               />
//             ),
//             buttons: [
//               {
//                 title: 'Apply',
//                 onPress: handleLanguageApply,
//               },
//             ],
//             showCloseButton: true,
//             snapPoints: ['40%'],
//           });
//           break;
//         case 'logout':
//           showBottomSheet({
//             title: 'Confirm Logout',
//             content: <LogoutOrganism onConfirm={handleLogout} />,
//             buttons: [
//               {
//                 title: 'Logout',
//                 onPress: handleLogout,
//                 variant: 'primary',
//               },
//             ],
//             showCloseButton: true,
//             snapPoints: ['30%'],
//           });
//           break;
//         case 'delete':
//           showBottomSheet({
//             title: 'Delete Account',
//             content: <DeleteProfileOrganism onConfirm={handleDeleteProfile} />,
//             buttons: [
//               {
//                 title: 'Delete',
//                 onPress: handleDeleteProfile,
//                 variant: 'primary',
//               },
//             ],
//             showCloseButton: true,
//             snapPoints: ['30%'],
//           });
//           break;
//         default:
//           break;
//       }
//     },
//     [
//       showBottomSheet,
//       selectedTheme,
//       setSelectedTheme,
//       selectedLanguage,
//       setSelectedLanguage,
//       handleThemeApply,
//       handleLanguageApply,
//       handleLogout,
//       handleDeleteProfile,
//     ],
//   );

//   const renderItem = ({ item }: { item: { key: string; title: string } }) => (
//     <TouchableOpacity
//       style={styles.item}
//       onPress={() => handleItemPress(item.key)}>
//       <Text style={styles.itemText} type="semibold">
//         {item.title}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title} type="BOLD">
//         More.More
//       </Text>
//       <CustomFlatList data={settingsData} renderItem={renderItem} />
//       {/* GlobalBottomSheet is already provided by your context/provider at app root */}
//     </View>
//   );
// };

// export default More;

// import React, { useState, useCallback } from 'react';
// import { View, TouchableOpacity } from 'react-native';
// import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// import {
//   CustomFlatList,
//   LanguageOrganism,
//   Text,
//   ThemeOrganism,
//   DeleteProfileOrganism,
//   LogoutOrganism,
// } from '@components/index';

// import { useDispatch, useSelector } from 'react-redux';
// import { setDarkMode } from '@redux/slices/ThemeSlice';
// import { logout } from '@redux/slices/AuthSlice';
// import i18n from '@assets/i18n';
// import { getAuth } from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import crashlytics from '@react-native-firebase/crashlytics';
// import { TabParamList } from '@types/navigations';
// import { settingsData } from '@utils/constant';

// import { useBottomSheet } from '../../../context/BottomSheetContext';
// import useStyle from './style';
// type Props = BottomTabScreenProps<TabParamList, 'More'>;

// const More: React.FC<Props> = () => {
//   const styles = useStyle();
//   const dispatch = useDispatch();
//   const { showBottomSheet, hideBottomSheet } = useBottomSheet();
//   const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);

//   // Controlled state for theme and language
//   const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light'>(
//     isDarkMode ? 'dark' : 'light',
//   );
//   const [selectedLanguage, setSelectedLanguage] = useState<string>(
//     i18n.language || 'en' || 'hi' || 'gu',
//   );

//   // --- Organism handlers ---
//   const handleThemeApply = useCallback(() => {
//     dispatch(setDarkMode(selectedTheme === 'dark'));
//     console.log('Theme applied:', selectedTheme);
//     hideBottomSheet();
//   }, [dispatch, selectedTheme, hideBottomSheet]);

//   const handleLanguageApply = useCallback(() => {
//     i18n.changeLanguage(selectedLanguage);
//     console.log('Language applied:', selectedLanguage);
//     hideBottomSheet();
//   }, [selectedLanguage, hideBottomSheet]);

//   const handleLogout = useCallback(async () => {
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
//         hideBottomSheet();
//       }
//     } catch (error) {
//       console.error('Logout Error:', error);
//       crashlytics().recordError(error as Error);
//     }
//   }, [dispatch, hideBottomSheet]);

//   const handleDeleteProfile = useCallback(async () => {
//     try {
//       const authInstance = getAuth();
//       const user = authInstance.currentUser;
//       if (user) {
//         await firestore().collection('users').doc(user.uid).delete();
//         await user.delete();
//         dispatch(logout());
//         hideBottomSheet();
//       }
//     } catch (error) {
//       console.error('Delete account error:', error);
//       crashlytics().recordError(error as Error);
//     }
//   }, [dispatch, hideBottomSheet]);

//   // --- Open bottom sheet with correct organism ---
//   const handleItemPress = (key: string) => {
//     switch (key) {
//       case 'theme':
//         showBottomSheet({
//           title: 'Select Theme',
//           content: (
//             <ThemeOrganism
//               selectedTheme={selectedTheme}
//               onSelect={setSelectedTheme}
//             />
//           ),
//           buttons: [
//             {
//               title: 'Apply',
//               onPress: handleThemeApply,
//             },
//           ],
//           showCloseButton: true,
//           // snapPoints: ['40%'],
//         });
//         break;
//       case 'language':
//         showBottomSheet({
//           title: 'Select Language',
//           content: (
//             <LanguageOrganism
//               selectedLanguage={selectedLanguage}
//               onSelect={handleLanguageApply}
//             />
//           ),
//           buttons: [
//             {
//               title: 'Apply',
//               onPress: handleLanguageApply,
//             },
//           ],
//           showCloseButton: true,
//           snapPoints: ['40%'],
//         });
//         break;
//       case 'logout':
//         showBottomSheet({
//           title: 'Confirm Logout',
//           content: <LogoutOrganism onConfirm={handleLogout} />,
//           buttons: [
//             {
//               title: 'Logout',
//               onPress: handleLogout,
//               variant: 'primary',
//             },
//           ],
//           showCloseButton: true,
//           snapPoints: ['30%'],
//         });
//         break;
//       case 'delete':
//         showBottomSheet({
//           title: 'Delete Account',
//           content: <DeleteProfileOrganism onConfirm={handleDeleteProfile} />,
//           buttons: [
//             {
//               title: 'Delete',
//               onPress: handleDeleteProfile,
//               variant: 'primary',
//             },
//           ],
//           showCloseButton: true,
//           snapPoints: ['30%'],
//         });
//         break;
//       default:
//         break;
//     }
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

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title} type="BOLD">
//         More.More
//       </Text>
//       <CustomFlatList data={settingsData} renderItem={renderItem} />
//       {/* GlobalBottomSheet is already provided by your context/provider at app root */}
//     </View>
//   );
// };

// export default More;

//thisis final code
// import React, { useState, useCallback } from 'react';
// import { View, TouchableOpacity } from 'react-native';
// import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// import {
//   CustomFlatList,
//   LanguageOrganism,
//   Text,
//   ThemeOrganism,
//   DeleteProfileOrganism,
//   LogoutOrganism,
// } from '@components/index';

// import { useDispatch, useSelector } from 'react-redux';
// import { setDarkMode } from '@redux/slices/ThemeSlice';
// import { logout } from '@redux/slices/AuthSlice';
// import i18n from '@assets/i18n';
// import { getAuth } from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import crashlytics from '@react-native-firebase/crashlytics';
// import { TabParamList } from '@types/navigations';
// import { settingsData } from '@utils/constant';

// import { useBottomSheet } from '../../../context/BottomSheetContext';
// import useStyle from './style';

// type Props = BottomTabScreenProps<TabParamList, 'More'>;

// const More: React.FC<Props> = ({ navigation }) => {
//   const styles = useStyle();
//   const dispatch = useDispatch();
//   const { showBottomSheet, hideBottomSheet } = useBottomSheet();
//   const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);

//   // Controlled state for theme and language
//   const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light'>(
//     isDarkMode ? 'dark' : 'light',
//   );
//   const [selectedLanguage, setSelectedLanguage] = useState<string>(
//     i18n.language || 'en',
//   );

//   // --- Theme handlers ---
//   const handleThemeSelect = useCallback((theme: string) => {
//     setSelectedTheme(theme as 'dark' | 'light');
//   }, []);

//   const handleThemeApply = useCallback(() => {
//     dispatch(setDarkMode(selectedTheme === 'dark'));
//     console.log('Theme applied:', selectedTheme);
//     hideBottomSheet();
//   }, [dispatch, selectedTheme, hideBottomSheet]);

//   // --- Language handlers ---
//   const handleLanguageSelect = useCallback((language: string) => {
//     setSelectedLanguage(language);
//   }, []);

//   const handleLanguageApply = useCallback(() => {
//     i18n.changeLanguage(selectedLanguage);
//     console.log('Language applied:', selectedLanguage);
//     hideBottomSheet();
//   }, [selectedLanguage, hideBottomSheet]);

//   // --- Auth handlers ---
//   const handleLogout = useCallback(async () => {
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
//         hideBottomSheet();
//       }
//     } catch (error) {
//       console.error('Logout Error:', error);
//       crashlytics().recordError(error as Error);
//     }
//   }, [dispatch, hideBottomSheet]);

//   const handleDeleteProfile = useCallback(async () => {
//     try {
//       const authInstance = getAuth();
//       const user = authInstance.currentUser;
//       if (user) {
//         await firestore().collection('users').doc(user.uid).delete();
//         await user.delete();
//         dispatch(logout());
//         hideBottomSheet();
//       }
//     } catch (error) {
//       console.error('Delete account error:', error);
//       crashlytics().recordError(error as Error);
//     }
//   }, [dispatch, hideBottomSheet]);

//   // --- Navigation handler ---
//   const handleNavigation = useCallback(
//     (screenName: string) => {
//       navigation.navigate(screenName as keyof TabParamList);
//     },
//     [navigation],
//   );

//   // --- Main item press handler ---
//   const handleItemPress = useCallback(
//     (key: string) => {
//       switch (key) {
//         // Navigation cases
//         case 'profile':
//           handleNavigation('Profile'); // Navigate to Profile screen
//           break;
//         case 'friends':
//           handleNavigation('Friends'); // Navigate to Friends screen
//           break;

//         // Bottom sheet cases
//         case 'theme':
//           showBottomSheet({
//             title: 'Select Theme',
//             content: (
//               <ThemeOrganism
//                 selectedTheme={selectedTheme}
//                 onSelect={handleThemeSelect} // Use select handler, not apply
//               />
//             ),
//             buttons: [
//               {
//                 title: 'Apply',
//                 onPress: handleThemeApply,
//               },
//             ],
//             showCloseButton: true,
//             snapPoints: ['40%'],
//           });
//           break;

//         case 'language':
//           showBottomSheet({
//             title: 'Select Language',
//             content: (
//               <LanguageOrganism
//                 selectedLanguage={selectedLanguage}
//                 onSelect={handleLanguageSelect} // Use select handler, not apply
//               />
//             ),
//             buttons: [
//               {
//                 title: 'Apply',
//                 onPress: handleLanguageApply,
//               },
//             ],
//             showCloseButton: true,
//             snapPoints: ['40%'],
//           });
//           break;

//         case 'logout':
//           showBottomSheet({
//             title: 'Confirm Logout',
//             content: <LogoutOrganism onConfirm={handleLogout} />,
//             buttons: [
//               {
//                 title: 'Logout',
//                 onPress: handleLogout,
//                 variant: 'primary',
//               },
//             ],
//             showCloseButton: true,
//             snapPoints: ['30%'],
//           });
//           break;

//         case 'delete':
//           showBottomSheet({
//             title: 'Delete Account',
//             content: <DeleteProfileOrganism onConfirm={handleDeleteProfile} />,
//             buttons: [
//               {
//                 title: 'Delete',
//                 onPress: handleDeleteProfile,
//                 variant: 'primary',
//               },
//             ],
//             showCloseButton: true,
//             snapPoints: ['30%'],
//           });
//           break;

//         default:
//           console.warn(`Unhandled item key: ${key}`);
//           break;
//       }
//     },
//     [
//       selectedTheme,
//       selectedLanguage,
//       handleThemeSelect,
//       handleThemeApply,
//       handleLanguageSelect,
//       handleLanguageApply,
//       handleLogout,
//       handleDeleteProfile,
//       handleNavigation,
//       showBottomSheet,
//     ],
//   );

//   const renderItem = ({ item }: { item: { key: string; title: string } }) => (
//     <TouchableOpacity
//       style={styles.item}
//       onPress={() => handleItemPress(item.key)}>
//       <Text style={styles.itemText} type="semibold">
//         {item.title}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title} type="BOLD">
//         More.More
//       </Text>
//       <CustomFlatList data={settingsData} renderItem={renderItem} />
//     </View>
//   );
// };

// export default More;
import React, { useState, useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CustomFlatList,
  LanguageOrganism,
  Text,
  ThemeOrganism,
  DeleteProfileOrganism,
  LogoutOrganism,
} from '@components/index';

import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from '@redux/slices/ThemeSlice';
import { logout } from '@redux/slices/AuthSlice';
import i18n from '@assets/i18n';
import { getAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import { TabParamList } from '@types/navigations';

import { useBottomSheet } from '../../../context/BottomSheetContext';
import useStyle from './style';

type Props = BottomTabScreenProps<TabParamList, 'More'>;

const More: React.FC<Props> = ({ navigation }) => {
  const styles = useStyle();
  const dispatch = useDispatch();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);

  // --- Auth handlers ---
  const handleLogout = useCallback(async () => {
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
        hideBottomSheet();
      }
    } catch (error) {
      console.error('Logout Error:', error);
      crashlytics().recordError(error as Error);
    }
  }, [dispatch, hideBottomSheet]);

  const handleDeleteProfile = useCallback(async () => {
    try {
      const authInstance = getAuth();
      const user = authInstance.currentUser;
      if (user) {
        await firestore().collection('users').doc(user.uid).delete();
        await user.delete();
        dispatch(logout());
        hideBottomSheet();
      }
    } catch (error) {
      console.error('Delete account error:', error);
      crashlytics().recordError(error as Error);
    }
  }, [dispatch, hideBottomSheet]);

  const settingsConfig = [
    {
      key: 'profile',
      title: 'Profile',
      type: 'navigation' as const,
      screenName: 'Profile',
    },
    {
      key: 'friends',
      title: 'My Friends',
      type: 'navigation' as const,
      screenName: 'Friends',
    },
    {
      key: 'theme',
      title: 'Theme',
      type: 'bottomSheet' as const,
      bottomSheetConfig: {
        title: 'Select Theme',
        content: <ThemeOrganism />,

        showCloseButton: true,
        snapPoints: ['60%'],
      },
    },
    {
      key: 'language',
      title: 'Language',
      type: 'bottomSheet' as const,
      bottomSheetConfig: {
        title: 'Select Language',
        content: <LanguageOrganism />,

        showCloseButton: true,
        snapPoints: ['40%'],
      },
    },
    {
      key: 'delete',
      title: 'Delete Account',
      type: 'bottomSheet' as const,
      bottomSheetConfig: {
        title: 'Delete Account',
        content: <DeleteProfileOrganism onConfirm={handleDeleteProfile} />,
        buttons: [
          {
            title: 'Delete',
            onPress: () => {
              void handleDeleteProfile();
            },
            variant: 'primary' as const,
          },
        ],
        showCloseButton: true,
        snapPoints: ['30%'],
      },
    },
    {
      key: 'logout',
      title: 'Logout',
      type: 'bottomSheet' as const,
      bottomSheetConfig: {
        title: 'Confirm Logout',
        content: <LogoutOrganism onConfirm={handleLogout} />,
        buttons: [
          {
            title: 'Logout',
            onPress: () => {
              void handleLogout();
            },
            variant: 'primary' as const,
          },
        ],
        showCloseButton: true,
        snapPoints: ['30%'],
      },
    },
  ];
  // Single handler for all items - no switch case needed!
  const handleItemPress = useCallback(
    (key: string) => {
      const config = settingsConfig.find(item => item.key === key);

      if (!config) {
        console.warn(`Configuration not found for key: ${key}`);
        return;
      }

      if (config.type === 'navigation') {
        navigation.navigate(config.screenName as keyof TabParamList);
      } else if (config.type === 'bottomSheet') {
        showBottomSheet(config.bottomSheetConfig);
      }
    },
    [settingsConfig, navigation, showBottomSheet],
  );

  const renderItem = ({ item }: { item: (typeof settingsConfig)[0] }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleItemPress(item.key)}>
      <Text style={styles.itemText} type="semibold">
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title} type="BOLD">
        More.More
      </Text>
      <CustomFlatList data={settingsConfig} renderItem={renderItem} />
    </View>
  );
};

export default More;
