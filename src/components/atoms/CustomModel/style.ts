import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.35)',
    },
    card: {
      backgroundColor: colors.card || '#fff',
      borderRadius: scale(20),
      padding: scale(24),
      width: '90%',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
    },
    title: {
      fontSize: scale(20),
      fontWeight: 'bold',
      marginBottom: scale(16),
      color: colors.primary || '#222',
      textAlign: 'center',
    },
    description: {
      fontSize: scale(14),
      color: colors.text || '#444',
      marginBottom: scale(12),
      textAlign: 'center',
    },
    children: {
      width: '100%',
      marginTop: scale(8),
    },
    modalContainer: {
      width: '100%',
      alignItems: 'center',
    },
    input: {
      width: '100%',
      marginBottom: scale(12),
      borderRadius: scale(8),
    },
    messageInput: {
      minHeight: scale(60),
      textAlignVertical: 'top',
    },
    button: {
      width: '100%',
      marginTop: scale(8),
      borderRadius: scale(8),
      backgroundColor: colors.primary || '#007AFF',
    },
    closeButton: {
      marginTop: scale(10),
      padding: scale(8),
      alignSelf: 'center',
    },
    closeButtonText: {
      color: colors.primary || '#007AFF',
      fontWeight: 'bold',
      fontSize: scale(16),
    },
    closeIconContainer: {
      position: 'absolute',
      top: scale(12),
      right: scale(12),
      zIndex: 2,
      padding: scale(6),
    },
    closeIcon: {
      width: scale(22),
      height: scale(22),
      tintColor: colors.primary || '#007AFF',
    },
  });
};

export default useStyle;
