import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { FONTS } from '@assets/index';

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
      minHeight: scale(45),
    },
    inputContainerFocused: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    inputContainerError: {
      borderColor: colors.error,
    },
    inputContainerDisabled: {
      backgroundColor: colors.lightgray,
      borderColor: colors.gray,
    },
    textInput: {
      flex: 1,
      fontSize: scale(14),
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
      fontSize: scale(18),
    },
    errorText: {
      fontSize: scale(12),
      color: colors.error,
      marginTop: 4,
    },
    counterText: {
      fontSize: scale(12),
      color: colors.gray,
      textAlign: 'right',
      marginTop: scale(4),
    },
    placeHolderColor: {
      color: colors.gray,
    },
  });
};

export default useStyle;
