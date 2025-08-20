import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const useStyles = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    renderBackdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backgroundStyle: {
      backgroundColor: colors.white,
    },
  });
};

export default useStyles;
