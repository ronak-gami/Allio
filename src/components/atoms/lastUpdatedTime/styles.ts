import { useTheme } from '@react-navigation/native';
import { width } from '@utils/helper';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.text,
      borderRadius: 5,
      marginVertical: width * 0.02,
      paddingHorizontal: width * 0.03,
      marginHorizontal: width * 0.04,
      paddingVertical: width * 0.02,
    },
    image: {
      width: width * 0.04,
      height: width * 0.04,
    },
  });
};

export default useStyle;
