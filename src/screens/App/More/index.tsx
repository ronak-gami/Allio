// import React from 'react';
// import { View, TouchableOpacity } from 'react-native';
// import { useDispatch } from 'react-redux';
// import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// import firestore from '@react-native-firebase/firestore';
// import crashlytics from '@react-native-firebase/crashlytics';
// import { getAuth } from '@react-native-firebase/auth';

// import { CustomFlatList, Text } from '@components/index';
// import { TabParamList } from '@types/navigations';
// import { logout } from '@redux/slices/AuthSlice';
// import useStyle from './style';
// import { HOME } from '@utils/constant';

// type Props = BottomTabScreenProps<TabParamList, 'More'>;

// const More: React.FC<Props> = ({ navigation }) => {
//   const styles = useStyle();
//   const dispatch = useDispatch();

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
//       }
//     } catch (error) {
//       console.error('Logout Error:', error);
//       crashlytics().recordError(error as Error);
//     }
//   };

//   const handleItemPress = (key: string) => {
//     switch (key) {
//       case 'profile':
//         // navigation.navigate('Profile');
//         break;
//       case 'friends':
//         navigation.navigate(HOME.MyFriends);
//         break;
//       case 'theme':
//         // navigation.navigate('Theme');
//         break;
//       case 'language':
//         // navigation.navigate('Language');
//         break;
//       case 'delete':
//         // navigation.navigate('DeleteAccount');
//         break;
//       case 'logout':
//         handleLogout();
//         break;
//       default:
//         break;
//     }
//   };

//   const settingsData = [
//     { key: 'profile', title: 'Profile' },
//     { key: 'friends', title: 'My Friends' },
//     { key: 'theme', title: 'Theme' },
//     { key: 'language', title: 'Language' },
//     { key: 'delete', title: 'Delete Account' },
//     { key: 'logout', title: 'Logout' },
//   ];

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
//         More
//       </Text>
//       <CustomFlatList data={settingsData} renderItem={renderItem} />
//     </View>
//   );
// };

// export default More;
// import React, { useRef, useState } from 'react';
// import { View, TouchableOpacity } from 'react-native';
// import { useDispatch } from 'react-redux';
// import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// import { CustomFlatList, Text } from '@components/index';
// import useStyle from './style';
// import { TabParamList } from '@types/navigations';
// import { HOME } from '@utils/constant';

// // Import your components
// import CustomBottomSheet from '@components/molecules/CustomBottomSheet';
// import RadioGroup from '@components/molecules/RadioGroups';

// type Props = BottomTabScreenProps<TabParamList, 'More'>;

// const More: React.FC<Props> = ({ navigation }) => {
//   const styles = useStyle();
//   const dispatch = useDispatch();

//   // BottomSheet state
//   const sheetRef = useRef<any>(null);
//   const [selectedTheme, setSelectedTheme] = useState('light');

//   const themeOptions = [
//     { label: 'Light', value: 'light' },
//     { label: 'Dark', value: 'dark' },
//   ];

//   const handleItemPress = (key: string) => {
//     switch (key) {
//       case 'theme':
//         sheetRef.current?.expand();
//         break;
//       // ...other cases
//     }
//   };

//   const handleThemeConfirm = () => {
//     // dispatch(setDarkMode(selectedTheme === 'dark'));
//     sheetRef.current?.close();
//   };

//   const settingsData = [
//     { key: 'theme', title: 'Theme' },
//     // ...other items
//   ];

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
//       <CustomFlatList data={settingsData} renderItem={renderItem} />

//       <CustomBottomSheet
//         ref={sheetRef}
//         title="Select Theme"
//         buttonTitle="Apply"
//         onButtonPress={handleThemeConfirm}
//         onClose={() => sheetRef.current?.close()}>
//         <RadioGroup
//           options={themeOptions}
//           selectedValue={selectedTheme}
//           onSelect={setSelectedTheme}
//         />
//       </CustomBottomSheet>
//     </View>
//   );
// };

// export default More;

// import React, { useCallback, useRef } from 'react';
// import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { BottomSheetModal } from '@gorhom/bottom-sheet';
// import {
//   BottomSheetWrapper,
//   CustomBottomSheetModal,
// } from '@components/molecules/CustomBottomSheetModal';

// const More = () => {
//   const sheetRef = useRef<BottomSheetModal>(null);

//   const handlePresentModalPress = useCallback(() => {
//     sheetRef.current?.present();
//   }, []);

//   return (
//     <BottomSheetWrapper>
//       <View style={styles.container}>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={handlePresentModalPress}>
//           <Text style={styles.buttonText}>Open Bottom Sheet</Text>
//         </TouchableOpacity>

//         <CustomBottomSheetModal
//           ref={sheetRef}
//           content={<Text>Hello, this is your static content!</Text>}
//         />
//       </View>
//     </BottomSheetWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'beige',
//   },
//   button: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 4,
//   },
//   buttonText: { color: 'white', fontSize: 16 },
// });

// export default More;
// import React, { useCallback, useRef } from 'react';
// import { View, StyleSheet, TouchableOpacity } from 'react-native';
// import { BottomSheetModal } from '@gorhom/bottom-sheet';
// import {
//   BottomSheetWrapper,
//   CustomBottomSheetModal,
// } from '@components/molecules/CustomBottomSheetModal';
// import Text from '@components/atoms/Text';

// const settingsData = [
//   { key: 'theme', title: 'Theme' },
//   // Add other items as needed
// ];

// const More = () => {
//   const sheetRef = useRef<BottomSheetModal>(null);

//   const handleItemPress = useCallback((key: string) => {
//     if (key === 'theme') {
//       sheetRef.current?.present();
//     }
//     // handle other keys as needed
//   }, []);

//   const renderItem = ({ item }: { item: { key: string; title: string } }) => (
//     <TouchableOpacity
//       style={styles.button}
//       onPress={() => handleItemPress(item.key)}>
//       <Text style={styles.buttonText}>{item.title}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <BottomSheetWrapper>
//       <View style={styles.container}>
//         {settingsData.map(item => renderItem({ item }))}
//         <CustomBottomSheetModal
//           ref={sheetRef}
//           title="Select Theme"
//           buttonTitle="Apply"
//           onButtonPress={() => sheetRef.current?.dismiss()}
//           onClose={() => sheetRef.current?.dismiss()}>
//           <Text>Hello, this is your static content!</Text>
//         </CustomBottomSheetModal>
//       </View>
//     </BottomSheetWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'beige',
//   },
//   button: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 4,
//     marginBottom: 12,
//   },
//   buttonText: { color: 'white', fontSize: 16 },
// });

// export default More;
// import React, { useCallback, useRef, useState } from 'react';
// import { View, StyleSheet, TouchableOpacity } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { BottomSheetModal } from '@gorhom/bottom-sheet';
// import {
//   BottomSheetWrapper,
//   CustomBottomSheetModal,
// } from '@components/molecules/CustomBottomSheetModal';
// import Text from '@components/atoms/Text';
// import RadioGroup from '@components/molecules/RadioGroups';
// import { setDarkMode } from '@redux/slices/ThemeSlice'; // adjust path as needed

// const settingsData = [
//   { key: 'theme', title: 'Theme' },
//   // Add other items as needed
// ];

// const themeOptions = [
//   { label: 'Light', value: 'light' },
//   { label: 'Dark', value: 'dark' },
// ];

// const More = () => {
//   const sheetRef = useRef<BottomSheetModal>(null);
//   const dispatch = useDispatch();
//   const isDarkMode = useSelector((state: any) => state.theme.isDarkMode); // adjust selector as needed
//   const [selectedTheme, setSelectedTheme] = useState(
//     isDarkMode ? 'dark' : 'light',
//   );

//   const handleItemPress = useCallback((key: string) => {
//     if (key === 'theme') {
//       sheetRef.current?.present();
//     }
//     // handle other keys as needed
//   }, []);

//   const handleThemeConfirm = () => {
//     dispatch(setDarkMode(selectedTheme === 'dark'));
//     sheetRef.current?.dismiss();
//   };

//   const renderItem = ({ item }: { item: { key: string; title: string } }) => (
//     <TouchableOpacity
//       style={styles.button}
//       onPress={() => handleItemPress(item.key)}>
//       <Text style={styles.buttonText}>{item.title}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <BottomSheetWrapper>
//       <View style={styles.container}>
//         {settingsData.map(item => renderItem({ item }))}
//         <CustomBottomSheetModal
//           ref={sheetRef}
//           title="Select Theme"
//           buttonTitle="Apply"
//           onButtonPress={handleThemeConfirm}
//           onClose={() => sheetRef.current?.dismiss()}>
//           <RadioGroup
//             options={themeOptions}
//             selectedValue={selectedTheme}
//             onSelect={setSelectedTheme}
//           />
//         </CustomBottomSheetModal>
//       </View>
//     </BottomSheetWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'beige',
//   },
//   button: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 4,
//     marginBottom: 12,
//   },
//   buttonText: { color: 'white', fontSize: 16 },
// });

// export default More;

//this is latest for screens
// import React, { useRef, useState } from 'react';
// import { View, TouchableOpacity } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { CustomFlatList, Text } from '@components/index';
// import useStyle from './style';
// import { HOME } from '@utils/constant';
// import {
//   CustomBottomSheetModal,
//   BottomSheetWrapper,
// } from '@components/molecules/CustomBottomSheetModal';
// import ThemeOrganism from '@components/organisms/TheamBottomSheet';
// import { setDarkMode } from '@redux/slices/ThemeSlice'; // adjust path if needed

// const settingsData = [
//   { key: 'profile', title: 'Profile' },
//   { key: 'friends', title: 'My Friends' },
//   { key: 'theme', title: 'Theme' },
//   { key: 'language', title: 'Language' },
//   { key: 'delete', title: 'Delete Account' },
//   { key: 'logout', title: 'Logout' },
// ];

// const More: React.FC = () => {
//   const styles = useStyle();
//   const dispatch = useDispatch();
//   const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);
//   const [selectedTheme, setSelectedTheme] = useState(
//     isDarkMode ? 'dark' : 'light',
//   );
//   const sheetRef = useRef<any>(null);

//   const handleItemPress = (key: string) => {
//     if (key === 'theme') {
//       sheetRef.current?.present();
//     }
//     // handle other keys as needed
//   };

//   const handleThemeConfirm = () => {
//     dispatch(setDarkMode(selectedTheme === 'dark'));
//     sheetRef.current?.dismiss();
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
//     <BottomSheetWrapper>
//       <View style={styles.container}>
//         <Text style={styles.title} type="BOLD">
//           More
//         </Text>
//         <CustomFlatList data={settingsData} renderItem={renderItem} />
//         <CustomBottomSheetModal
//           ref={sheetRef}
//           title="Select Theme"
//           buttonTitle="Apply"
//           onButtonPress={handleThemeConfirm}
//           onClose={() => sheetRef.current?.dismiss()}>
//           <ThemeOrganism
//             selectedTheme={selectedTheme}
//             onSelect={setSelectedTheme}
//           />
//         </CustomBottomSheetModal>
//       </View>
//     </BottomSheetWrapper>
//   );
// };

// export default More;
import React, { useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
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
import { logout } from '@redux/slices/AuthSlice';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import { getAuth } from '@react-native-firebase/auth';
import { setDarkMode } from '@redux/slices/ThemeSlice';
import i18n from '@assets/i18n';
const settingsData = [
  { key: 'profile', title: 'Profile' },
  { key: 'friends', title: 'My Friends' },
  { key: 'theme', title: 'Theme' },
  { key: 'language', title: 'Language' },
  { key: 'delete', title: 'Delete Account' },
  { key: 'logout', title: 'Logout' },
];

const More: React.FC = () => {
  const styles = useStyle();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light'>(
    isDarkMode ? 'dark' : 'light',
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    i18n.language || 'en',
  );
  const [sheetType, setSheetType] = useState<
    'theme' | 'language' | 'logout' | null
  >(null);
  const sheetRef = useRef<any>(null);

  const handleItemPress = (key: string) => {
    if (key === 'theme') {
      setSheetType('theme');
      sheetRef.current?.present();
    } else if (key === 'language') {
      setSheetType('language');
      sheetRef.current?.present();
    } else if (key === 'logout') {
      setSheetType('logout');
      sheetRef.current?.present();
    }
    // handle other keys as needed
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
        sheetRef.current?.dismiss();
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
    sheetRef.current?.dismiss();
  };

  const renderItem = ({ item }: { item: { key: string; title: string } }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleItemPress(item.key)}>
      <Text style={styles.itemText} type="semibold">
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <Text style={styles.title} type="BOLD">
          More
        </Text>
        <CustomFlatList data={settingsData} renderItem={renderItem} />
        <CustomBottomSheetModal
          ref={sheetRef}
          title={sheetType === 'theme' ? 'Select Theme' : 'Select Language'}
          buttonTitle={
            sheetType === 'theme' || sheetType === 'language'
              ? 'Apply'
              : 'Logout'
          } // 🔥 Hide button for logout
          onButtonPress={
            sheetType === 'theme' || sheetType === 'language'
              ? handleApply
              : handleLogout
          }
          onClose={() => sheetRef.current?.dismiss()}>
          {sheetType === 'theme' && (
            <ThemeOrganism
              selectedTheme={selectedTheme}
              onSelect={setSelectedTheme}
            />
          )}
          {sheetType === 'language' && (
            <LanguageOrganism
              selectedLanguage={selectedLanguage}
              onSelect={setSelectedLanguage}
            />
          )}

          {sheetType === 'logout' && (
            <LogoutOrganism onConfirm={handleLogout} />
          )}
        </CustomBottomSheetModal>
      </View>
    </BottomSheetWrapper>
  );
};

export default More;
