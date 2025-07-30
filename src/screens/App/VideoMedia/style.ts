import { useTheme } from '@react-navigation/native';
import { width } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: width * 0.02,
    },
    content: {
      flex: 1,
    },
    contentNone: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: width * 0.0,
    },
    videoPlayer: {
      width: '100%',
      height: '92%',
    },
    placeholderText: {
      color: colors.text,
      fontSize: scale(24),
    },
    headerView: {
      padding: width * 0.03,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerText: {
      fontSize: scale(18),
      color: colors.primary,
    },
    editIconView: {
      flexDirection: 'row',
      gap: width * 0.2,
      height: width * 0.4,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default useStyle;
