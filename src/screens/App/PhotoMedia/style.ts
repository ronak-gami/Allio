import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { height, width } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    bgImage: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    container: {
      flex: 1,
      backgroundColor: '#0A0A2A',
    },
    overlay: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      padding: scale(20),
      paddingBottom: height * 0.05,
    },
    heading: {
      fontSize: scale(26),
      color: colors.background,
      marginBottom: scale(20),
    },

    icon: {
      width: height * 0.55,
      height: height * 0.55,
      alignItems: 'center',
    },
  });
};

export default useStyle;
