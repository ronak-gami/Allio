import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
    },
    handle: {
      backgroundColor: colors.primary,
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
      paddingTop: 8,
      paddingBottom: 8,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: scale(16),
      color: colors.text,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },

    closeButton: {
      width: scale(20),
      height: scale(20),
      borderRadius: scale(15),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    closeIcon: {
      fontSize: scale(16),
      width: scale(10),
      height: scale(10),
      tintColor: colors.black,
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
      backgroundColor: colors.primary,
    },

    buttonText: {
      fontSize: scale(16),
    },

    bottomSheet: {
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: scale(16),
    },
    handleIndicator: {
      backgroundColor: colors.gray,
      width: scale(40),
      height: 4,
    },
    background: {
      backgroundColor: 'white',
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
    },

    subtitle: {
      fontSize: 14,
      color: colors.gray,
      textAlign: 'center',
      lineHeight: scale(20),
    },
    titleContainer: {
      flex: 1,
      color: colors.text,
    },

    headerTitle: {
      fontSize: scale(16),
      color: colors.black,
    },
    contentArea: {
      flex: 1,
      paddingVertical: scale(16),
    },
    defaultTitle: {
      fontSize: scale(18),
      fontWeight: 'bold',
      marginBottom: scale(20),
      textAlign: 'center',
      color: colors.text,
    },
    defaultSubtitle: {
      fontSize: scale(14),
      color: colors.gray,
      textAlign: 'center',
      lineHeight: scale(20),
    },
    buttonContainer: {
      paddingVertical: scale(12),
    },
  });
};

export default useStyle;
