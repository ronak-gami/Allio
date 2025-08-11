import { useTheme } from '@react-navigation/native';
import { width } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { COLORS } from '@utils/color';

const useStyle = () => {
  return StyleSheet.create({
    background: {
      borderTopLeftRadius: scale(10),
      borderTopRightRadius: scale(10),
      shadowColor: COLORS.black,

      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
    },
    handle: {
      backgroundColor: COLORS.primary,
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
      paddingTop: 8,
      paddingBottom: 8,
    },
    handleIndicator: {
      width: scale(40),
      height: scale(4),
      borderRadius: scale(2),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: scale(20),
      paddingVertical: scale(16),

      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: {
      fontSize: scale(18),
      flex: 1,
    },
    closeButton: {
      width: scale(20),
      height: scale(20),
      borderRadius: scale(15),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.primary,
    },
    closeButtonText: {
      fontSize: scale(16),
      width: scale(10),
      height: scale(10),
      tintColor: COLORS.black,
    },
    content: {
      flex: 1,
      paddingHorizontal: scale(20),
      paddingVertical: scale(16),
    },
    buttonsContainer: {
      paddingHorizontal: scale(20),
      paddingTop: scale(16),
      paddingBottom: scale(20),
      gap: 12,
    },
    button: {
      paddingVertical: scale(14),
      paddingHorizontal: scale(20),
      borderRadius: scale(12),
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButton: {
      backgroundColor: COLORS.primary,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
    },
    dangerButton: {
      backgroundColor: COLORS.error,
    },
    buttonText: {
      fontSize: scale(16),
    },
    primaryButtonText: {
      color: COLORS.white,
    },
    dangerButtonText: {
      color: 'white',
    },
  });
};

export default useStyle;
