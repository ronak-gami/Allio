import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { height } from '@utils/helper';
const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: scale(16),
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    separator: {
      height: scale(1),
      backgroundColor: colors.text,
    },
    itemText: {
      fontSize: scale(18),
      color: colors.text,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: height * 0.2,
      fontSize: scale(16),
      color: colors.grey,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
export default useStyle;
