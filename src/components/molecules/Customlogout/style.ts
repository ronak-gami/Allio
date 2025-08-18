import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: scale(50),
      height: scale(50),
    },
    description: {
      fontSize: scale(16),
      textAlign: 'center',
      color: colors.black,
    },
  });
};

export default useStyle;
