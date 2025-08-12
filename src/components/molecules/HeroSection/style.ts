import { Dimensions, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const { width: W, height: H } = Dimensions.get('window');

export default function useStyle() {
  const { colors } = useTheme();

  return StyleSheet.create({
    bg: {
      width: W,
      height: H * 0.6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.heromain,
      paddingHorizontal: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      marginBottom: scale(10),
      fontSize: scale(28),
      color: colors.white,
      textAlign: 'center',
    },

    description: {
      fontSize: scale(18),
      color: colors.text,
      textAlign: 'center',
      lineHeight: scale(22),
    },
    buttonRow: {
      flexDirection: 'row',
      marginTop: scale(24),
      justifyContent: 'space-around',
      width: '60%',
    },
    button: {
      backgroundColor: colors.primary,
      paddingHorizontal: scale(24),
    },
  });
}
