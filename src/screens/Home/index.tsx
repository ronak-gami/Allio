// // import React from 'react';
// // import {View} from 'react-native';
// // import {useDispatch, useSelector} from 'react-redux';
// // // import Text from '../../components/Common/Text'; // Adjust path as per your structure
// // // import CustomDropdown from '../../components/Common/CustomDropdown'; // Adjust path as per your structure
// // // import {setLanguage} from '../../redux/slices/LanguageSlice';
// // import {RootState} from '../../redux/store';
// // import styles from './style';
// // import CustomDropdown from '../../components/atoms/Dropdown';
// // import Text from '../../components/atoms/Text';
// // import {setLanguage} from '../../redux/slices/languageSlice';

// // const languages = [
// //   {label: 'English', value: 'en'},
// //   {label: 'हिंदी', value: 'hi'},
// //   {label: 'ગુજરાતી', value: 'gu'},
// // ];

// // const HomeScreen: React.FC = () => {
// //   const dispatch = useDispatch();
// //   const currentLanguage = useSelector(
// //     (state: RootState) => state.language.language,
// //   );

// //   const handleLanguageChange = (value: string) => {
// //     console.log('Selected Language:', value);
// //     dispatch(setLanguage(value));
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>HomeScreen</Text>

// //       <CustomDropdown
// //         label="Select Language"
// //         data={languages.map(lang => lang.label)}
// //         selectedValue={
// //           languages.find(lang => lang.value === currentLanguage)?.label || ''
// //         }
// //         onSelect={label => {
// //           const selected = languages.find(lang => lang.label === label);
// //           if (selected) {
// //             handleLanguageChange(selected.value);
// //           }
// //         }}
// //       />
// //     </View>
// //   );
// // };

// // export default HomeScreen;

// import React from 'react';
// import {View} from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import {useTranslation} from 'react-i18next';

// import styles from './style';
// import CustomDropdown from '../../components/atoms/Dropdown';
// import Text from '../../components/atoms/Text';
// import {setLanguage} from '../../redux/slices/languageSlice';
// import {RootState} from '../../redux/store';

// const languages = [
//   {label: 'English', value: 'en'},
//   {label: 'हिंदी', value: 'hi'},
//   {label: 'ગુજરાતી', value: 'gu'},
// ];

// const HomeScreen: React.FC = () => {
//   const dispatch = useDispatch();
//   const {t} = useTranslation();

//   const currentLanguage = useSelector(
//     (state: RootState) => state.language.language,
//   );

//   const handleLanguageChange = (value: string) => {
//     dispatch(setLanguage(value));
//   };

//   return (
//     <View style={styles.container}>
//       <Text label="home_title" style={styles.title} />

//       <CustomDropdown
//         label={t('select_language')}
//         data={languages.map(lang => lang.label)}
//         selectedValue={
//           languages.find(lang => lang.value === currentLanguage)?.label || ''
//         }
//         onSelect={label => {
//           const selected = languages.find(lang => lang.label === label);
//           if (selected) {
//             handleLanguageChange(selected.value);
//           }
//         }}
//       />
//     </View>
//   );
// };

// export default HomeScreen;

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import CustomDropdown from '../../components/atoms/Dropdown';
import Text from '../../components/atoms/Text';
import Button from '../../components/atoms/Button'; // Assume this exists
import {setLanguage} from '../../redux/slices/languageSlice';
// import {toggleTheme} from '../../redux/slices/themeSlice';
import {RootState} from '../../redux/store';
import {getThemeColors} from '../../utils/themes';
import {toggleTheme} from '../../redux/slices/ThemeSlice';
// import {getThemeColors} from '../../theme/themes';

const languages = [
  {label: 'English', value: 'en'},
  {label: 'हिंदी', value: 'hi'},
  {label: 'ગુજરાતી', value: 'gu'},
];

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const currentLanguage = useSelector(
    (state: RootState) => state.language.language,
  );
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const themeColors = getThemeColors(isDarkMode);

  const handleLanguageChange = (value: string) => {
    dispatch(setLanguage(value));
    dispatch(toggleTheme());
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <View style={[styles.container, {backgroundColor: themeColors.background}]}>
      <Text
        label="home_title"
        style={[styles.title, {color: themeColors.text}]}
      />

      <CustomDropdown
        label={t('select_language')}
        data={languages.map(lang => lang.label)}
        selectedValue={
          languages.find(lang => lang.value === currentLanguage)?.label || ''
        }
        onSelect={label => {
          const selected = languages.find(lang => lang.label === label);
          if (selected) {
            handleLanguageChange(selected.value);
          }
        }}
      />

      <Button
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        onPress={handleThemeToggle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;
