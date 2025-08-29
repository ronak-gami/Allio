import { useTheme } from '@react-navigation/native';
import { width, height } from '@utils/helper';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    gridItem: {
      backgroundColor: colors.background,
      borderRadius: width * 0.03,
      marginVertical: height * 0.01,
      marginHorizontal: width * 0.04,
      padding: width * 0.04,
      shadowColor: colors.black,
      shadowOpacity: 0.1,
      shadowRadius: width * 0.02,
      elevation: 3,
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: width * 0.02,
    },
    image: {
      width: width * 0.16,
      height: width * 0.16,
      borderRadius: width * 0.02,
      backgroundColor: colors.babyBlue,
    },
    delete: {
      width: width * 0.06,
      height: width * 0.06,
    },
    edit: {
      width: width * 0.05,
      height: width * 0.05,
    },
  });
};

export default useStyle;
