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
      backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent
    },
    backgroundStyle: {
      backgroundColor: 'red', // Example background style
    },
  });
};

export default useStyles;
