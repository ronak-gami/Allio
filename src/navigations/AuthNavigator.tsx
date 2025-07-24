import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash';
import OnboardingScreen from '../screens/onboarding';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegistrationScreen';
import ForgotPassword from '../screens/ForgetPasswordScreen';
import { AUTH } from '../utils/constant';

const Stack = createNativeStackNavigator();
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Onboarding">
      <Stack.Screen name={AUTH.Splash} component={SplashScreen} />
      <Stack.Screen name={AUTH.Onboarding} component={OnboardingScreen} />
      <Stack.Screen name={AUTH.Login} component={LoginScreen} />
      <Stack.Screen name={AUTH.Register} component={RegisterScreen} />
      <Stack.Screen name={AUTH.ForgotPassword} component={ForgotPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
