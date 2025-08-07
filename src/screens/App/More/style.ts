import { StyleSheet } from 'react-native';
import { height } from '@utils/helper';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: height * 0.02,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: scale(22),
      fontWeight: 'bold',
      marginBottom: height * 0.02,
      textAlign: 'center',
    },
    item: {
      paddingVertical: height * 0.025,
      // paddingHorizontal: height * 0.02,
      borderBottomWidth: 1,
      borderColor: colors.lightGrey,
    },
    itemText: {
      fontSize: scale(16),
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
