import { StyleSheet } from 'react-native';
const useStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    ScrollingStyle: {
      flexGrow: 1,
      justifyContent: 'center',
    },
  });
};
export default useStyle;
