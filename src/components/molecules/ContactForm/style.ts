import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    form: {
      gap: scale(10),
      marginTop: scale(10),
    },
    input: {
      width: '100%',
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
      backgroundColor: colors.primary,
    },
    closeButton: {
      marginTop: scale(10),
      padding: scale(8),
    },
    closeButtonText: {
      color: colors.primary,
      fontSize: scale(16),
    },
  });
};

export default useStyle;
