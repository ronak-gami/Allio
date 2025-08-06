import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { width, height } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    logoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      width: width * 0.2,
      height: height * 0.092,
      resizeMode: 'contain',
      borderRadius: scale(10),
    },
    text: {
      fontSize: scale(22),
      fontWeight: 'bold',
      color: colors.black,
      letterSpacing: 2,
    },
  });
};
export default useStyle;
