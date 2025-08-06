import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { height, width } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    card: {
      aspectRatio: 1,
      borderRadius: scale(10),
      overflow: 'hidden',
      height: height * 0.2,
      width: width / 2 - scale(36),
      backgroundColor: colors.background,
    },

    modalBackground: {
      flex: 1,
      backgroundColor: colors.text,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: scale(10),
      overflow: 'hidden',
      alignItems: 'center',
      padding: scale(16),
      width: width * 0.9,
    },
    modalImage: {
      width: '100%',
      height: height * 0.4,
      borderRadius: scale(10),
      resizeMode: 'contain',
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },

    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },

    iconImage: {
      width: height * 0.03,
      height: height * 0.03,
      resizeMode: 'contain',
      tintColor: colors.primary,
    },
  });
};

export default useStyle;
