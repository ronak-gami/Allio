import { useTheme } from '@react-navigation/native';
import { height } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      paddingTop: scale(15),
      backgroundColor: colors.background,
      gap: scale(20),
    },
    title: {
      fontSize: 20,
      color: colors.text,
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    tab: {
      alignItems: 'center',
    },
    icon: {
      width: height * 0.025,
      height: height * 0.04,
      marginBottom: 4,
    },
    label: {
      fontSize: scale(12),
      color: colors.text,
    },
    activeLabel: {
      color: colors.primary,
    },
  });
};
export default useStyle;
