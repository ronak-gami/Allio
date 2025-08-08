// import { StyleSheet } from 'react-native';
// import { scale } from 'react-native-size-matters';
// import { useTheme } from '@react-navigation/native';

// const useStyle = () => {
//   const { colors } = useTheme();
//   return StyleSheet.create({
//     sheetContent: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     sheetBg: {
//       flex: 1,
//       marginTop: scale(20),
//       borderTopLeftRadius: scale(20),
//       borderTopRightRadius: scale(20),
//       backgroundColor: colors.primary,
//     },
//     header: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       paddingHorizontal: scale(20),
//       paddingTop: scale(16),
//       paddingBottom: scale(8),
//     },
//     closeBtn: {
//       marginRight: scale(8),
//       padding: scale(6),
//     },
//     closeIcon: {
//       width: scale(22),
//       height: scale(22),
//       tintColor: colors.black,
//     },
//     title: {
//       fontSize: 18,
//       flex: 1,
//       color: colors.black,
//     },
//     content: {
//       flex: 1,
//       paddingHorizontal: scale(20),
//       paddingVertical: scale(8),
//     },
//     bottomButton: {
//       margin: scale(20),
//       borderRadius: scale(12),
//     },
//   });
// };

// export default useStyle;
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    sheetContent: {
      padding: scale(16),
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: colors.white,
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
    },
    handle: {
      backgroundColor: 'transparent',
      paddingTop: 6,
      paddingBottom: 3,
    },
    handleIndicator: {
      width: 40,
      height: 4,
      borderRadius: 2,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: scale(12),
    },
    title: {
      fontSize: scale(20),
      flex: 1,
      color: colors.black,
    },
    closeBtn: {
      padding: scale(6),
      marginLeft: scale(8),
    },
    closeIcon: {
      width: scale(10),
      height: scale(10),
      tintColor: colors.black,
    },
    content: {
      flex: 1,
      marginBottom: scale(16),
    },
    bottomButton: {
      marginTop: scale(20),
    },
  });
};

export default useStyle;
