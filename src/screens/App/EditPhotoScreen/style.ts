import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      height: scale(60),
      paddingHorizontal: scale(20),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    headerText: {
      color: colors.text,
      fontSize: scale(16),
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    bottomBar: {
      height: scale(80),
      backgroundColor: colors.black,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTopWidth: scale(0.5),
    },
    bottomButton: {
      alignItems: 'center',
    },
    bottomText: {
      color: colors.white,
      fontSize: scale(15),
    },
  });
};

export default useStyle;
