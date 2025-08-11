import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
// import { useTheme } from '@react-navigation/native';
import { COLORS } from '@utils/color';

const useStyle = () => {
  // const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: scale(50),
      height: scale(50),
      marginBottom: 20,
    },
    description: {
      fontSize: scale(16),
      textAlign: 'center',
      marginBottom: 24,
      color: COLORS.black,
    },
    button: {
      alignSelf: 'stretch',
    },
  });
};

export default useStyle;
