import { useTheme } from '@react-navigation/native';
import { width } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      padding: width * 0.03,
    },
    card: {
      width: '100%',
      borderRadius: scale(10),
      padding: width * 0.03,
      position: 'relative',
      gap: width * 0.035,
    },
    title: {
      fontSize: scale(20),
      textAlign: 'center',
    },
    description: {
      fontSize: scale(14),
      textAlign: 'center',
    },
    closeIconContainer: {
      position: 'absolute',
      top: width * 0.02,
      right: width * 0.02,
      padding: width * 0.025,
      zIndex: 999,
    },
    closeIcon: {
      width: width * 0.05,
      height: width * 0.05,
      tintColor: colors.background,
    },
    children: {
      gap: width * 0.035,
    },
  });
};

export default useStyle;
