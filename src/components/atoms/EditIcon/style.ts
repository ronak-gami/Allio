import { useTheme } from '@react-navigation/native';
import { width } from '@utils/helper';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    EditIcon: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: width * 0.015,
    },
    container: {
      borderWidth: 1,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomLabel: {
      color: colors.text,
    },
  });
};

export default useStyle;
