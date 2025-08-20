import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { width, height } from '@utils/helper';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    map: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: '#666',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingHorizontal: 20,
    },
    errorText: {
      fontSize: 16,
      color: '#ff0000',
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 24,
    },
    retryButton: {
      backgroundColor: '#007AFF',
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
      backgroundColor: '#34C759',
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 8,
    },
    manualButtonText: {
      color: '#fff',
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
      backgroundColor: '#007AFF',
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 10,
    },
    sendButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    refreshButton: {
      backgroundColor: '#34C759',
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    refreshButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
};

export default useStyle;
