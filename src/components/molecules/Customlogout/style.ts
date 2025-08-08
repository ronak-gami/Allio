import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: scale(80),
      height: scale(80),
      marginBottom: 20,
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 24,
      color: colors.text,
    },
    button: {
      alignSelf: 'stretch',
    },
  });
};

export default useStyle;
