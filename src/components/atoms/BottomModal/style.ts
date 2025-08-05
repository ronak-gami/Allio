import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { FONTS, width } from '@utils/helper';
const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: colors.modabg || 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
      backgroundColor: 'white',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      minHeight: 300,
    },
    title: {
      fontSize: scale(28),
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
  });
};

export default useStyle;
