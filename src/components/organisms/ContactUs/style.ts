import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    sectionContainer: {
      paddingHorizontal: scale(10),
    },
    contactButton: {
      backgroundColor: colors.primary,
      borderRadius: scale(12),
      marginBottom: scale(16),
    },
    title: {
      fontSize: scale(24),
      color: colors.text,
      marginBottom: scale(8),
    },
  });
};

export default useStyle;
