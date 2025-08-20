import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { width, height } from '@utils/helper';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.error,
    },
    map: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.text,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: 20,
    },
    errorText: {
      fontSize: 16,
      color: colors.error,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 24,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 8,
      marginBottom: 10,
    },
    retryButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    manualButton: {
      backgroundColor: colors.success,
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 8,
    },
    manualButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
    },
    sendButton: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 10,
    },
    sendButtonText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '600',
    },
    refreshButton: {
      backgroundColor: colors.success,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    refreshButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
  });
};

export default useStyle;
