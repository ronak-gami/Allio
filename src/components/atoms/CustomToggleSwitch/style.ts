import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
    },
    switch: {
      justifyContent: 'center',
    },
    switchSmall: {
      width: scale(40),
      height: scale(22),
      borderRadius: scale(11),
    },
    thumbSmall: {
      width: scale(18),
      height: scale(18),
      borderRadius: scale(9),
    },
    switchMedium: {
      width: scale(50),
      height: scale(26),
      borderRadius: scale(13),
    },
    thumbMedium: {
      width: scale(22),
      height: scale(22),
      borderRadius: scale(11),
    },
    switchLarge: {
      width: scale(60),
      height: scale(30),
      borderRadius: scale(15),
    },
    thumbLarge: {
      width: scale(28),
      height: scale(28),
      borderRadius: scale(14),
    },
    thumb: {
      position: 'absolute',
      backgroundColor: colors.white,
    },
  });
};

export default useStyle;
