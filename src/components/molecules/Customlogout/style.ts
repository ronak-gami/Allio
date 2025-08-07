import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () =>
  StyleSheet.create({
    container: {
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 120,
      height: 120,
      marginBottom: 20,
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 24,
      color: '#333',
    },
    button: {
      alignSelf: 'stretch',
    },
  });

export default useStyle;
