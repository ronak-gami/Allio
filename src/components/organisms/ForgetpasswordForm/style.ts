import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: scale(20),
      paddingTop: scale(80),
    },
    backButton: {
      position: 'absolute',
      top: scale(40),
      left: scale(20),
      zIndex: 1,
    },
    form: {
      gap: scale(20),
    },
    title: {
      fontSize: scale(24),
      textAlign: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: scale(20),
    },
    subtitle: {
      fontSize: scale(16),
      textAlign: 'center',
      color: colors.gray,
    },
    loginButton: {
      marginTop: scale(16),
      marginVertical: scale(6),
      backgroundColor: colors.primary,
      borderRadius: scale(8),
      paddingVertical: scale(12),
    },
  });
};
export default useStyle;
