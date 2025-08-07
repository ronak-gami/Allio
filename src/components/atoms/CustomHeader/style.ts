import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: scale(50),
      paddingHorizontal: scale(12),
      backgroundColor: colors.primary,
      elevation: 4,
    },
    leftContainer: {
      width: scale(48),
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    centerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightContainer: {
      width: scale(48),
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    backButton: {
      padding: scale(8),
    },
    backIcon: {
      width: scale(18),
      height: scale(18),
    },
    title: {
      fontSize: scale(22),
      color: colors.black,
    },
    placeholder: {
      width: scale(24),
      height: scale(24),
    },
  });
};

export default useStyle;
