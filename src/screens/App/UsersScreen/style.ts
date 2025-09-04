import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { height, width } from '@utils/helper';
import { head } from 'node_modules/axios/index.d.cts';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: scale(15),
    },
    contentContainer: {
      gap: width * 0.02,
    },
    userItem: {
      backgroundColor: colors.text,
      borderRadius: scale(10),
      padding: width * 0.025,
    },
    errorText: {
      color: colors.error,
      fontSize: scale(16),
      textAlign: 'center',
    },
    emptyText: {
      color: colors.lightgray,
      fontSize: scale(15),
      textAlign: 'center',
    },
  });
};

export default useStyle;
