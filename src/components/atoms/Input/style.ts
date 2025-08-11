// import { StyleSheet } from 'react-native';

// import { useTheme } from '@react-navigation/native';
// import { scale } from 'react-native-size-matters';

// const useStyle = () => {
//   const { colors } = useTheme();
//   return StyleSheet.create({
//     inputContainer: {
//       width: '100%',
//     },
//     inputField: {
//       fontFamily: '',
//       fontSize: scale(14),
//       backgroundColor: colors.white,
//     },
//     textInput: {
//       fontFamily: 'WinkyRough-Regular',
//       fontSize: scale(14),
//       color: colors.black,
//     },
//     multiline: {
//       minHeight: 100,
//       textAlignVertical: 'top',
//     },
//     errorText: {
//       color: colors.error,
//       fontSize: scale(12),
//     },
//     icon: {
//       width: scale(20),
//       height: scale(20),
//       tintColor: colors.black,
//     },
//     prefixIcon: {
//       width: scale(18),
//       height: scale(18),
//       tintColor: colors.gray,
//     },
//   });
// };

// export default useStyle;

import { StyleSheet } from 'react-native';

import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { FONTS } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {},
    label: {
      fontSize: scale(14),
      color: colors.text,
      marginBottom: scale(4),
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.text,
      borderRadius: scale(10),
      backgroundColor: colors.background,
      minHeight: 48,
    },
    inputContainerFocused: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    inputContainerError: {
      borderColor: colors.error,
    },
    inputContainerDisabled: {
      backgroundColor: '#f5f5f5',
      borderColor: '#e0e0e0',
    },
    textInput: {
      flex: 1,
      fontSize: scale(12),
      fontFamily: FONTS.regular,
      color: colors.text,
      paddingHorizontal: scale(12),
      paddingVertical: scale(12),
    },
    textInputMultiline: {
      paddingTop: scale(12),
      textAlignVertical: 'top',
    },
    passwordToggle: {
      padding: 12,
    },
    icon: {
      width: scale(20),
      height: scale(20),
      tintColor: colors.primary,
    },
    passwordToggleText: {
      fontSize: 18,
    },
    errorText: {
      fontSize: 12,
      color: '#FF3B30',
      marginTop: 4,
    },
    counterText: {
      fontSize: 12,
      color: '#666',
      textAlign: 'right',
      marginTop: 4,
    },
    placeHolderColor: {
      color: colors.gray,
    },
  });
};

export default useStyle;
