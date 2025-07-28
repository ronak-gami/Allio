import { useTheme } from '@react-navigation/native';
import { height } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      marginHorizontal: height * 0.02,
    },
    subView: { flexGrow: 1 },
    title: {
      fontSize: scale(34),
      marginBottom: scale(20),
      textAlign: 'center',
    },
    subtitle: {
      fontSize: scale(16),
      marginTop: scale(10),
    },
    otpContainer: {
      marginVertical: scale(10),
      justifyContent: 'space-between',
    },
    otpInput: {
      borderRadius: scale(10),
      borderWidth: 1,
      width: scale(50),
      height: scale(50),
      textAlign: 'center',
      fontSize: scale(18),
    },
    errorText: {
      color: 'red',
      alignSelf: 'flex-end',
      fontSize: scale(14),
    },
    button: {
      marginTop: scale(20),
      padding: scale(15),
      borderRadius: scale(10),
    },
  });
};
export default useStyle;
