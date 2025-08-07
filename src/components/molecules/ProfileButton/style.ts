import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    button: {
      padding: scale(5),
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: scale(10),
      borderRadius: scale(18),
    },
    icon: {
      width: scale(32),
      height: scale(32),
    },
  });
};
export default useStyle;
