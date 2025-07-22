import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import SplashScreen from './src/screens/splash';
import Onboarding from './src/screens/onboarding';
import LoginForm from './src/components/organisma/LoginForm';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegistrationScreen';
import ForgotPassword from './src/screens/ForgetPasswordScreen';
import ForgotPasswordScreen from './src/components/organisma/ForgetpasswordForm';

const App = () => {
  // const [showSplash, setShowSplash] = useState(true);
  // useEffect(() => {
  //   setTimeout(() => setShowSplash(false), 2000); // Hide splash after 2s
  // }, []);
  return (
    <View style={styles.container}>
      {/* <Onboarding/> */}
     <ForgotPasswordScreen/>
      {/* <RegisterScreen /> */}
      {/* <LoginScreen /> */}
      {/* {showSplash ? <SplashScreen /> : <Onboarding />} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
