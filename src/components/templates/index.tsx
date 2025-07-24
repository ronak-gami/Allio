import { View } from 'react-native';

const AuthTemplate = ({ children }) => {
  return (
    <View style={styles.container}>
      <LogoText />
      <View style={styles.innerContainer}>{children}</View>
    </View>
  );
};
export default AuthTemplate;
