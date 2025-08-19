import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { FONTS } from '@utils/helper';
import { height, width } from '@utils/helper';
const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: colors.heromain,
    },
    modalContainer: {
      backgroundColor: colors.white,
      borderTopLeftRadius: scale(16),
      borderTopRightRadius: scale(16),
      padding: scale(16),
      minHeight: height * 0.6,
    },
    title: {
      fontSize: scale(18),
      fontFamily: FONTS.bold,
      marginBottom: 12,
    },
    closeButton: {
      marginTop: 12,
      alignSelf: 'flex-end',
    },
    closeButtonText: {
      fontSize: scale(16),
      fontFamily: FONTS.medium,
    },

    closeIconContainer: {
      position: 'absolute',
      top: scale(12),
      right: scale(12),
      zIndex: 2,
      padding: scale(6),
    },
    closeIcon: {
      width: scale(22),
      height: scale(22),
      tintColor: colors.primary,
    },
  });
};

export default useStyle;
