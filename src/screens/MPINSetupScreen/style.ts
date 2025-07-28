// import { StyleSheet } from 'react-native';
// import { scale } from 'react-native-size-matters';
// import { useTheme } from '@react-navigation/native';

// const useStyle = () => {
//   const { colors } = useTheme();
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: scale(20),
//       justifyContent: 'flex-start',
//       backgroundColor: colors.background,
//     },
//   });
// };

// export default useStyle;

// import { useTheme } from '@react-navigation/native';
// import { StyleSheet } from 'react-native';
// import { scale } from 'react-native-size-matters';

// const useStyle = () => {
//   const { colors } = useTheme();
//   return StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: scale(20),
//       justifyContent: 'flex-start',
//       backgroundColor: colors.background,
//     },
//   });
// };

// export default useStyle;


import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: scale(20),
      justifyContent: 'flex-start',
      backgroundColor: colors.background,
    },
    iconWrapper: {
      alignItems: 'center',
      marginTop: scale(30),
      marginBottom: scale(20),
    },
    icon: {
      width: scale(150),
      height: scale(150),
      tintColor: colors.primary,
    },
  });
};

export default useStyle;
