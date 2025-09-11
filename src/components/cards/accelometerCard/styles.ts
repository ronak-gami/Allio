import { useTheme } from '@react-navigation/native';
import { width, height } from '@utils/helper';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      paddingHorizontal: width * 0.04,
      paddingVertical: height * 0.02,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    text: {
      color: colors.text,
    },
  });
};

export default useStyle;
