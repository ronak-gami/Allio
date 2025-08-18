import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: scale(10),
    },
    contentContainer: {
      flexGrow: 1,
    },
    iconWrapper: {
      alignItems: 'center',
      marginTop: scale(30),
      marginBottom: scale(20),
    },
    icon: {
      width: scale(150),
      height: scale(150),
      tintColor: colors.primary,
    },
  });
};
export default useStyle;
