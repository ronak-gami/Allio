import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },

    title: {
      fontSize: scale(24),
      color: colors.text,
    },
    logoutButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: scale(20),
      paddingVertical: scale(10),
      borderRadius: scale(5),
    },
  });
};

export default useStyle;
