import { StyleSheet } from 'react-native';

const useStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 16,
    },
  });
};
export default useStyle;
