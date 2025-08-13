import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      borderRadius: scale(20),
      width: '90%',
      alignItems: 'center',
      elevation: 8,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      gap: scale(10),
      paddingHorizontal: scale(10),
      paddingVertical: scale(15),
    },
    title: {
      fontSize: scale(20),
      color: colors.primary,
      textAlign: 'center',
    },
    description: {
      fontSize: scale(14),
      color: colors.text,
      textAlign: 'center',
    },
    children: {
      width: '100%',
      gap: scale(10),
    },
    closeIconContainer: {
      position: 'absolute',
      top: scale(10),
      right: scale(10),
      zIndex: 2,
      padding: scale(8),
    },
    closeIcon: {
      width: scale(20),
      height: scale(20),
      tintColor: colors.background,
    },
  });
};

export default useStyle;
