import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () =>
  StyleSheet.create({
    radioRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scale(16),
    },
    radioCircle: {
      width: scale(22),
      height: scale(22),
      borderRadius: scale(11),
      borderWidth: 2,
      borderColor: '#007AFF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(12),
    },
    radioSelected: {
      borderColor: '#FF3B30',
    },
    radioDot: {
      width: scale(10),
      height: scale(10),
      borderRadius: scale(5),
      backgroundColor: '#FF3B30',
    },
    radioLabel: {
      fontSize: scale(16),
      color: '#222',
    },
  });

export default useStyle;
