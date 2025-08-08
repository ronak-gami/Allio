import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: scale(40),
      paddingHorizontal: scale(12),
      backgroundColor: colors.primary,
      elevation: 4,
      justifyContent: 'space-between',
    },

    backIcon: {
      width: scale(18),
      height: scale(18),
    },
    title: {
      fontSize: scale(20),
      color: colors.black,
    },
    placeholder: {
      width: scale(24),
      height: scale(24),
    },
    logoStyle: {
      marginBottom: scale(-8),
    },
    rightContainer: {
      minWidth: scale(40),
    },
  });
};

export default useStyle;
