import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { height } from '@utils/helper';

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
      fontSize: scale(22),
      fontWeight: 'bold',
      marginBottom: height * 0.02,
      textAlign: 'center',
      color: colors.text,
    },
    item: {
      paddingVertical: height * 0.025,
      borderBottomWidth: 1,
      borderColor: colors.text,
    },
    itemText: {
      fontSize: scale(16),
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
